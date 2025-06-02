import { useState, useEffect } from "react";
import axios from "axios";
import usePreguntas from "./usePreguntas";
import useServicios from "./useServicio";
import { BACKEND_URL } from "../../constants/api";

export default function useEncuesta({ encuestaId, museoId, correo } = {}) {
  const [contestada, setContestada] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [respuestasServicios, setRespuestasServicios] = useState([]);

  const fetchEncuesta = async ({ encuestaId, correo, museoId }) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/encuesta/detalle/${encuestaId}/${museoId}/${encodedCorreo}`;
      const response = await axios.get(endpoint);
      setContestada(response.data.contestada);
      setRespuestas(response.data.respuestas);
      setRespuestasServicios(response.data.servicios);
      return response.data;
    } catch (error) {
      console.error("Error fetching encuesta:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const registrarEncuesta = async (
    encuestaId,
    correo,
    museoId,
    encuestaData
  ) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/encuesta/registrar/${encuestaId}/${museoId}/${encodedCorreo}`;
      const response = await axios.post(endpoint, encuestaData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error registering encuesta:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateEncuesta = async (encuestaId, correo, museoId, encuestaData) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/encuesta/actualizar/${encuestaId}/${museoId}/${encodedCorreo}`;
      const response = await axios.post(endpoint, encuestaData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating encuesta:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    contestada,
    respuestas,
    respuestasServicios,
    loading,
    error,
    fetchEncuesta,
    registrarEncuesta,
    updateEncuesta,
  };
}
