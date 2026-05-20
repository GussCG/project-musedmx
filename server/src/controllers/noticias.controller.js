import Noticias from "../models/noticias.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const getNoticias = async (req, res) => {
  try {
    const data = await Noticias.getNoticias();
    res.json(data);
  } catch (error) {
    handleHttpError(res, "Error al obtener noticias", 500);
  }
};

export const getNoticiasPorMuseo = async (req, res) => {
  try {
    const { mus_id } = req.params;
    const data = await Noticias.getNoticiasPorMuseo(mus_id);
    res.json(data);
  } catch (error) {
    handleHttpError(res, "Error al obtener noticias por museo", 500);
  }
};
