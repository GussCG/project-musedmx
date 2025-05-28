import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "../../constants/api";
import Museo from "../../models/Museo/Museo";

export const useFavorito = ({ museoId } = {}) => {
  const [museosFavoritos, setMuseosFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  const fetchMuseosFavoritosUsuario = useCallback(async (correo) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/favoritos/museosfavoritos/${correo}`;
      const response = await axios.get(endpoint);
      setMuseosFavoritos(response.data.museos.map((museo) => new Museo(museo)));
    } catch (error) {
      console.error("Error al obtener los museos favoritos:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const agregarFavorito = useCallback(async (correo, museoId) => {
    try {
      const endpoint = `${BACKEND_URL}/api/favoritos/agregar`;
      const response = await axios.post(endpoint, { correo, museoId });
      await getFavoritosCountByMuseoId(museoId);
      return response.data;
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      throw error;
    }
  }, []);

  const eliminarFavorito = useCallback(async (correo, museoId) => {
    try {
      const endpoint = `${BACKEND_URL}/api/favoritos/eliminar`;
      const response = await axios.delete(endpoint, {
        data: { correo, museoId },
      });
      await getFavoritosCountByMuseoId(museoId);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      throw error;
    }
  }, []);

  const verificarFavorito = useCallback(async (correo, museoId) => {
    try {
      const endpoint = `${BACKEND_URL}/api/favoritos/`;
      const response = await axios.get(endpoint, {
        params: { correo, museoId },
      });
      return response.data.isFavorite;
    } catch (error) {
      console.error("Error al verificar favorito:", error);
      throw error;
    }
  }, []);

  const getFavoritosCountByMuseoId = useCallback(async (museoId) => {
    try {
      const endpoint = `${BACKEND_URL}/api/favoritos/numero/${museoId}`;
      const response = await axios.get(endpoint);
      setCount(response.data.count);
      return response.data.count;
    } catch (error) {
      console.error("Error al obtener el conteo de favoritos:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (museoId) getFavoritosCountByMuseoId(museoId);
  }, [museoId, getFavoritosCountByMuseoId]);

  return {
    museosFavoritos,
    loading,
    error,
    count,
    fetchMuseosFavoritosUsuario,
    agregarFavorito,
    eliminarFavorito,
    verificarFavorito,
    getFavoritosCountByMuseoId,
  };
};
