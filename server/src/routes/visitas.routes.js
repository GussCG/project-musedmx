import { Router } from "express";
import {
  getVisitas,
  addVisita,
  deleteVisita, 
} from "../controllers/listas/visitas.controller.js";


const router = Router();

router.get("/:usr_correo", getVisitas)
router.post("/", addVisita);
router.delete("/", deleteVisita);

export default router;
