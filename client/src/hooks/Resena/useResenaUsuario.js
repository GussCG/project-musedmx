import { useState } from "react";
import axios from "axios";
import Resenia from "../../models/Usuario/Review";

import { BACKEND_URL } from "../../constants/api";

export const useResenaUsuario = ({ usr_correo } = {}) => {
  const [resenias, setResenias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResenasByCorreo = async (correo) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/resena/usuario/all/${encodedCorreo}`;
      const response = await axios.get(endpoint, {
        withCredentials: true,
      });

      return response.data.resenas;
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Registrar Reseña
  const registrarResena = async (museoId, resenaData) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/resena/usuario/registrar/${museoId}`;
      console.log("Endpoint de registro de reseña:", endpoint);
      const response = await axios.post(endpoint, resenaData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error al registrar reseña:", error);
      throw error;
    }
  };

  // Editar Reseña
  const editarResena = async (resenaId, resenaData) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/resena/usuario/editar/${resenaId}`;
      const response = await axios.post(endpoint, resenaData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Reseña editada:", response.data);
      return response.data;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar Reseña
  const eliminarResena = async (resenaId) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/resena/usuario/delete/${resenaId}`;
      console.log("Endpoint de eliminación:", endpoint);
      const response = await axios.delete(endpoint);
      console.log("Reseña eliminada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar reseña:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarFotoResena = async (resenaId, fotoId) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/resena/usuario/eliminar-foto/${resenaId}/${fotoId}`;
      const response = await axios.delete(endpoint, {
        withCredentials: true,
      });
      console.log("Foto de reseña eliminada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar foto de reseña:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    registrarResena,
    editarResena,
    eliminarResena,
    error,
    loading,
    resenias,
    fetchResenasByCorreo,
    eliminarFotoResena,
  };
};

export default useResenaUsuario;
