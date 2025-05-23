import QV from "../models/quierovisitar.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const agregarQV = async (req, res) => {
  const { correo, museoId } = req.body;
  try {
    const qv = await QV.agregarQV({ correo, museoId });
    return res.status(200).json({
      message: "Quiero visitar agregado correctamente",
      museo: qv,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_AGREGAR_QV", 500);
  }
};

export const eliminarQV = async (req, res) => {
  const { correo, museoId } = req.body;
  try {
    const qv = await QV.eliminarQV({ correo, museoId });
    return res.status(200).json({
      message: "Quiero visitar eliminado correctamente",
      museo: qv,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_ELIMINAR_QV", 500);
  }
};

export const obtenerQV = async (req, res) => {
  const { correo } = req.params;
  try {
    const qv = await QV.obtenerQV({ correo });
    return res.status(200).json({
      success: true,
      museos: qv,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_OBTENER_QV", 500);
  }
};
