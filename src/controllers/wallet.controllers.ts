import type { NextFunction, Request, Response } from "express";
import { type ApiResponse } from "../types/apiTypes.js";
import AppError from "../errors/appError.js";
import db from "../database/db.js";
import crypto from "crypto";

interface Wallet {
  id: number;
  balance: number;
  address: string;
  user_id: number;
  created_at: Date;
}

export const createNewWalletController = async (
  req: Request<{}, ApiResponse<void>, {}, {}>,
  res: Response<ApiResponse<void>>,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const address = crypto.randomBytes(16).toString("hex");

    const walletExist: Wallet = await db("wallets")
      .where({ user_id: user?.id })
      .first();
    if (walletExist) throw new AppError("User already have a wallet.", 409);

    await db("wallets").insert({ user_id: user?.id, address });
    console.log(`New wallet created for user: ${user?.id}`);

    const response: ApiResponse<void> = {
      status: true,
      message: "New wallet created successfully.",
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserWalletController = async (
  req: Request<{}, ApiResponse<Wallet>, {}, {}>,
  res: Response<ApiResponse<Wallet>>,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const wallet: Wallet = await db("wallets")
      .where({ user_id: user?.id })
      .first();

    if (!wallet) throw new AppError("No wallet.", 404);

    const response: ApiResponse<Wallet> = {
      status: true,
      message: "Wallet retrived successfully.",
      data: wallet,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
