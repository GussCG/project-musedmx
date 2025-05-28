import { Router } from "express";

import {
  agregarQV,
  eliminarQV,
  obtenerQV,
} from "../controllers/quierovisitar.controller.js";

const router = Router();

router.post("/agregar", agregarQV);
router.delete("/eliminar", eliminarQV);
router.get("/obtener/:correo", obtenerQV);

export default router;
