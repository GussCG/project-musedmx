import { Router } from "express";

import {
  agregarFavorito,
  eliminarFavorito,
  verificarFavorito,
} from "../controllers/favorito.controller.js";

const router = Router();

router.post("/", agregarFavorito);
router.delete("/", eliminarFavorito);
router.get("/", verificarFavorito);

export default router;
