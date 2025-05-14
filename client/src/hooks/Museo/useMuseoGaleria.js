import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useMuseoGaleria(museoId) {
  const [galeria, setGaleria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGaleria = async (id) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/galeria/${id}`;
      const response = await axios.get(endpoint);

      setGaleria(response.data.galeria);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching galeria:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (museoId) {
      fetchGaleria(museoId);
    } else {
      setGaleria([]);
      setLoading(false);
    }
  }, [museoId]);

  return {
    galeria,
    loading,
    error,
    fetchGaleria,
  };
}
