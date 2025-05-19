import { useState, useEffect } from "react";
import axios from "axios";
import usePreguntas from "./usePreguntas";
import useServicios from "./useServicio";

import { BACKEND_URL } from "../../constants/api";
import { use } from "react";

export default function useEncuesta({ encuestaId, museoId, correo, fecha }) {
  const [contestada, setContestada] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    preguntas,
    loading: loadingPreguntas,
    error: errorPreguntas,
  } = usePreguntas({ encuestaId });
  const {
    servicios,
    loading: loadingServicios,
    error: errorServicios,
  } = useServicios();
  const [respuestas, setRespuestas] = useState([]);
  const [respuestasServicios, setRespuestasServicios] = useState([]);

  const fetchEncuesta = async () => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/encuesta/detalle/${encuestaId}/${museoId}/${correo}`;
      const response = await axios.get(endpoint);
      setContestada(response.data.contestada);
      setRespuestas(response.data.preguntas.respuestas);
      setRespuestasServicios(response.data.servicios);
    } catch (error) {
      console.error("Error fetching encuesta:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (encuestaId) {
      fetchEncuesta();
    } else {
      setContestada(false);
      setRespuestas([]);
      setRespuestasServicios([]);
      setLoading(false);
    }
  }, [encuestaId]);

  return {
    contestada,
    loading: loading || loadingPreguntas || loadingServicios,
    error: error || errorPreguntas || errorServicios,
    respuestas,
    respuestasServicios,
  };
}
