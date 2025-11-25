import type { Request, Response, NextFunction } from "express";
import { type ApiResponse } from "../apiTypes.js";
import AppError from "../errors/appError.js";

const errorHandler = async (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("An error occured:", err);
  const response: ApiResponse<void> = {
    status: false,
    message: err.message || "An error occured, please try again later.",
  };

  res.status(err.status || 500).json(response);
};

export default errorHandler;
