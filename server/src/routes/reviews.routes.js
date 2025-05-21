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
router.post("/", upload.array('f_res_foto', 10), createReview);
router.put("/:id", upload.array('f_res_foto', 10), editReview);
router.delete("/:id", deleteReview);

export default router;
