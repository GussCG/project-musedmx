import { Router } from "express";
import { upload } from '../middleware/upload.js';
import {
  getMuseos,
  createMuseo,
  getMuseosFiltrados,
  getMuseosBusqueda,
  getMuseosNombres,
  // getMuseosBusqueda,
  // getMuseosCercanos,
  // getMuseosPopulares,
    getMuseoById,
    updateMuseo,
    deleteMuseo
} from "../controllers/museo.controller.js";

const router = Router();

router.get("/", getMuseos);
router.post("/", upload.single('mus_foto'), createMuseo);
router.get("/filtroPor", getMuseosFiltrados);
router.get("/busqueda", getMuseosBusqueda);
router.get("/nombres", getMuseosNombres);

router.get("/:id", getMuseoById);
router.put("/:id", upload.single('mus_foto'), updateMuseo);
router.delete("/:id", deleteMuseo);

export default router;
