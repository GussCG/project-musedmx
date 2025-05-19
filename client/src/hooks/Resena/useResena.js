import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useMuseoResenas(resenaId) {
  const [resena, setResena] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResenas = async (id) => {
    try {
      setLoading(true);

      const endpoint = `${BACKEND_URL}/api/resena/detalle/${id}`;
      const response = await axios.get(endpoint);

      setResena(response.data.resena);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reseñas:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resenaId) {
      fetchResenas(resenaId);
    } else {
      setResena([]);
      setLoading(false);
    }
  }, [resenaId]);

  return {
    resena,
    loading,
    error,
  };
}
