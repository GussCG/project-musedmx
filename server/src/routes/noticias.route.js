import { Router } from "express";

import {
  getNoticias,
  getNoticiasPorMuseo,
} from "../controllers/noticias.controller.js";

const router = Router();

router.get("/museos", getNoticias);
router.get("/museos/:mus_id", getNoticiasPorMuseo);

export default router;
