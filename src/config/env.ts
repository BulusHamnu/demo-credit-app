import { config } from "dotenv";
config();

interface Env {
  DATABASE_PASSWORD: string;
  PORT: number | string;
}

const env: Env = {
  DATABASE_PASSWORD: process.env.MYSQL_PASSWORD || "",
  PORT: process.env.PORT || 3000,
};

export const { DATABASE_PASSWORD, PORT } = env;
