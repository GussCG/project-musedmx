import Encuesta from "../models/encuesta.model.js";
import { handleHttpError } from "../helpers/httpError.js";
import Visitas from "../models/visitas.model.js";

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
    console.log("Encuesta data:", data);
    res.json({
      success: true,
      data,
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

export const registrarEncuesta = async (req, res) => {
  try {
    const { encuestaId, museoId, correo } = req.params;
    const resenaData = req.body;

    // Verificar que el usuario tenga al menos una visita en el museo
    const visita = await Visitas.verifyVisita({
      vi_usr_correo: correo,
      vi_mus_id: museoId,
    });

    console.log("Visita encontrada:", visita);

    // if (!visita) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "El usuario no tiene visitas registradas en este museo",
    //   });
    // }

    // const result = await Encuesta.registrarEncuesta({
    //   encuestaId,
    //   museoId,
    //   correo,
    //   resenaData,
    //   fechahora: visita.vi_fechahora,
    // });

    // res.json({
    //   success: true,
    //   message: "Encuesta registrada exitosamente",
    //   result,
    // });
  } catch (error) {
    handleHttpError(res, "ERROR_REGISTRAR_ENCUESTA", error);
  }
};

export const updateEncuesta = async (req, res) => {
  try {
    const { encuestaId, museoId, correo } = req.params;
    const encuestaData = req.body;

    // Verificar que la encuesta ya haya sido contestada
    const encuesta = await Encuesta.findEncuesta({
      encuestaId,
      museoId,
      correo,
    });

    if (!encuesta) {
      return res.status(400).json({
        success: false,
        message: "La encuesta no ha sido contestada previamente",
      });
    }

    const datosActualizar = {};

    if (encuestaData.respuestas && encuestaData.respuestas.length > 0) {
      datosActualizar.respuestas = encuestaData.respuestas;
    }

    if (encuestaData.servicios && encuestaData.servicios.length > 0) {
      datosActualizar.servicios = encuestaData.servicios;
    }

    const result = await Encuesta.updateEncuesta({
      encuestaId,
      museoId,
      correo,
      data: datosActualizar,
    });

    res.json({
      success: true,
      message: "Encuesta actualizada exitosamente",
      result,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_ENCUESTA", error);
  }
};
