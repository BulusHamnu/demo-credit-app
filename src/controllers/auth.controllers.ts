import type { NextFunction, Request, Response } from "express";
import { type ApiResponse } from "../types/apiTypes.js";
import * as authService from "../services/auth.service.js";
import AppError, { ErrorCodes } from "../errors/appError.js";

export const signup = async (
  req: Request<{}, ApiResponse<void>, { fullname: string; email: string }, {}>,
  res: Response<ApiResponse<void>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, fullname } = req.body;

    if (!email || !fullname)
      throw new AppError(
        ErrorCodes.VALIDATION_ERROR,
        "Missing required fields.",
        400,
        true,
        {
          email: "email is required.",
          fullname: "fullname is required.",
        },
      );

    await authService.createNewUser(email, fullname);
    const response: ApiResponse<void> = {
      status: true,
      message: "User created successfully.",
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, ApiResponse<{ token: string }>, { email: string }, {}>,
  res: Response<ApiResponse<{ token: string }>>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email)
      throw new AppError(
        ErrorCodes.VALIDATION_ERROR,
        "Missing required fields.",
        400,
        true,
        {
          email: "email is required.",
        },
      );

    const token = await authService.retrieveUserToken(email);
    const response: ApiResponse<{ token: string }> = {
      status: true,
      message: "User logged in successfully.",
      data: {
        token,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
