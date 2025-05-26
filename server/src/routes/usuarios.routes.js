import { Router } from "express";
import {
  addVisita,
  deleteVisita,
  getVisitas,
  getVisitasCount,
} from "../controllers/listas/visitas.controller.js";

/*import {
  getReviewByUserId
} from "../controllers/review.controller.js"; */

const router = Router();

router.post("/visitas/agregar", addVisita);
router.delete("/visitas/eliminar", deleteVisita);
router.get("/visitas/:correo", getVisitas);
router.get("/visitas/numero/:correo", getVisitasCount);
// router.get("/visitas", verificarVisita);
// router.get("/visitas/:usr_correo", getVisitaByCorreo);
// router.get("/visitas/numero/:museoId", getVisitaCountByMuseoId);

// router.get("/usuarios/:id/reviews", getReviewByUserId);

export default router;
