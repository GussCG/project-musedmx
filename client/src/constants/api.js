import dotenv from "dotenv";
dotenv.config();

const BACKEND_URL = process.env.VITE_BACKEND_URL;

console.log("BACKEND_URL:", BACKEND_URL);
