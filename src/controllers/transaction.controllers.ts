import type { NextFunction, Request, Response } from "express";
import { type ApiResponse } from "../types/apiTypes.js";
import * as transactionService from "../services/transactions.service.js";
import type { Transactions } from "../services/transactions.service.js";
import AppError, { ErrorCodes } from "../errors/appError.js";

interface reqBody {
  amount: number;
  address: string;
  notes?: string;
}
// Beware i know how to use Joi & Zoi this is just an example.
function validateTransactionBody(body: reqBody) {
  const requiredFields = ["amount", "address"];
  const error: {
    [key: string]: string;
  } = {};

  const reqFields = Object.keys(body);
  for (const key of requiredFields) {
    if (!reqFields.includes(key)) {
      error[key] = `${key} is required.`;
    }
  }

  if (Object.keys(error).length > 0) {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      "Missing required field.",
      400,
      true,
      error,
    );
  }

  return body;
}

/* Deposit to wallet handler */
export const depositFunds = async (
  req: Request<{}, ApiResponse<void>, reqBody, {}>,
  res: Response<ApiResponse<void>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user!;
    const { amount, address, notes } = validateTransactionBody(req.body);

    await transactionService.depositFundsToWallet(
      amount,
      address,
      user.id,
      notes,
    );

    const response: ApiResponse<void> = {
      status: true,
      message: `Deposit of ${amount} was successful.`,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/* Withdrawal handler */
export const withdrawFunds = async (
  req: Request<{}, ApiResponse<void>, reqBody, {}>,
  res: Response<ApiResponse<void>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user!;
    const { amount, address, notes } = validateTransactionBody(req.body);

    await transactionService.withdrawFundsFromWallet(
      amount,
      address,
      user.id,
      notes,
    );

    const response: ApiResponse<void> = {
      status: true,
      message: `Withdrawal of ${amount} was successfully.`,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

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

/* Transfer funds handler */
export const transferFunds = async (
  req: Request<{}, ApiResponse<void>, reqBody, {}>,
  res: Response<ApiResponse<void>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user!;
    const { amount, address, notes } = validateTransactionBody(req.body);

    await transactionService.tranferToWallet(amount, address, user.id, notes);
    const response: ApiResponse<void> = {
      status: true,
      message: "Transfer was successful.",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
