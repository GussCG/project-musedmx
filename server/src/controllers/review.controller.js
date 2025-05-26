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
      res_aprobado, 
      res_calif_estrellas, 
      visitas_vi_usr_correo,
      visitas_vi_mus_id,
      visitas_vi_fechahora
    } = req.body;

    const reviewData = {
      res_comentario,
      res_aprobado,
      res_calif_estrellas,
      visitas_vi_usr_correo,
      visitas_vi_mus_id,
      visitas_vi_fechahora
    };

    if (req.files && req.files.length > 0) {
      const fotos = req.files.map((file) => file.filename);
      const newReview = await Review.createReviewWithPhotos(reviewData, fotos);
      res.status(201).json(newReview);
    } else {
      const newReview = await Review.createReview(reviewData);
      res.status(201).json(newReview);
    }
    res
	} catch (error) {
		handleHttpError(res, "ERROR_CREATE_REVIEW", error);
	}
};

export const editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { res_comentario, res_aprobado, res_calif_estrellas } = req.body;

    // Verificar si existe la reseña
    const existingReviews = await Review.findAll({ where: { res_id_res: id } });
    if (existingReviews.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Extraer fotos nuevas (si vienen)
    const fotos = req.files ? req.files.map((file) => file.filename) : [];

    // Actualizar reseña y fotos
    const updatedReview = await Review.updateReview(
      id,
      {
        res_comentario,
        res_aprobado,
        res_calif_estrellas,
      },
      fotos
    );

    res.status(200).json(updatedReview);
  } catch (error) {
    handleHttpError(res, "ERROR_EDIT_REVIEW", error);
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
    await Review.deleteReview(id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
	  handleHttpError(res, "ERROR_DELETE_REVIEW", error);
  }
};

