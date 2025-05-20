import Favorito from "../models/favorito.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const agregarFavorito = async (req, res) => {
  const { correo, museoId } = req.body;
  try {
    const favorito = await Favorito.agregarFavorito({ correo, museoId });
    console.log(favorito.data);
    return res.status(200).json({
      message: "Favorito agregado correctamente",
      data: favorito,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_AGREGAR_FAVORITO", 500);
  }
};

export const eliminarFavorito = async (req, res) => {
  const { correo, museoId } = req.body;
  try {
    const favorito = await Favorito.eliminarFavorito({ correo, museoId });
    return res.status(200).json({
      message: "Favorito eliminado correctamente",
      data: favorito,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_ELIMINAR_FAVORITO", 500);
  }
};

export const verificarFavorito = async (req, res) => {
  const { correo, museoId } = req.query;
  try {
    const favorito = await Favorito.verificarFavorito({ correo, museoId });
    const isFavorite = favorito.length > 0;
    return res.status(200).json({
      isFavorite: favorito.length > 0,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_VERIFICAR_FAVORITO", 500);
  }
};
