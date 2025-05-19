import { Router } from "express";

import {
  getFavoritos,
  addFavorito,
  deleteFavorito
} from "../controllers/listas/favoritos.controller.js";

import {
  getQv,
  addQv,
  deleteQv
} from "../controllers/listas/qV.controller.js";

import {
  getVisitas,
  addVisita,
  deleteVisita
} from "../controllers/listas/visitas.controller.js";

/*import {
  getReviewByUserId
} from "../controllers/review.controller.js"; */

const router = Router();

router.get("/favoritos", getFavoritos);
router.post("/favoritos", addFavorito);
router.delete("/favoritos", deleteFavorito);

router.get("/qV", getQv);
router.post("/qV", addQv);
router.delete("/qV", deleteQv);

router.get("/visitas", getVisitas);
router.post("/visitas", addVisita);
router.delete("/visitas", deleteVisita);

// router.get("/usuarios/:id/reviews", getReviewByUserId);

export default router;