import { Router } from "express";
import {
  getVisitas,
  addVisita,
  deleteVisita,
} from "../controllers/listas/visitas.controller.js";

/*import {
  getReviewByUserId
} from "../controllers/review.controller.js"; */

const router = Router();

router.get("/visitas", getVisitas);
router.post("/visitas", addVisita);
router.delete("/visitas", deleteVisita);

// router.get("/usuarios/:id/reviews", getReviewByUserId);

export default router;
