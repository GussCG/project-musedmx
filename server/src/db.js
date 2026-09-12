import { createPool } from "mysql2/promise";

// Limpiar espacios en blanco de las variables de entorno
const dbHost = process.env.DB_HOST?.trim();
const dbUser = process.env.DB_USER?.trim();
const dbPassword = process.env.DB_PASSWORD?.trim();
const dbName = process.env.DB_NAME?.trim();
const dbPort = Number(process.env.DB_PORT) || 23389; // Fallback al puerto de Aiven si no viene cargado

const isSSLRequired =
  process.env.NODE_ENV === "production" ||
  process.env.DB_SSL === "true" ||
  (dbHost && dbHost.includes("aivencloud.com"));

console.log("Conectando al Host DB:", JSON.stringify(process.env.DB_HOST));

export const pool = createPool({
  database: dbName,
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  ssl: isSSLRequired ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE) || 10,
  queueLimit: 0,
});
