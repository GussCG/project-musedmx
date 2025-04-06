import { Router } from "express";
import { pool } from "../db.js";

import museoRoutes from "./museo.routes.js";

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
      authSignIn: "/api/auth/signin",
      authLogout: "/api/auth/logout",
    },
  });
});

// Rutas especificas
router.use("/api/museos", museoRoutes);

export default router;
