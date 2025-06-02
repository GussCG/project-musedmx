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
      res_calif_estrellas, 
      visitas_vi_usr_correo,
      visitas_vi_mus_id,
      visitas_vi_fechahora
    } = req.body;

    const res_foto_entrada = req.files.res_foto_entrada ? req.files.res_foto_entrada[0] : null;
    if (res_foto_entrada) {
      const sanitizedEmail = visitas_vi_usr_correo.replace(/[^a-zA-Z0-9]/g, "-");
      const containerName = "imagenes-usuarios";
      const tempJpgPath = path.join(
        __dirname,
        "..",
        "temp",
        `${sanitizedEmail}-imagenes`,
        "visitas",
        `${visitas_vi_mus_id}_entrada.jpg`
      );

      const tempDir = path.dirname(tempJpgPath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      await sharp(res_foto_entrada.path).jpeg({ quality: 80 }).toFile(tempJpgPath);

      const bufferJpg = fs.readFileSync(tempJpgPath);
      const blobName = `${sanitizedEmail}-imagenes/visitas/${visitas_vi_mus_id}_entrada.jpg`;

      const nuevaFotoUrl = await uploadToAzure(
        containerName,
        bufferJpg,
        blobName,
        "image/jpeg"
      );

      // Eliminar el archivo temporal y la carpeta
      if (fs.existsSync(tempJpgPath)) {
        fs.unlinkSync(tempJpgPath);
      }
      if (fs.existsSync(tempDir) && fs.readdirSync(tempDir).length === 0) {
        fs.rmdirSync(tempDir, { recursive: true });
      }

      res_foto_entrada = nuevaFotoUrl;
    }

    const reviewData = {
      res_comentario,
      res_foto_entrada: res_foto_entrada || null, 
      res_calif_estrellas,
      visitas_vi_usr_correo,
      visitas_vi_mus_id,
      visitas_vi_fechahora
    };

    const newReview = await Review.createReview(reviewData);
    const { idresena } = newReview;

    const reviewPhotos = req.files.f_res_foto || [];
    if (reviewPhotos.length > 0) {
      const sanitizedEmail = visitas_vi_usr_correo.replace(/[^a-zA-Z0-9]/g, "-");
      const containerName = "imagenes-usuarios";
      const photosURLs = [];

      for (let idx = 0; idx < reviewPhotos.length; idx++) {
        const tempJpgPath = path.join(
          __dirname,
          "..",
          "temp",
          `${sanitizedEmail}-imagenes`,
          "resenas", 
          `${idresena}_${idx}.jpg`
        );

        const tempDir = path.dirname(tempJpgPath);
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        await sharp(reviewPhotos[idx].path).jpeg({ quality: 80 }).toFile(tempJpgPath);

        const bufferJpg = fs.readFileSync(tempJpgPath); // Leer el archivo como buffer

        const blobName = `${sanitizedEmail}-imagenes/resenas/${idresena}_${idx}.jpg`;

        const nuevaFotoUrl = await uploadToAzure(
          containerName,
          bufferJpg,
          blobName,
          "image/jpeg"
        );

        photosURLs.push(nuevaFotoUrl);

		    // Eliminar el archivo temporal y la carpeta
        if (fs.existsSync(tempJpgPath)) {
          fs.unlinkSync(tempJpgPath);
        }

        // Eliminar la carpeta temporal
        if (fs.existsSync(tempDir)) {
          fs.rmdirSync(tempDir, { recursive: true });
        }        
      }
      await Review.updateReviewImages(idresena, photosURLs);
      res.status(201).json({
        message: "Review with photos created successfully",
        review: {
          ...reviewData,
          res_foto_entrada: photosURLs,
          idresena
        }
      });
    } else {
      res.status(201).json({
        message: "Review created successfully without photos",
        review: {
          ...reviewData,
          res_foto_entrada: [],
          idresena
        }
      });
    }
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_REVIEW", error);
  }
};

export const editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      res_comentario, 
      res_calif_estrellas 
    } = req.body;

    // Verificar si existe la reseña
    const existingReviews = await Review.findAll({ where: { res_id_res: id } });
    if (existingReviews.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    let fotos = [];
    if (req.files && req.files.length > 0) {
      const sanitizedEmail = existingReviews[0].visitas_vi_usr_correo.replace(/[^a-zA-Z0-9]/g, "-");
      const containerName = "imagenes-usuarios";
      for (let idx = 0; idx < req.files.length; idx++) {
        const file = req.files[idx];
        const tempJpgPath = path.join(
          __dirname,
          "..",
          "temp",
          `${sanitizedEmail}-imagenes`,
          "resenas",
          `${id}_${idx}.jpg`
        );
        const tempDir = path.dirname(tempJpgPath);
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        await sharp(file.path).jpeg({ quality: 80 }).toFile(tempJpgPath);
        const bufferJpg = fs.readFileSync(tempJpgPath);
        const blobName = `${sanitizedEmail}-imagenes/resenas/${id}_${idx}.jpg`;
        const nuevaFotoUrl = await uploadToAzure(
          containerName,
          bufferJpg,
          blobName,
          "image/jpeg"
        );
        fotos.push(nuevaFotoUrl);

        // Eliminar el archivo temporal y la carpeta
        if (fs.existsSync(tempJpgPath)) {
          fs.unlinkSync(tempJpgPath);
        }

        // Eliminar la carpeta temporal
        if (fs.existsSync(tempDir)) {
          fs.rmdirSync(tempDir, { recursive: true });
        }  
      }
    }

    // Actualizar reseña y fotos
    const updatedReview = await Review.updateReview(
      id,
      {
        res_comentario,
        res_calif_estrellas,
      }
    );

    if (fotos.length > 0) {
      await Review.updateReviewImages(id, fotos);
      updatedReview.res_foto_entrada = fotos;
    }

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

