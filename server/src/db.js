import { createPool } from "mysql2/promise";

const isProduction = process.env.NODE_ENV === "production";

export const pool = createPool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl:
    isProduction || process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
});
