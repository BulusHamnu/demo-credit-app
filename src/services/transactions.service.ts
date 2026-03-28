import db from "../database/db.js";
import AppError, { ErrorCodes } from "../errors/appError.js";
import { generateTransactionReference } from "../utils/helpers.js";
import { getUserWallet } from "./wallet.service.js";

interface Wallet {
  id: number;
  balance: number;
  address: string;
  user_id: number;
  created_at: Date;
}

enum TransactionType {
  deposit = "deposit",
  withdrawal = "withdrawal",
  transfer = "transfer",
}

export interface Transaction {
  id: number;
  amount: number;
  receiver_wallet_id: number;
  sender_wallet_id: number;
  type: TransactionType;
  reference: string;
  initiated_by: number;
  notes: string;
  created_at: Date;
}

function validateAmount(amount: number) {
  if (amount < 100) {
    throw new AppError(
      ErrorCodes.AMOUNT_INVALID,
      "Amount can not be less than 100.", // Assuming 100 is the lowest limit.
      400,
      true,
    );
  }
}

async function retriveUserWallet(
  userId: number,
  address: string,
): Promise<Wallet> {
  const wallet: Wallet = await db("wallets")
    .where({ address, user_id: userId })
    .first();

  if (!wallet)
    throw new AppError(
      ErrorCodes.WALLET_NOT_FOUND,
      "Wallet not found..",
      404,
      true,
    );

  return wallet;
}

async function recordTransaction({
  db,
  userId,
  amount,
  receiverWalletId,
  senderWalletId,
  type,
  notes,
}: {
  db: any;
  userId: number;
  amount: number;
  receiverWalletId: number | null;
  senderWalletId: number | null;
  type: string;
  notes: string;
}) {
  const reference = generateTransactionReference();
  await db("transactions").insert({
    amount,
    receiver_wallet_id: receiverWalletId,
    sender_wallet_id: senderWalletId,
    type,
    notes,
    reference,
    initiated_by: userId,
  });
}

/* Deposit funds function */
export const depositFundsToWallet = async (
  amount: number,
  address: string,
  userId: number,
  notes: string = "",
) => {
  validateAmount(amount);
  const wallet = await retriveUserWallet(userId, address);

  await db.transaction(async (trx) => {
    await trx("wallets")
      .where({ address, user_id: userId })
      .increment("balance", amount);

    await recordTransaction({
      db: trx,
      amount,
      userId,
      receiverWalletId: wallet.id,
      senderWalletId: null,
      type: TransactionType.deposit,
      notes,
    });
  });
};

/* Withdrawal function */
export const withdrawFundsFromWallet = async (
  amount: number,
  address: string,
  userId: number,
  notes: string = "",
) => {
  validateAmount(amount);
  const wallet = await retriveUserWallet(userId, address);

  await db.transaction(async (trx) => {
    try {
      await trx("wallets")
        .where({ address, user_id: userId })
        .decrement("balance", amount);
    } catch (error: any) {
      if (error.errno === 4025) {
        throw new AppError(
          ErrorCodes.INSUFFICIENT_FUNDS,
          "Insufficient funds",
          400,
          true,
        );
      }
      //
      throw error;
    }

    await recordTransaction({
      db: trx,
      amount,
      userId,
      receiverWalletId: null,
      senderWalletId: wallet.id,
      type: TransactionType.withdrawal,
      notes,
    });
  });
};

/* Tranfer to wallet function */
export const tranferToWallet = async (
  amount: number,
  address: string,
  userId: number,
  notes: string = "",
): Promise<void> => {
  validateAmount(amount);

  const [senderWallet, receiverWallet]: [Wallet, Wallet] = await Promise.all([
    await db("wallets").where({ user_id: userId }).first(),
    await db("wallets").where({ address }).first(),
  ]);

  if (!senderWallet)
    throw new AppError(
      ErrorCodes.WALLET_NOT_FOUND,
      "User does not have a wallet.",
      404,
      true,
    );

  if (!receiverWallet) {
    throw new AppError(
      ErrorCodes.WALLET_NOT_FOUND,
      `Wallet with address - ${address} was not found.`,
      404,
      true,
    );
  }

  // User can not transfer to their self.
  if (senderWallet.address === receiverWallet.address) {
    throw new AppError(
      ErrorCodes.TRANSFER_INVALID,
      "You can not tranfer funds to yourself.",
      400,
      true,
    );
  }

  await db.transaction(async (trx) => {
    try {
      await trx("wallets")
        .where({ address: senderWallet.address })
        .decrement("balance", amount);
    } catch (error: any) {
      if (error.errno === 4025) {
        throw new AppError(
          ErrorCodes.INSUFFICIENT_FUNDS,
          "User have insufficient balance.",
          400,
          true,
        );
      }
      //
      throw error;
    }

    await trx("wallets")
      .where({ address: receiverWallet.address })
      .increment("balance", amount);

    await recordTransaction({
      db: trx,
      amount,
      userId,
      receiverWalletId: receiverWallet.id,
      senderWalletId: senderWallet.id,
      type: TransactionType.deposit,
      notes,
    });
  });
};

/* Retrive user transactions */
export type Transactions = Transaction[];
export const getUserTransactions = async (
  userId: number,
): Promise<Transactions> => {
  const transactions: Transactions = await db("transactions").where({
    initiated_by: userId,
  });

  return transactions;
};
