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
    deleteMuseo
} from "../controllers/museo.controller.js";

const router = Router();

router.get("/museos", getMuseos);
router.post("/museos", createMuseo);
router.get("/museos/filtroPor", getMuseosFiltrados);
router.get("/museos/busqueda", getMuseosBusqueda);
router.get("/museos/nombres", getMuseosNombres);

router.get("/museos/:id", getMuseoById);
router.put("/museos/:id", updateMuseo);
router.delete("/museos/:id", deleteMuseo);

export default router;
