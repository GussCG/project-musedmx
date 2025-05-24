import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../../constants/api";
import Museo from "../../models/Museo/Museo";

export const useQv = ({ mus_idd } = {}) => {
  const [qv, setQv] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  const fetchQv = async (usr_correo) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/usuarios/qv/${encodeURIComponent(usr_correo)}`;
      const response = await axios.get(endpoint);

      setQv(response.data.museos.map((museo) => new Museo(museo)));
    } catch (error) {
      console.error("Error al obtener qv:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addQv = async (usr_correo, mus_id) => {
    try {
      const endpoint = `${BACKEND_URL}/api/usuarios/qV`;
      const response = await axios.post(endpoint, { 
        usr_correo,
        mus_id 
      });
      return response.data;
    } catch (error) {
      console.error("Error al agregar a qv:", error);
      throw error;
    }
  };

  const removeQv = async (usr_correo, mus_id) => {
    try {
      const endpoint = `${BACKEND_URL}/api/usuarios/qV`;
      const response = await axios.delete(endpoint, { 
        data: {
          usr_correo,
          mus_id,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar qv:", error);
      throw error;
    } 
  };

  const verificarQv = async (usr_correo, mus_id) => {
    try {
      const endpoint = `${BACKEND_URL}/api/usuarios/qV`;
      const response = await axios.get(endpoint, {
        params: {
          usr_correo,
          mus_id,
        },
      });
      return response.data.isFavorite;
    } catch (error) {
      console.error("Error al verificar qv:", error);
      throw error;
    }
  };

  return {
    qv,
    loading,
    error,
    count,
    fetchQv,
    addQv,
    removeQv,
    verificarQv,
  };
};