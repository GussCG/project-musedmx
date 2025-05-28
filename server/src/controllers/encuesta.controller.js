import Encuesta from "../models/encuesta.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const getPreguntas = async (req, res) => {
  try {
    const { encuestaId } = req.params;
    const preguntas = await Encuesta.findPreguntas({ encuestaId });
    res.json({
      success: true,
      preguntas,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_PREGUNTAS", error);
  }
};

export const getServicios = async (req, res) => {
  try {
    const servicios = await Encuesta.findServicios();
    res.json({
      success: true,
      servicios,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_SERVICIOS", error);
  }
};

export const getEncuesta = async (req, res) => {
  try {
    const { encuestaId, museoId, correo } = req.params;
    const data = await Encuesta.findEncuesta({
      encuestaId,
      museoId,
      correo,
    });
    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_ENCUESTA", error);
  }
};

export const getRespuestasTotales = async (req, res) => {
  try {
    const { encuestaId, museoId } = req.params;
    const data = await Encuesta.findRespuestasTotales({
      encuestaId,
      museoId,
    });

    res.json({
      success: true,
      respuestas: data.respuestas,
      servicios: data.servicios,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_ENCUESTA", error);
  }
};
