import Lista from "../models/lista.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const getVisitas = async (req, res) => {
  try {
    const { usr_correo } = req.params;

    const vi = await Lista.find(usr_correo);
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
    const { vi_fechahora, vi_usr_correo, vi_mus_id } = req.body;

    // console.log(vi_usr_correo, vi_mus_id, vi_fechahora);

    const vi = await Lista.add({
      vi_fechahora,
      vi_usr_correo,
      vi_mus_id,
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
    const { vi_usr_correo, vi_mus_id } = req.body;

    const vi = await Lista.delete({
      vi_usr_correo,
      vi_mus_id,
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
