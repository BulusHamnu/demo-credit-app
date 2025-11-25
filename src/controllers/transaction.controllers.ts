import type { NextFunction, Request, Response } from "express";
import { type ApiResponse } from "../types/apiTypes.js";
import {
  fundWallet,
  getUserTransactions,
} from "../services/transactions.service.js";
import type { Transactions } from "../services/transactions.service.js";
import AppError from "../errors/appError.js";

//
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

    await fundWallet(amount, address, notes, user.id);

    const response: ApiResponse<void> = {
      status: true,
      message: `Deposit of ${amount} was successful.`,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

//
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

