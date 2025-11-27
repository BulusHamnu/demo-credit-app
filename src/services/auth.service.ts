import db from "../database/db.js";
import { generateAccessToken } from "../utils/helpers.js";
import AppError from "../errors/appError.js";
import verifyKarmaIdentity from "./verifyKarmaIdentity.js";

export interface User {
  id: number;
  full_name: string;
  email: string;
  token: string;
  created_at: Date;
}

// create new user service function
export const createNewUser = async (
  email: string,
  full_name: string
): Promise<void> => {
  const userExist = await db("users").where({ email }).first();
  if (userExist) throw new AppError("User already exist.", 409);

  // check if user is blacklisted
  const userIsClean = await verifyKarmaIdentity(email);
  if (userIsClean) throw new AppError("You can not use this service.", 400);

  const token = generateAccessToken(); // get access token
  const [id] = await db("users").insert({ email, full_name, token });
  console.log(`New user created - userid: ${id}`);
};

// get user service function
export const getUser = async (email: string): Promise<User> => {
  const user: User = await db("users").where({ email }).first();
  if (!user) throw new AppError("User does not exist", 404);

  return user;
};
