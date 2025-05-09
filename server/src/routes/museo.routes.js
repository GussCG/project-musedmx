import { Router } from "express";
import {
  getMuseos,
  createMuseo,
  getMuseosNombres,
  getMuseoById,
  getGaleriaById,
} from "../controllers/museo.controller.js";

const router = Router();

router.get("/", getMuseos);
router.post("/", createMuseo);
router.get("/nombres", getMuseosNombres);
router.get("/:id", getMuseoById);
router.get("/galeria/:id", getGaleriaById);
// router.put("/:id", updateMuseo);
// router.delete("/:id", deleteMuseo);

export default router;
