import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function usePreguntas({ encuestaId }) {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPreguntas = async () => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/encuesta/preguntas/${encuestaId}`;
      const response = await axios.get(endpoint);
      setPreguntas(response.data.preguntas);
    } catch (error) {
      console.error("Error fetching preguntas:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (encuestaId) {
      fetchPreguntas();
    } else {
      setPreguntas([]);
      setLoading(false);
    }
  }, [encuestaId]);

  return {
    preguntas,
    loading,
    error,
  };
}
