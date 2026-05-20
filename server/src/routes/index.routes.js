import { Router } from "express";
import museoRoutes from "./museo.routes.js";
import authRoutes from "./auth.routes.js";

import resenaRoutes from "./resena.routes.js";
import encuestaRoutes from "./encuesta.routes.js";
import favoritoRoutes from "./favorito.routes.js";
import qvRoutes from "./quierovisitar.routes.js";
import visitasRoutes from "./visitas.routes.js";
import reviewsRoutes from "./reviews.routes.js";
import noticiasRoutes from "./noticias.route.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de MuseDMX",
    endpoints: {
      museos: "/api/museos",
      auth: "/api/auth",
      authLogin: "/api/auth/login",
      authSignUp: "/api/auth/signup",
      authLogout: "/api/auth/logout",
      resenas: "/api/resena",
      encuestas: "/api/encuesta",
      favoritos: "/api/favoritos",
      qv: "/api/qv",
      visitas: "/api/visitas",
      noticias: "/api/noticias",
    },
  });
});

// Rutas especificas
router.use("/api/museos", museoRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/resena", resenaRoutes);
router.use("/api/encuesta", encuestaRoutes);
router.use("/api/favoritos", favoritoRoutes);
router.use("/api/qv", qvRoutes);
router.use("/api/visitas", visitasRoutes);
router.use("/api/reviews", reviewsRoutes);
router.use("/api/noticias", noticiasRoutes);

export default router;
