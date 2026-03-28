import type { Response, Request, NextFunction } from "express";
import AppError, { ErrorCodes } from "../errors/appError.js";
import db from "../database/db.js";
import type { User } from "../services/auth.service.js";

const withAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      throw new AppError(ErrorCodes.UNAUTHETICATED, "Missing token", 401, true);

    const user: User = await db("users").where({ token }).first();
    if (!user)
      throw new AppError(
        ErrorCodes.UNAUTHORIZED,
        "Invalid token, Unauthorized.",
        401,
        true,
      );

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default withAuth;
