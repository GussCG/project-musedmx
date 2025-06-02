import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/api";

export const useVisitas = ({ museoId } = {}) => {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addVisita = async (correo, museoId) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/visitas/agregar`;
      const response = await axios.post(endpoint, {
        correo,
        museoId,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding visita:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitas = async (correo) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/visitas/${encodedCorreo}`;
      const response = await axios.get(endpoint);

      setVisitas(response.data.visitas);
    } catch (error) {
      console.error("Error fetching visitas:", error);
      setError(error.message);
      setVisitas([]);
    } finally {
      setLoading(false);
    }
  };

  const removeVisita = async (correo, museoId) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/visitas/eliminar`;
      const response = await axios.delete(endpoint, {
        data: {
          correo,
          museoId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing visita:", error);
      setError(error.message);
      throw error;
    }
  };

  const fetchCountVisitas = async (correo) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/visitas/numero/${encodedCorreo}`;
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching visitas count:", error);
      setError(error.message);
      throw error;
    }
  };

  const yaVisitoMuseo = async (correo, museoId) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/visitas/usuario/visito-museo/${encodedCorreo}/${museoId}`;
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error checking if user visited museum:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    visitas,
    loading,
    error,
    addVisita,
    fetchVisitas,
    removeVisita,
    fetchCountVisitas,
    fetchVisitas,
    yaVisitoMuseo,
  };
};
