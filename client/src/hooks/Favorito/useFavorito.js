import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants/api";

export const useFavorito = () => {
  const agregarFavorito = async (correo, museoId) => {
    try {
      const endpoint = `${BACKEND_URL}/api/favoritos/`;
      const response = await axios.post(endpoint, {
        correo,
        museoId,
      });
      return response.data;
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      throw error;
    }
  };

  const eliminarFavorito = async (correo, museoId) => {
    try {
      const endpoint = `${BACKEND_URL}/api/favoritos/`;
      const response = await axios.delete(endpoint, {
        data: {
          correo,
          museoId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      throw error;
    }
  };

  const verificarFavorito = async (correo, museoId) => {
    try {
      const endpoint = `${BACKEND_URL}/api/favoritos/`;
      const response = await axios.get(endpoint, {
        params: {
          correo,
          museoId,
        },
      });
      return response.data.isFavorite;
    } catch (error) {
      console.error("Error al verificar favorito:", error);
      throw error;
    }
  };

  return {
    agregarFavorito,
    eliminarFavorito,
    verificarFavorito,
  };
};
