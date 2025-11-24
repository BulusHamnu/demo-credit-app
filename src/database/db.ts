import knex from "knex";
import { DATABASE_PASSWORD } from "../config/env.js";

const db = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: DATABASE_PASSWORD,
    database: "lendsqr_wallet",
  },
});

export default db;
