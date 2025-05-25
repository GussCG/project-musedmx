import { Router } from "express";
import {
  addVisita,
  deleteVisita, 
  verificarVisita,
  getVisitaByCorreo,
  getVisitaCountByMuseoId
} from "../controllers/listas/visitas.controller.js";

/*import {
  getReviewByUserId
} from "../controllers/review.controller.js"; */

const router = Router();

router.post("/visitas", addVisita);
router.delete("/visitas", deleteVisita);
router.get("/visitas", verificarVisita);
router.get("/visitas/:usr_correo", getVisitaByCorreo);
router.get("/visitas/numero/:museoId", getVisitaCountByMuseoId);

// router.get("/usuarios/:id/reviews", getReviewByUserId);

export default router;
