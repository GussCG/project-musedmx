import Resena from "../models/resena.model.js";
import { handleHttpError } from "../helpers/httpError.js";
import Visitas from "../models/visitas.model.js";
import path from "path";
import { uploadToAzure } from "../utils/azureUpload.js";
import sharp from "sharp";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getResenasById = async (req, res) => {
  try {
    const { id } = req.params;
    const resena = await Resena.findById({ id });
    res.json({
      resena,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_RESENAS_ID", error);
  }
};

export const getResenasPendientes = async (req, res) => {
  try {
    const { museoId } = req.query;
    const resenas = await Resena.findPendientes({ museoId });
    res.json({
      success: true,
      resenas,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_RESENAS_PENDIENTES", error);
  }
};

export const getResenasFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const resena = await Resena.findFoto({ id });
    res.json({
      success: true,
      id,
      resena,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_RESENAS_FOTO", error);
  }
};

export const getResenasByMuseo = async (req, res) => {
  try {
    const { museoId } = req.params;
    const { pagina = 1, porPagina = 10, ...filtros } = req.query;

    const resenas = await Resena.findByMuseo({
      museoId,
      pagina: Number(pagina),
      porPagina: Number(porPagina),
      filtros,
    });

    res.json({
      success: true,
      resenas,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_RESENAS_BY_MUSEO", error);
  }
};

export const getResenasModAll = async (req, res) => {
  try {
    const resenas = await Resena.findAllMods();
    res.json({
      success: true,
      resenas,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_RESENAS_MOD_ALL", error);
  }
};

export const getResenasModByMuseo = async (req, res) => {
  try {
    const { museoId } = req.params;
    const resenas = await Resena.findAllModsByMuseo(museoId);
    res.json({
      success: true,
      resenas,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_RESENAS_MOD_BY_MUSEO", error);
  }
};

export const aprobarResena = async (req, res) => {
  try {
    const { resenaId } = req.params;
    const { modCorreo } = req.body;
    const resena = await Resena.aprobarResena({ resenaId, modCorreo });
    res.json({
      success: true,
      resenaId,
      resena,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_APROBAR_RESENA", error);
  }
};

export const getResenasByCorreo = async (req, res) => {
  try {
    const { correo } = req.params;
    const resenas = await Resena.findByCorreo({ correo });
    res.json({
      success: true,
      resenas,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_RESENAS_BY_CORREO", error);
  }
};

export const eliminarResena = async (req, res) => {
  try {
    const { id } = req.params;
    // Obtener la reseña por ID para verificar si existe
    const resena = await Resena.findById({ id });

    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada",
      });
    }

    const { visitas_vi_usr_correo, visitas_vi_mus_id, visitas_vi_fechahora } =
      resena[0];

    // Eliminar la visita
    const result = await Visitas.delete({
      vi_usr_correo: visitas_vi_usr_correo,
      vi_mus_id: visitas_vi_mus_id,
      vi_fechahora: visitas_vi_fechahora,
    });

    res.json({
      success: true,
      message: "Reseña eliminada correctamente",
      result,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_RESENA", error);
  }
};

export const editarResena = async (req, res) => {
  try {
    const { resenaId } = req.params;
    const { correo } = req.usuario; // Viene del token decodificado en el middleware
    const { mus_id } = req.body; // ID del museo al que pertenece la reseña

    // Verificar si la reseña existe
    const resena = await Resena.findById({ id: resenaId });
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada",
      });
    }

    const datosActualizar = {};

    if (req.body.res_calif_estrellas) {
      datosActualizar.res_calif_estrellas = req.body.res_calif_estrellas;
    }
    if (req.body.res_comentario) {
      datosActualizar.res_comentario = req.body.res_comentario;
    }
    if (req.body.visitas_vi_fechahora) {
      datosActualizar.visitas_vi_fechahora = req.body.visitas_vi_fechahora;
    }

    if (req.files) {
      const sanitizedEmail = correo.replace(/[^a-zA-Z0-9]/g, "_");
      const containerName = "imagenes-usuarios";
      const url_fotos = [];

      for (const [index, file] of req.files.entries()) {
        const bufferJpg = await sharp(file.buffer)
          .jpeg({ quality: 80 })
          .toBuffer();
        const blobName = `${sanitizedEmail}-imagenes/resenas/resena-${resenaId}/resena-${resenaId}-${
          index + 1
        }.jpg`;
        const url = await uploadToAzure(
          containerName,
          bufferJpg,
          blobName,
          "image/jpeg"
        );
        url_fotos.push(url);
      }

      datosActualizar.fotos = url_fotos;
    }

    const resenaActualizada = await Resena.edit({
      res_id_res: resenaId,
      resenaData: datosActualizar,
      museoId: mus_id,
      correo,
    });
    res.json({
      success: true,
      resena: resenaActualizada,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_EDIT_RESENA", error);
  }
};
