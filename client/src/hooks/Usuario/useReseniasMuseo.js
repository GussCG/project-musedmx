import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Review from "../../models/Usuario/Review";
import { BACKEND_URL } from "../../constants/api";

export const useReseniasMuseo = (mus_id) => {
  const [resenia, setResenia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReseniasMuseo = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/resenias/museos/${mus_id}`;
      const response = await axios.get(endpoint);

      setResenia(response.data.data.items.map((item) => new Review(item)));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching resenias:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [mus_id]);

  useEffect(() => {
    fetchReseniasMuseo();
  }, [mus_id, fetchReseniasMuseo]);

  return { 
    resenia, 
    loading, 
    error, 
    fetchReseniasMuseo 
  };
}