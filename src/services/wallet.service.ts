import db from "../database/db.js";
import AppError, { ErrorCodes } from "../errors/appError.js";
import crypto from "crypto";

export interface Wallet {
  id: number;
  balance: number;
  address: string;
  user_id: number;
  created_at: Date;
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
