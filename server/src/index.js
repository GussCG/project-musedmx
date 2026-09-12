import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import indexRoutes from "./routes/index.routes.js";
import museoRoutes from "./routes/museo.routes.js";
import authRoutes from "./routes/auth.routes.js";
// import reviewRoutes from "./routes/review.routes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true })); // Middleware para parsear URL-encoded
app.use(express.json()); // Middleware para parsear JSON

const origins = [
  "https://musedmx.com",
  "https://www.musedmx.com",
  "http://localhost:5173",
  "https://musedmx-eight.vercel.app",
  process.env.FRONTEND_URL, // Asegura tomar la variable de Render si la definiste
].filter(Boolean); // Limpia valores undefined

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`[CORS Blocked] Origen no permitido: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser()); // Middleware para parsear cookies
app.use("/uploads", express.static("uploads")); // Servir archivos estáticos

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(indexRoutes);
app.use(museoRoutes);
app.use(authRoutes);
// app.use(reviewRoutes);

// Endpoint para obtener la API key de Google Maps
app.get("/api/maps-key", (req, res) => {
  res.json({
    key: process.env.GOOGLE_MAPS_API_KEY,
  });
});

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
