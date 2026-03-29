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

// Beware i know how to use Joi & Zoi this is just an example.
interface reqBody {
  amount: number;
  address: string;
  notes?: string;
}

function validateRequestBody(body: reqBody) {
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
    const { amount, address, notes } = validateRequestBody(req.body);

    await walletService.depositFundsToWallet(amount, address, user.id, notes);

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
    const { amount, address, notes } = validateRequestBody(req.body);

    await walletService.withdrawFundsFromWallet(
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

/* Transfer funds handler */
export const transferFunds = async (
  req: Request<{}, ApiResponse<void>, reqBody, {}>,
  res: Response<ApiResponse<void>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user!;
    const { amount, address, notes } = validateRequestBody(req.body);

    await walletService.tranferToWallet(amount, address, user.id, notes);
    const response: ApiResponse<void> = {
      status: true,
      message: "Transfer was successful.",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
