import db from "../database/db.js";
import AppError, { ErrorCodes } from "../errors/appError.js";
import crypto from "crypto";
import { recordTransaction, TransactionType } from "./transactions.service.js";

export interface Wallet {
  id: number;
  balance: number;
  address: string;
  user_id: number;
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

/* Create wallet function */
export const createWallet = async (userId: number) => {
  const address = crypto.randomBytes(16).toString("hex");

  await db("wallets").insert({ user_id: userId, address });
  console.log(`New wallet created for user: ${userId}`);
};

/* Get user wallet */
export const getUserWallet = async (userId: number) => {
  const wallet: Wallet = await db("wallets").where({ user_id: userId }).first();

  if (!wallet)
    throw new AppError(
      ErrorCodes.WALLET_NOT_FOUND,
      "Wallet not found..",
      404,
      true,
    );

  return wallet;
};

/* Deposit funds function */
export const depositFundsToWallet = async (
  amount: number,
  address: string,
  userId: number,
  notes: string = "",
) => {
  validateAmount(amount);

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

  await db.transaction(async (trx) => {
    const wallet = await trx("wallets")
      .where({ address, user_id: userId })
      .forUpdate()
      .first();

    if (!wallet)
      throw new AppError(
        ErrorCodes.WALLET_NOT_FOUND,
        "Wallet not found.",
        404,
        true,
      );

    if (wallet.balance < amount) {
      throw new AppError(
        ErrorCodes.INSUFFICIENT_FUNDS,
        "Insufficient funds",
        400,
        true,
      );
    }

    await trx("wallets")
      .where({ address, user_id: userId })
      .decrement("balance", amount);

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

  const receiverWallet = await db("wallets").where({ address }).first();
  if (!receiverWallet) {
    throw new AppError(
      ErrorCodes.WALLET_NOT_FOUND,
      `Recipient wallet not found.`,
      404,
      true,
    );
  }

  await db.transaction(async (trx) => {
    const senderWallet = await trx("wallets")
      .where({ user_id: userId })
      .forUpdate()
      .first();

    if (!senderWallet)
      throw new AppError(
        ErrorCodes.WALLET_NOT_FOUND,
        "User does not have a wallet.",
        404,
        true,
      );

    // User can not transfer to their self.
    if (senderWallet.address === receiverWallet.address) {
      throw new AppError(
        ErrorCodes.TRANSFER_INVALID,
        "You can not tranfer funds to yourself.",
        400,
        true,
      );
    }

    if (senderWallet.balance < amount) {
      throw new AppError(
        ErrorCodes.INSUFFICIENT_FUNDS,
        "Insufficient funds",
        400,
        true,
      );
    }

    await trx("wallets")
      .where({ id: senderWallet.id })
      .decrement("balance", amount);
    //
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
