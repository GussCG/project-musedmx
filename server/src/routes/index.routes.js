import { Router } from "express";
import { pool } from "../db.js";

import museoRoutes from "./museo.routes.js";
import authRoutes from "./auth.routes.js";


const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de MuseDMX",
    endpoints: {
      museos: "/api/museos",
      museosById: "/api/museos/:id",
      museosByTipo: "/api/museos/tipo/:tipo",
      museosBySearch: "/api/museos/search/:search",
      auth: "/api/auth",
      authLogin: "/api/auth/login",
      authSignUp: "/api/auth/signup",
      authLogout: "/api/auth/logout",
    },
  });
});

// Rutas especificas
router.use("/api/museos", museoRoutes);
router.use("/api/auth", authRoutes);

export default router;
