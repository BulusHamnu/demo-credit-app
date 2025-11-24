import { config } from "dotenv";
config();

export default {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "lendsqr_wallet",
  },
  migrations: {
    directory: "./src/database/migrations",
  },
};
