import { Router } from "express";
import { upload } from '../middleware/upload.js';
import {
	getMuseos,
	createMuseo,
	getMuseosNombres,
  // getMuseosBusqueda,
  // getMuseosCercanos,
  // getMuseosPopulares,
    getMuseoById,
  	getGaleriaById,
    updateMuseo,
    deleteMuseo
} from "../controllers/museo.controller.js";

const router = Router();

router.get("/", getMuseos);
router.get("/busqueda", getMuseos);
router.get("/nombres", getMuseosNombres);
router.get("/:id", getMuseoById);
router.get("/galeria/:id", getGaleriaById);
router.post("/", upload.single('mus_foto'), createMuseo);
router.put("/:id", upload.single('mus_foto'), updateMuseo);
router.delete("/:id", deleteMuseo);
// router.put("/:id", updateMuseo);
// router.delete("/:id", deleteMuseo);

export default router;
