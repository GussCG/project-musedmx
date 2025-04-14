import { Router } from "express";
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
    deleteMuseo,
} from "../controllers/museo.controller.js";

const router = Router();

router.get("/", getMuseos);
router.post("/", createMuseo);
router.get("/filtroPor", getMuseosFiltrados);
router.get("/busqueda", getMuseosBusqueda);
router.get("/nombres", getMuseosNombres);
router.get("/:id", getMuseoById);
router.put("/:id", updateMuseo);
router.delete("/:id", deleteMuseo);

export default router;
