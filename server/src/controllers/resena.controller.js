import Resena from "../models/resena.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const getResenasById = async (req, res) => {
  try {
    const { id } = req.params;
    const resena = await Resena.findById({ id });
    res.json({
      success: true,
      id,
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

export const aprobarResena = async (req, res) => {
  try {
	const { id } = req.params;
	const resena = await Resena.aprobar({ id });
	res.json({
	  success: true,
	  id,
	  resena,
	});
  } catch (error) {
	handleHttpError(res, "ERROR_APROBAR_RESENA", error);
  }
}