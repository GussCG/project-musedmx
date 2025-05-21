import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Lista from "../../models/Usuario/Listas";

import { BACKEND_URL } from "../../constants/api";

export function useUsuarioMuseosQV (usr_correo) {
  const [qv, setQv] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addQv = useCallback(
    async (mus_id) => {
      try {
        setLoading(true);
        const endpoint = `${BACKEND_URL}/api/usuarios/${usr_correo}/qv`;
        const response = await axios.post(endpoint, { mus_id });

        setQv((prev) => [
          ...prev, new Lista(response.data)
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error adding qv:", error);
        setError(error.message);
        setQv([]);
      } finally {
        setLoading(false);
      }
    }, [usr_correo]
  );

  const fetchQv = useCallback(
    async () => {
      try {
        setLoading(true);
        const endpoint = `${BACKEND_URL}/api/usuarios/${id}/qv`;
        const response = await axios.get(endpoint);

        setQv(response.data.data.items.map((lista) => new Lista(lista)))
        setLoading(false);
      } catch (error) {
        console.error("Error fetching qv:", error);
        setError(error.message);
        setQv([]);
        throw error;
      } finally {
        setLoading(false);
      }
    }, [listId]
  );

  useEffect(() => {
  fetchQv(listId);
  }, [fetchQv]);  

  const removeQv = useCallback(
    async (mus_id) => {
      try {
        setLoading(true);
        const endpoint = `${BACKEND_URL}/api/usuarios/${usr_correo}/qv/${mus_id}`;
        await axios.delete(endpoint);

        setQv((prev) =>
          prev.filter((item) => item.mus_id !== mus_id)
        );
        setLoading(false);
      } catch (error) {
        console.error("Error removing qv:", error);
        setError(error.message);
        setQv([]);
      } finally {
        setLoading(false);
      }
    }, [usr_correo]
  );

  return { 
    qv, 
    loading, 
    error, 
    addQv,
    fetchQv,
    removeQv,
  };
};