import { Router } from "express";
import {
  getVisitas,
  addVisita,
  deleteVisita,
  getVisitasCount,
  getUsuarioVisitoMuseo,
  getVisitasCountDistinct,
} from "../controllers/visitas.controller.js";

const router = Router();

router.post("/agregar", addVisita);
router.delete("/eliminar", deleteVisita);
router.get("/:correo", getVisitas);
router.get("/numero/:correo", getVisitasCount);
router.get("/numero-distinct/:correo", getVisitasCountDistinct);
router.get("/usuario/visito-museo/:correo/:museoId", getUsuarioVisitoMuseo);

export default router;
