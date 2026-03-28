import type { NextFunction, Request, Response } from "express";
import { type ApiResponse } from "../types/apiTypes.js";
import AppError, { ErrorCodes } from "../errors/appError.js";
import { type Wallet } from "../services/wallet.service.js";
import * as walletService from "../services/wallet.service.js";

/* Create wallet handler */
export const createNewWallet = async (
  req: Request<{}, ApiResponse<void>, {}, {}>,
  res: Response<ApiResponse<void>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user!;

    await walletService.createWallet(user.id);
    const response: ApiResponse<void> = {
      status: true,
      message: "User wallet created successfully.",
    };

    res.status(201).json(response);
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new AppError(
        ErrorCodes.WALLET_ALREADY_EXISTS,
        "User already have a wallet.",
        409,
        true,
      );
    }
    next(error);
  }
};

/* Get wallet handler */
export const getWallet = async (
  req: Request<{}, ApiResponse<Wallet>, {}, {}>,
  res: Response<ApiResponse<Wallet>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user!;

    const wallet = await walletService.getUserWallet(user.id);
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
