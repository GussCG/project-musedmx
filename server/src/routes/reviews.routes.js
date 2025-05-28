import { Router } from "express";
import { upload } from '../middleware/upload.js';
import {
  getReviews,
  getReviewByMuseumId,
  createReview,
  editReview,
  deleteReview
} from "../controllers/review.controller.js";

const router = Router();

router.get("/", getReviews);
router.get("/:id", getReviewByMuseumId);
router.post("/", upload.fields([
	{ name: 'res_foto_entrada', maxCount: 1 },
	{ name: 'f_res_foto', maxCount: 10 }
]), createReview);
router.put("/:id", upload.fields([
	{ name: 'res_foto_entrada', maxCount: 1 },
	{ name: 'f_res_foto', maxCount: 10 }
]), editReview);
router.delete("/:id", deleteReview);

export default router;
