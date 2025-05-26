import Lista from "../../models/visitas.model.js";
import { handleHttpError } from "../../helpers/httpError.js";

export const getVisitas = async (req, res) => {
  try {
    const { correo } = req.body;

    const vi = await Lista.find(correo);
    if (!vi) {
      return res.status(404).json({ message: "Visitas not found" });
    }
    res.json(vi);
  } catch (error) {
    handleHttpError(res, "ERROR_GET_VI", error);
  }
};

export const addVisita = async (req, res) => {
  try {
    const { correo, museoId, fechaHora } = req.body;

    const vi = await Lista.add({
      correo,
      museoId,
      fechaHora,
    });
    if (!vi) {
      return res.status(404).json({ message: "Visita not found" });
    }
    res.status(201).json(vi);
  } catch (error) {
    handleHttpError(res, "ERROR_ADD_VI", error);
  }
};

export const deleteVisita = async (req, res) => {
  try {
    const { correo, museoId } = req.body;

    const vi = await Lista.delete({
      correo,
      museoId,
    });
    if (!vi) {
      return res.status(404).json({ message: "Visita not found" });
    }
    res.json({
      success: true,
      message: "Visita deleted successfully",
      vi,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_VI", error);
  }
};

export const getVisitasCount = async (req, res) => {
  try {
    const { correo } = req.params;
    const count = await Lista.getVisitasCount(correo);
    const totalMuseos = await Lista.getTotalMuseos();

    res.json({
      success: true,
      count,
      totalMuseos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_VI_COUNT", error);
  }
};
