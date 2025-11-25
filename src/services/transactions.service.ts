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
