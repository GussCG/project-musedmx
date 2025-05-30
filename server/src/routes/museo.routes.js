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
  getMuseosSugeridosByCorreo,
  getMuseosSimilaresById,
  getMuseosCercaById,
  getMuseosAsociacionById,
  updateHorarioByDia,
  uploadImages,
  updateGaleria,
  addByDia,
  deleteByDia,
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
router.get("/sugeridos/:correo", getMuseosSugeridosByCorreo);
router.get("/similares/:id", getMuseosSimilaresById);
router.get("/cercanos/:id", getMuseosCercaById);
router.get("/asociacion/:id", getMuseosAsociacionById);
router.post("/horarios/updateByDia/:id", updateHorarioByDia);
router.post("/horarios/agregarByDia/:id", addByDia);
router.post("/horarios/eliminarByDia/:id", deleteByDia);
router.post("/galeria/upload/:id", uploadImages);
router.post("/galeria/update/:id", updateGaleria);

export default router;
