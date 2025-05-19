import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useRespuestasTotales({ encuestaId, museoId }) {
  const [respuestas, setRespuestas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRespuestasTotales = async () => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/encuesta/respuestas/${encuestaId}/${museoId}`;
      const response = await axios.get(endpoint);
      setRespuestas(response.data.preguntas);
      setServicios(response.data.servicios);
    } catch (error) {
      console.error("Error fetching respuestas totales:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRespuestasTotales();
  }, [encuestaId, museoId]);

  return {
    respuestas,
    servicios,
    loading,
    error,
  };
}
