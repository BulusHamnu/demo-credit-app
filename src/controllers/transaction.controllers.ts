import type { NextFunction, Request, Response } from "express";
import { type ApiResponse } from "../types/apiTypes.js";
import {
  transferFunds,
  getUserTransactions,
  tranferToWallet,
} from "../services/transactions.service.js";
import type { Transactions } from "../services/transactions.service.js";
import AppError from "../errors/appError.js";

// Deposit to wallet controller
export const depositController = async (
  req: Request<
    {},
    ApiResponse<void>,
    { amount: number; address: string; notes: string },
    {}
  >,
  res: Response<ApiResponse<void>>,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!;
    const { amount, address, notes } = req.body;

    if (!amount || !address)
      throw new AppError("Missing required field: amount or address.", 400);

    await transferFunds(amount, address, "deposit", user.id);

    const response: ApiResponse<void> = {
      status: true,
      message: `Deposit of ${amount} was successful.`,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Get all user's transaction controller
export const getTransactionsController = async (
  req: Request<{}, ApiResponse<Transactions>, {}, {}>,
  res: Response<ApiResponse<Transactions>>,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!;

    const transactions = await getUserTransactions(user.id);
    const response: ApiResponse<Transactions> = {
      status: true,
      message: "Transactions retrived successfully.",
      data: transactions,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// transfer  controller
export const transferController = async (
  req: Request<
    {},
    ApiResponse<void>,
    { amount: number; address: string; notes: string },
    {}
  >,
  res: Response<ApiResponse<void>>,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!;
    const { amount, address, notes } = req.body;
    if (!amount || !address)
      throw new AppError("Missing required field: amount or address.", 400);

    await tranferToWallet(amount, address, notes, user.id);
    const response: ApiResponse<void> = {
      status: true,
      message: "Transfer was successful.",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// Withdraw controller
export const withdrawController = async (
  req: Request<{}, ApiResponse<void>, { amount: number; address: string }, {}>,
  res: Response<ApiResponse<void>>,
  next: NextFunction
): Promise<void> => {
  const user = req.user!;
  const { amount, address } = req.body;
  if (!amount || !address)
    throw new AppError("Missing required field: amount or address.", 400);

  await transferFunds(amount, address, "withdrawal", user.id);

  const response: ApiResponse<void> = {
    status: true,
    message: "Withdrawal was successfully.",
  };

  res.status(200).json(response);
  try {
  } catch (error) {
    next(error);
  }
};
