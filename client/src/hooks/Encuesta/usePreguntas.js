import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function usePreguntas({ encuestaId } = {}) {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPreguntas = async ({ encuestaId }) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/encuesta/preguntas/${encuestaId}`;
      console.log("Fetching preguntas from:", endpoint);
      const response = await axios.get(endpoint);
      return response.data.preguntas;
    } catch (error) {
      console.error("Error fetching preguntas:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    preguntas,
    loading,
    error,
    fetchPreguntas,
  };
}
