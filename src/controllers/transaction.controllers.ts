import type { NextFunction, Request, Response } from "express";
import { type ApiResponse } from "../types/apiTypes.js";
import * as transactionService from "../services/transactions.service.js";
import type { Transactions } from "../services/transactions.service.js";

/* Get user's transactions */
export const getTransactions = async (
  req: Request<{}, ApiResponse<Transactions>, {}, {}>,
  res: Response<ApiResponse<Transactions>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user!;

    const transactions = await transactionService.getUserTransactions(user.id);

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
