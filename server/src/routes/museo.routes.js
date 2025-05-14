import { Router } from "express";
import { upload } from '../middleware/upload.js';
import {
  getMuseos,
  getMuseosNombres,
  getMuseoById,
  getGaleriaById,
  getHorariosById,
  getRedesById,
  createMuseo,
  updateMuseo,
  deleteMuseo
} from "../controllers/museo.controller.js";

const router = Router();

router.get("/", getMuseos);
router.get("/nombres", getMuseosNombres);
router.get("/:id", getMuseoById);
router.get("/galeria/:id", getGaleriaById);
router.get("/horarios/:id", getHorariosById);
router.get("/redes/:id", getRedesById);
router.post("/", upload.single('mus_foto'), createMuseo);
router.put("/:id", upload.single('mus_foto'), updateMuseo);
router.delete("/:id", deleteMuseo);
// router.put("/:id", updateMuseo);
// router.delete("/:id", deleteMuseo);

export default router;
