import { Router } from "express";
import {
  getResenasById,
  getResenasPendientes,
  getResenasFoto,
  aprobarResena,
  getResenasByMuseo,
} from "../controllers/resena.controller.js";

const router = Router();

router.get("/detalle/:id", getResenasById);
router.get("/pendientes", getResenasPendientes);
router.get("/detalle/:id/fotos", getResenasFoto);
router.put("/aprobar", aprobarResena);

router.get("/museo/:museoId", getResenasByMuseo);

export default router;
