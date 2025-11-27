import { config } from "dotenv";
config();

export default {
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_ADMIN,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  migrations: {
    directory: "./src/database/migrations",
  },
};
