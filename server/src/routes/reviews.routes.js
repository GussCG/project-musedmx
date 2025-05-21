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
router.post("/", upload.single('mus_foto'), createReview);
router.put("/:id", upload.single('mus_foto'), editReview);
router.delete("/:id", deleteReview);

export default router;
