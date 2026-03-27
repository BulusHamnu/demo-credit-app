import knex from "knex";
import {} from "knex";
import {
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_ADMIN,
  DATABASE_NAME,
  DATABASE_PORT,
} from "../config/env.js";

const db = knex({
  client: "mysql2",
  connection: {
    host: DATABASE_HOST,
    port: DATABASE_PORT as number,
    user: DATABASE_ADMIN,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
  },
});

export async function intiateDb() {
  try {
    await db.raw("SELECT 1");
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("An error occured while connecting to daabase.", error);
    process.exit(1);
  }
}

export default db;
