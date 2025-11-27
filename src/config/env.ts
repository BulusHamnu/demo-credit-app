import { config } from "dotenv";
config();

interface Env {
  DATABASE_PASSWORD: string;
  PORT: number | string;
  ADJUSTOR_API_BASE: string;
  DEMO_CREDIT_ADJUSTOR_ID: string;
  DEMO_CREDIT_ADJUSTOR_API_KEY: string;
  DATABASE_HOST: string;
  DATABASE_ADMIN: string;
  DATABASE_NAME: string;
  DATABASE_PORT: number | string;
}

const env: Env = {
  DATABASE_PASSWORD: process.env.MYSQL_PASSWORD || "",
  PORT: process.env.PORT || 3000,
  ADJUSTOR_API_BASE: "https://adjutor.lendsqr.com/v2",
  DEMO_CREDIT_ADJUSTOR_API_KEY: process.env.DEMO_CREDIT_ADJUSTOR_API_KEY || "",
  DEMO_CREDIT_ADJUSTOR_ID: process.env.DEMO_CREDIT_ADJUSTOR_ID || "",
  DATABASE_HOST: process.env.DATABASE_HOST || "127.0.0.1",
  DATABASE_ADMIN: process.env.DATABASE_ADMIN || "root",
  DATABASE_NAME: process.env.DATABASE_NAME || "lendsqr_wallet",
  DATABASE_PORT: process.env.DATABASE_PORT || 3306,
};

export const {
  DATABASE_PASSWORD,
  PORT,
  ADJUSTOR_API_BASE,
  DEMO_CREDIT_ADJUSTOR_API_KEY,
  DEMO_CREDIT_ADJUSTOR_ID,
  DATABASE_HOST,
  DATABASE_ADMIN,
  DATABASE_NAME,
  DATABASE_PORT,
} = env;
