import Resena from "../models/resena.model.js";
import { handleHttpError } from "../helpers/httpError.js";
import Visitas from "../models/visitas.model.js";
import path from "path";
import { uploadToAzure } from "../utils/azureUpload.js";
import { deleteFromAzure } from "../utils/azureDelete.js";
import sharp from "sharp";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  sendRechazoResenaEmail,
  sendAprobadaResenaEmail,
} from "../services/emailService.js";

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

    // Verificar si la reseña existe
    const resena = await Resena.findById({ id: resenaId });
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada",
      });
    }

    // Aprobar la reseña
    const aprobado = await Resena.aprobarResena({
      resenaId,
      modCorreo,
    });

    if (!aprobado) {
      return res.status(500).json({
        success: false,
        message: "Error al aprobar la reseña",
      });
    }

    await sendAprobadaResenaEmail({
      recipient_email: resena[0].visitas_vi_usr_correo,
      mod_correo: modCorreo,
      resenaId,
    });

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

    // Eliminar las fotos de la reseña de Azure
    const fotos = await Resena.findFotosByResId({ resenaId: id });
    if (fotos && fotos.length > 0) {
      const containerName = "imagenes-usuarios";
      for (const foto of fotos) {
        const fotoUrl = foto.f_res_foto;
        const blobName = new URL(fotoUrl).pathname.replace(/^\/[^\/]+\//, ""); // Extrae el path interno del blob
        const eliminado = await deleteFromAzure(containerName, blobName);
        if (!eliminado) {
          return res.status(500).json({
            success: false,
            message: "Error al eliminar una de las fotos de la reseña",
          });
        }
      }
    }

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

export const registrarResena = async (req, res) => {
  try {
    const { correo } = req.usuario;
    const { museoId } = req.params;
    const { regresfrmfecVis, regresfrmcomentario, regresfrmrating } = req.body;

    const entradaBoleto = req.files?.entradaBoleto || null;
    const fotos = req.files?.fotos || [];

    // Primero subimos la resena sin fotos ni entrada para obtener el ID
    const resenaData = {
      res_calif_estrellas: regresfrmrating,
      res_comentario: regresfrmcomentario,
    };
    const resena = await Resena.createResena({
      visitas_vi_fechahora: regresfrmfecVis,
      visitas_vi_usr_correo: correo,
      visitas_vi_mus_id: museoId,
      resenaData,
    });

    const resenaId = resena.resenaId;

    if (!resenaId) {
      return res.status(400).json({
        success: false,
        message: "Error al registrar la reseña",
      });
    }

    let urlEntrada = null;
    if (entradaBoleto && entradaBoleto.length > 0) {
      const sanitizedEmail = correo.replace(/[^a-zA-Z0-9]/g, "-");
      const containerName = "imagenes-usuarios";
      const bufferJpg = await sharp(entradaBoleto[0].buffer)
        .jpeg({ quality: 80 })
        .toBuffer();
      const blobName = `${sanitizedEmail}-imagenes/resenas/resena-${resenaId}/entrada-boleto.jpg`;
      urlEntrada = await uploadToAzure(
        containerName,
        bufferJpg,
        blobName,
        "image/jpeg"
      );
      if (!urlEntrada) {
        return res.status(400).json({
          success: false,
          message: "Error al subir la entrada de boleto",
        });
      }
    }

    // Subir las fotos de la reseña
    const urlFotos = [];
    if (fotos && fotos.length > 0) {
      const sanitizedEmail = correo.replace(/[^a-zA-Z0-9]/g, "-");
      const containerName = "imagenes-usuarios";

      for (const [index, file] of fotos.entries()) {
        try {
          if (!file.buffer || file.buffer.length === 0) continue;

          const bufferJpg = await sharp(file.buffer)
            .jpeg({ quality: 80 })
            .toBuffer();
          const nuevoIndex = index + 1;
          const blobName = `${sanitizedEmail}-imagenes/resenas/resena-${resenaId}/resena-${resenaId}-${nuevoIndex}.jpg`;

          const url = await uploadToAzure(
            containerName,
            bufferJpg,
            blobName,
            "image/jpeg"
          );

          if (url) urlFotos.push(url);
        } catch (error) {
          console.error("Error al procesar foto:", file.originalname, error);
        }
      }
    }

    // Unicamente actualizamos la reseña con las fotos y la entrada
    const resenaActualizada = await Resena.edit({
      res_id_res: resenaId,
      resenaData: {
        fotos: urlFotos,
        res_foto_entrada: urlEntrada,
      },
      museoId,
      correo,
    });
    res.json({
      success: true,
      resena: resenaActualizada,
      message: "Reseña registrada correctamente",
    });
  } catch (error) {
    handleHttpError(res, "ERROR_REGISTER_RESENA", error);
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
    let ultimoIndex = 0;
    const fotos = await Resena.findFotosByResId({ resenaId });
    console.log("Fotos encontradas:", fotos);

    if (fotos && fotos.length > 0) {
      const indices = fotos.map((foto) => {
        const match = foto.f_res_foto.match(/resena-\d+-(\d+)\.jpg$/);
        return match ? parseInt(match[1]) : 0;
      });

      ultimoIndex = Math.max(...indices, 0);
    }

    if (req.files) {
      const sanitizedEmail = correo.replace(/[^a-zA-Z0-9]/g, "-");
      const containerName = "imagenes-usuarios";
      const url_fotos = [];

      for (const [index, file] of req.files.entries()) {
        const bufferJpg = await sharp(file.buffer)
          .jpeg({ quality: 80 })
          .toBuffer();
        const nuevoIndex = ultimoIndex + index + 1; // Incrementar el índice basado en las fotos existentes
        const blobName = `${sanitizedEmail}-imagenes/resenas/resena-${resenaId}/resena-${resenaId}-${nuevoIndex}.jpg`;
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

export const eliminarFotoResena = async (req, res) => {
  try {
    const { resenaId, fotoId } = req.params;

    // Verificar si la reseña existe
    const resena = await Resena.findById({ id: resenaId });
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada",
      });
    }

    // Verificar si la foto existe en la reseña
    const fotoResena = await Resena.findFotoById({
      resenaId,
      fotoId,
    });

    if (!fotoResena) {
      return res.status(404).json({
        success: false,
        message: "Foto de reseña no encontrada",
      });
    }

    // Eliminar la foto de Azure
    const containerName = "imagenes-usuarios";
    const fotoUrl = fotoResena.foto.f_res_foto;

    const blobName = new URL(fotoUrl).pathname.replace(/^\/[^\/]+\//, ""); // Extrae el path interno del blob

    const eliminado = deleteFromAzure(containerName, blobName);
    if (eliminado) {
      await Resena.deleteFotoById({
        resenaId,
        fotoId,
      });

      res.json({
        success: true,
        message: "Foto de reseña eliminada correctamente",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Error al eliminar la foto de reseña",
      });
    }
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_FOTO_RESENA", error);
  }
};

export const rechazarResena = async (req, res) => {
  try {
    const { resenaId } = req.params;
    const { motivo, comentario } = req.body;

    // Verificar si la reseña existe
    const resena = await Resena.findById({ id: resenaId });
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada",
      });
    }

    // Email de notificación al usuario con motivo y comentario
    await sendRechazoResenaEmail({
      recipient_email: resena[0].visitas_vi_usr_correo,
      motivo,
      comentario,
    });

    // Eliminar la reseña
    const eliminado = await Resena.deleteById({ id: resenaId });
    if (!eliminado) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar la reseña",
      });
    }
    res.json({
      success: true,
      message: "Reseña rechazada y eliminada correctamente",
    });
  } catch (error) {
    handleHttpError(res, "ERROR_RECHAZAR_RESENA", error);
  }
};
