import type { NextFunction, Request, Response } from "express";
import { type ApiResponse } from "../apiTypes.js";
import { createNewUser, getUser } from "../services/auth.service.js";
import AppError from "../errors/appError.js";

export const registerController = async (
  req: Request<{}, ApiResponse<void>, { full_name: string; email: string }, {}>,
  res: Response<ApiResponse<void>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, full_name } = req.body;

    if (!email || !full_name)
      new AppError("Missing required field: full_name and email.", 404);

    await createNewUser(email, full_name);
    const response: ApiResponse<void> = {
      status: true,
      message: "User created succesfully",
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request<{}, ApiResponse<{ token: string }>, { email: string }, {}>,
  res: Response<ApiResponse<{ token: string }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) new AppError("Missing required field: email.", 400);

    const { token } = await getUser(email);

    const response: ApiResponse<{ token: string }> = {
      status: true,
      message: "User logged in succesfully",
      data: {
        token,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
