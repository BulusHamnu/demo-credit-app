import db from "../database/db.js";
import { generateAccessToken } from "../utils/helpers.js";
import AppError from "../errors/appError.js";
import {
  ADJUSTOR_API_BASE,
  DEMO_CREDIT_ADJUSTOR_API_KEY,
} from "../config/env.js";
import axios from "axios";

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
  // check if user is blacklisted: finish feature later
  const endpoint = ADJUSTOR_API_BASE + "/verification/karma";
  // const r = await axios.post(
  //   endpoint,
  //   { email },
  //   {
  //     headers: {
  //       "Authorization": `Bearer ${DEMO_CREDIT_ADJUSTOR_API_KEY}`,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
  // console.log(r.data);

  const userExist = await db("users").where({ email }).first();
  if (userExist) throw new AppError("User already exist.", 409);

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
