import e, { Router } from "express";
import { pool } from "../db.js";

import museoRoutes from "./museo.routes.js";
import resenaRoutes from "./resena.routes.js";
import encuestaRoutes from "./encuesta.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de MuseDMX",
    endpoints: {
      museos: "/api/museos",
      auth: "/api/auth",
      authLogin: "/api/auth/login",
      authSignIn: "/api/auth/signin",
      authLogout: "/api/auth/logout",
      resenas: "/api/resena",
      encuestas: "/api/encuesta",
    },
  });
});

// Rutas especificas
router.use("/api/museos", museoRoutes);
router.use("/api/resena", resenaRoutes);
router.use("/api/encuesta", encuestaRoutes);

export default router;
