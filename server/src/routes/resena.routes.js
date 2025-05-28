import { Router } from "express";
import {
  getResenasById,
  getResenasPendientes,
  getResenasFoto,
  getResenasByMuseo,
  getResenasModAll,
  getResenasModByMuseo,
  aprobarResena,
} from "../controllers/resena.controller.js";

const router = Router();

router.get("/detalle/:id", getResenasById);
router.get("/pendientes", getResenasPendientes);
router.get("/detalle/:id/fotos", getResenasFoto);

// Para obtener reseñas por museo
router.get("/museo/:museoId", getResenasByMuseo);

// Para obtener todas las reseñas de mods
router.get("/mod/all", getResenasModAll);
// Para obtener reseñas de mods por museo
router.get("/mod/museo/:museoId", getResenasModByMuseo);
router.post("/mod/aprobar/:resenaId", aprobarResena);

export default router;
