import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants/api";
import Museo from "../../models/Museo/Museo";

export const useQV = ({ correo } = {}) => {
  const [museosQV, setMuseosQV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMuseosQVUsuario = async (correo) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/qv/obtener/${encodedCorreo}`;
      const response = await axios.get(endpoint);

      setMuseosQV(response.data.museos.map((museo) => new Museo(museo)));
    } catch (error) {
      console.error("Error al obtener los museos quiero visitar:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const agregarQV = async (correo, museoId) => {
    try {
      const endpoint = `${BACKEND_URL}/api/qv/agregar`;
      const response = await axios.post(endpoint, { correo, museoId });

      const nuevoMuseo = new Museo(response.data.museo);
      setMuseosQV((prevMuseos) => [nuevoMuseo, ...prevMuseos]);

      return response.data.success;
    } catch (error) {
      console.error("Error al agregar quiero visitar:", error);
      throw error;
    }
  };

  const eliminarQV = async (correo, museoId) => {
    try {
      const endpoint = `${BACKEND_URL}/api/qv/eliminar`;
      const response = await axios.delete(endpoint, {
        data: {
          correo,
          museoId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar quiero visitar:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (correo) {
      fetchMuseosQVUsuario(correo);
    }
  }, [correo]);

  return {
    museosQV,
    loading,
    error,
    fetchMuseosQVUsuario,
    agregarQV,
    eliminarQV,
  };
};
