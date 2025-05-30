import { Router } from "express";
import {
  getPreguntas,
  getServicios,
  getEncuesta,
  getRespuestasTotales,
  registrarEncuesta,
  updateEncuesta,
} from "../controllers/encuesta.controller.js";

const router = Router();

router.get("/preguntas/:encuestaId", getPreguntas);
router.get("/servicios", getServicios);
router.get("/detalle/:encuestaId/:museoId/:correo", getEncuesta);
router.get("/respuestas/:encuestaId/:museoId", getRespuestasTotales);

router.post("/registrar/:encuestaId/:museoId/:correo", registrarEncuesta);
router.post("/actualizar/:encuestaId/:museoId/:correo", updateEncuesta);

export default router;
