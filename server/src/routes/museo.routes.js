import { Router } from "express";
import {
  getMuseos,
  getMuseosNombres,
  getMuseoById,
  getGaleriaById,
  getHorariosById,
  getRedesById,
} from "../controllers/museo.controller.js";

const router = Router();

router.get("/", getMuseos);
router.get("/nombres", getMuseosNombres);
router.get("/:id", getMuseoById);
router.get("/galeria/:id", getGaleriaById);
router.get("/horarios/:id", getHorariosById);
router.get("/redes/:id", getRedesById);
// router.put("/:id", updateMuseo);
// router.delete("/:id", deleteMuseo);

export default router;
