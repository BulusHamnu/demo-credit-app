import knex from "knex";
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

export default db;
