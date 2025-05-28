import Resena from "../models/resena.model.js";
import { handleHttpError } from "../helpers/httpError.js";

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
