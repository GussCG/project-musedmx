import { Router } from "express";

import {
  agregarFavorito,
  eliminarFavorito,
  getFavoritosByCorreo,
  verificarFavorito,
  getFavoritosCountByMuseoId,
} from "../controllers/favorito.controller.js";

const router = Router();

router.post("/agregar", agregarFavorito);
router.delete("/eliminar", eliminarFavorito);
router.get("/", verificarFavorito);
router.get("/museosfavoritos/:correo", getFavoritosByCorreo);
router.get("/numero/:museoId", getFavoritosCountByMuseoId);

export default router;
