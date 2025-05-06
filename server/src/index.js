import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

import indexRoutes from "./routes/index.routes.js";
import museoRoutes from "./routes/museo.routes.js";
import authRoutes from "./routes/auth.routes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true })); // Middleware para parsear URL-encoded
app.use(express.json()); // Middleware para parsear JSON

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL + process.env.FRONTEND_PORT, // URL de frontend
//   origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"], // Métodos permitidos
  allowedHeaders: ["Content-Type"], // Cabeceras permitidas
  credentials: true,	// Permitir credenciales (cookies, autorización, etc.)
};
app.use(cors(corsOptions));

app.use(cookieParser()); // Middleware para parsear cookies
app.use('/uploads', express.static('uploads')); // Servir archivos estáticos

app.use(indexRoutes);
app.use(museoRoutes); 
app.use(authRoutes);

// Endpoint para obtener la API key de Google Maps
app.get("/api/maps-key", (req, res) => {
  res.json({
    key: process.env.GOOGLE_MAPS_API_KEY,
  });
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
