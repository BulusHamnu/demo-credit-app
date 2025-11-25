import { config } from "dotenv";
config();

interface Env {
  DATABASE_PASSWORD: string;
  PORT: number | string;
  ADJUSTOR_API_BASE: string;
  DEMO_CREDIT_ADJUSTOR_ID: string;
  DEMO_CREDIT_ADJUSTOR_API_KEY: string;
}

const env: Env = {
  DATABASE_PASSWORD: process.env.MYSQL_PASSWORD || "",
  PORT: process.env.PORT || 3000,
  ADJUSTOR_API_BASE: "https://adjutor.lendsqr.com/v2",
  DEMO_CREDIT_ADJUSTOR_API_KEY: process.env.DEMO_CREDIT_ADJUSTOR_API_KEY || "",
  DEMO_CREDIT_ADJUSTOR_ID: process.env.DEMO_CREDIT_ADJUSTOR_ID || "",
};

export const {
  DATABASE_PASSWORD,
  PORT,
  ADJUSTOR_API_BASE,
  DEMO_CREDIT_ADJUSTOR_API_KEY,
  DEMO_CREDIT_ADJUSTOR_ID,
} = env;
