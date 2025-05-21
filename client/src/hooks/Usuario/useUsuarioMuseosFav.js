import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Lista from "../../models/Listas";

import { BACKEND_URL } from "../../constants/api";

export function useUsuarioMuseosFav (usr_correo) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addFavorito = useCallback(
    async (mus_id) => {
      try {
        setLoading(true);
        const endpoint = `${BACKEND_URL}/api/usuarios/${usr_correo}/favoritos`;
        const response = await axios.post(endpoint, { mus_id });

        setFavoritos((prev) => [
          ...prev, new Lista(response.data)
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error adding favorito:", error);
        setError(error.message);
        setFavoritos([]);
      } finally {
        setLoading(false);
      }
    }, [usr_correo]
  );

  const fetchFavoritos = useCallback(
    async () => {
      try {
        setLoading(true);
        const endpoint = `${BACKEND_URL}/api/usuarios/${usr_correo}/favoritos`;
        const response = await axios.get(endpoint);

        setFavoritos(response.data.data.items.map((lista) => new Lista(lista)))
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favoritos:", error);
        setError(error.message);
        setFavoritos([]);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [usr_correo]
  );

  useEffect(() => {
    fetchFavoritos(usr_correo);
  }, [fetchFavoritos]);

  const removeFavorito = useCallback(
    async (mus_id) => {
      try {
        setLoading(true);
        const endpoint = `${BACKEND_URL}/api/usuarios/${usr_correo}/favoritos/${mus_id}`;
        await axios.delete(endpoint);

        setFavoritos((prev) => 
          prev.filter((item) => item.mus_id !== mus_id)
        );
        setLoading(false);
      } catch (error) {
        console.error("Error removing favorito:", error);
        setError(error.message);
        setFavoritos([]);
      } finally {
        setLoading(false);
      }
    }, [usr_correo]
  );

  return {
    favoritos,
    loading,
    error,
    addFavorito,
    fetchFavoritos,
    removeFavorito,
  };
};