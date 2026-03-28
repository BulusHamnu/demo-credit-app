import type { Request, Response, NextFunction } from "express";
import { type ApiResponse } from "../types/apiTypes.js";
import AppError, { ErrorCodes } from "../errors/appError.js";

const errorHandler = async (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("An error occured:", err);

  const msg = err?.isOperational
    ? err.message
    : "An unexpected error occured, please try again later.";

  const response: ApiResponse<void> = {
    status: false,
    message: msg,
    error: {
      code: err?.code || ErrorCodes.UNEXPECTED_ERROR,
      details: err?.details || null,
    },
  };

  res.status(err.status || 500).json(response);
};

export default errorHandler;
