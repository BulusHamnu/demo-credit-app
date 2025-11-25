import db from "../database/db.js";
import AppError from "../errors/appError.js";
import { generateTransactionReference } from "../utils/helpers.js";

interface Wallet {
  id: number;
  balance: number;
  address: string;
  user_id: number;
  created_at: Date;
}

enum type {
  deposit = "deposit",
  withdrawal = "withdrawal",
  transfer = "transfer",
}
export interface Transaction {
  id: number;
  amount: number;
  receiver_wallet_id: number;
  sender_wallet_id: number;
  type: type;
  reference: string;
  initiated_by: number;
  notes: string;
  created_at: Date;
}

// Fund user's wallet service
export const fundWallet = async (
  amount: number,
  address: string,
  notes: string = "",
  user_id: number
): Promise<boolean> => {
  await db.transaction(async (trx) => {
    const wallet: Wallet = await trx("wallets").where({ address }).first();

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    await trx("wallets").where({ address }).increment("balance", amount);

    const reference = generateTransactionReference();
    // record transaction
    await trx("transactions").insert({
      amount,
      receiver_wallet_id: wallet.id,
      type: "deposit",
      notes: notes || "",
      reference,
      initiated_by: user_id,
    });
  });
  return true;
};

// Get all user's transaction service
export type Transactions = Transaction[];
export const getUserTransactions = async (
  user_id: number
): Promise<Transactions> => {
  const transactions: Transactions = await db("transactions").where({
    initiated_by: user_id,
  });

  return transactions;
};

// Transfer service
export const tranferToWallet = async (
  amount: number,
  address: string,
  notes: string = "",
  user_id: number
): Promise<boolean> => {
  const senderWallet: Wallet = await db("wallets")
    .where({ user_id: user_id })
    .first();

  if (!senderWallet) throw new AppError("No wallet found.", 404);

  // check if user have enough credit
  if (Number(senderWallet.balance) < Number(amount)) {
    throw new AppError("insufficient balance.", 400);
  }

  await db.transaction(async (trx) => {
    const receiverWallet: Wallet = await trx("wallets")
      .where({ address })
      .first();

    if (!receiverWallet) {
      throw new AppError(`Wallet ${address} was not found`, 404);
    }

    // check if both party wallet are the same
    if (senderWallet.id === receiverWallet.id) {
      throw new AppError("You can not transfer to youself.", 400);
    }

    await trx("wallets")
      .where({ address: senderWallet.address })
      .decrement("balance", amount);
    await trx("wallets")
      .where({ address: receiverWallet.address })
      .increment("balance", amount);

    const reference = generateTransactionReference();
    // record transaction
    await trx("transactions").insert({
      amount,
      receiver_wallet_id: receiverWallet.id,
      sender_wallet_id: senderWallet.id,
      type: "transfer",
      notes: notes || "",
      reference,
      initiated_by: user_id,
    });
  });

  console.log(
    `Transfer of :${amount} by: ${user_id} to wallet: ${address} was successful.`
  );
  return true;
};
