import { Router } from "express";
import multer from "multer";

import {
  getMuseos,
  getMuseosNombres,
  getMuseoById,
  getGaleriaById,
  getHorariosById,
  getRedesById,
  getResenasById,
  createMuseo,
  updateMuseo,
  getMuseosPopulares,
} from "../controllers/museo.controller.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getMuseos);
router.get("/nombres", getMuseosNombres);
router.get("/detalle/:id", getMuseoById);
router.get("/galeria/:id", getGaleriaById);
router.get("/horarios/:id", getHorariosById);
router.get("/redes/:id", getRedesById);
router.get("/resenas/:id", getResenasById);
router.post("/", upload.single("mus_foto"), createMuseo);
router.post("/editar/:id", upload.single("mus_foto"), updateMuseo);
router.get("/populares", getMuseosPopulares);

export default router;
