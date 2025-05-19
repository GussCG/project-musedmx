import { Router } from "express";
import {
  getPreguntas,
  getServicios,
  getEncuesta,
  getRespuestasTotales,
} from "../controllers/encuesta.controller.js";

const router = Router();

router.get("/preguntas/:encuestaId", getPreguntas);
router.get("/servicios", getServicios);
router.get("/detalle/:encuestaId/:museoId/:correo", getEncuesta);
router.get("/respuestas/:encuestaId/:museoId", getRespuestasTotales);

export default router;
