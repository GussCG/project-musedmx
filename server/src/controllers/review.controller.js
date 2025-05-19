import Review from "../models/review.model.js";
import { handleHttpError } from "../helpers/httpError.js";
import fs from "fs";
import path from "path";

export const getReviews = async (req, res) => {
  try {
	const reviews = await Review.findAll();
	res.status(200).json(reviews);
  } catch (error) {
	handleHttpError(res, "ERROR_GET_REVIEWS");
  }
};

export const getReviewByMuseumId = async (req, res) => {
  try {
	const { id } = req.params;
	const reviews = await Review.findAll({ where: { museumId: id } });
	res.status(200).json(reviews);
  } catch (error) {
	handleHttpError(res, "ERROR_GET_REVIEW_BY_MUSEUM_ID");
  }
};

export const getReviewByUserId = async (req, res) => {
  try {
	const { id } = req.params;
	const reviews = await Review.findAll({ where: { userId: id } });
	res.status(200).json(reviews);
  } catch (error) {
	handleHttpError(res, "ERROR_GET_REVIEW_BY_USER_ID");
  }
};

export const createReview = async (req, res) => {
  try {
	let {
		res_comentario,
		res_
	}

	const { body, file } = req;
	const reviewData = {
	  ...body,
	  res_foto: file ? file.filename : null,
	};
	const newReview = await Review.create(reviewData);
	res.status(201).json(newReview);
  } catch (error) {
	handleHttpError(res, "ERROR_CREATE_REVIEW");
  }
};

export const editReview = async (req, res) => {
  try {
	const { id } = req.params;
	const { body, file } = req;
	const reviewData = {
	  ...body,
	  res_foto: file ? file.filename : null,
	};
	const updatedReview = await Review.update(id, reviewData);
	res.status(200).json(updatedReview);
  } catch (error) {
	handleHttpError(res, "ERROR_EDIT_REVIEW");
  }
};

export const deleteReview = async (req, res) => {
  try {
	const { id } = req.params;
	const review = await Review.findById(id);
	if (review.res_foto) {
	  const filePath = path.join(__dirname, "../uploads", review.res_foto);
	  fs.unlinkSync(filePath);
	}
	await Review.delete(id);
	res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
	handleHttpError(res, "ERROR_DELETE_REVIEW");
  }
};

