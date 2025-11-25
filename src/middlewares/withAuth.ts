import type { Response, Request, NextFunction } from "express";
import AppError from "../errors/appError.js";
import db from "../database/db.js";
import type { User } from "../services/auth.service.js";

const withAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new AppError("Missing token", 401);

    const user: User = await db("users").where({ token }).first();
    if (!user) throw new AppError("Invalid token, Unauthorized.", 401);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default withAuth;
