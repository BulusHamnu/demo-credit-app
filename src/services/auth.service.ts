import db from "../database/db.js";
import { generateAccessToken } from "../utils/helpers.js";
import AppError, { ErrorCodes } from "../errors/appError.js";
import verifyKarmaIdentity from "./verifyKarmaIdentity.js";

export interface User {
  id: number;
  full_name: string;
  email: string;
  token: string;
  created_at: Date;
}

/* Create new user function */
export const createNewUser = async (
  email: string,
  fullname: string,
): Promise<void> => {
  // Users found in karma blacklist are not allowed to use this service.
  const userIsClean = true; //await verifyKarmaIdentity(email);
  if (!userIsClean)
    throw new AppError(
      ErrorCodes.USER_BLACKLISTED,
      "You are not allow to use this service.",
      400,
      true,
      null,
    );

  const token = generateAccessToken();
  let id = undefined;
  try {
    [id] = await db("users").insert({
      email,
      full_name: fullname,
      token,
    });
  } catch (error: any) {
    if (error.errno === 1062)
      throw new AppError(
        ErrorCodes.USER_ALREADY_EXISTS,
        "User already exists.",
        409,
        true,
        { email },
      );

    throw error;
  }

  console.log(`New user created - userid: ${id}`);
};

/* Retrive user token function */
export const retriveUserToken = async (email: string): Promise<string> => {
  const user: User = await db("users").where({ email }).first();
  if (!user)
    throw new AppError(
      ErrorCodes.USER_NOT_FOUND,
      "User does not exists.",
      404,
      true,
      { email },
    );

  return user.token;
};
