import { Router } from "express";
import {
  getVisitas,
  addVisita,
  deleteVisita,
  getVisitasCount,
} from "../controllers/visitas.controller.js";

const router = Router();

router.post("/agregar", addVisita);
router.delete("/eliminar", deleteVisita);
router.get("/:correo", getVisitas);
router.get("/numero/:correo", getVisitasCount);

export default router;
