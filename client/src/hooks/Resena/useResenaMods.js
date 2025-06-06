import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/api";

export const useResenaMods = () => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllResenas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/resena/mod/all`);
      return response.data.resenas || [];
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResenasByMuseo = async (museoId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/resena/mod/museo/${museoId}`
      );
      return response.data.resenas || [];
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const aprobarResena = async (resenaId, modCorreo) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/resena/mod/aprobar/${resenaId}`;
      const response = await axios.post(
        endpoint,
        { modCorreo },
        {
          withCredentials: true,
        }
      );
      console.log("Aprobación de reseña exitosa:", response.data);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error approving resena:", err);
    } finally {
      setLoading(false);
    }
  };

  const rechazarResena = async (resenaId, motivo, comentario) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/resena/mod/rechazar/${resenaId}`;

      const response = await axios.delete(endpoint, {
        data: { motivo, comentario },
      });

      console.log("Rechazo de reseña exitoso:", response.data);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("Error rechazando reseña:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    resenas,
    loading,
    error,
    fetchAllResenas,
    fetchAllResenasByMuseo,
    setResenas,
    aprobarResena,
    rechazarResena,
  };
};
