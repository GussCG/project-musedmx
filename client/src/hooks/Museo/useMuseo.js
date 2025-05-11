import { useState, useEffect } from "react";
import axios from "axios";
import Museo from "../../models/Museo/Museo";

import { BACKEND_URL } from "../../constants/api";

export function useMuseo(museoId) {
  const [museo, setMuseo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMuseo = async (id) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/${id}`;
      const response = await axios.get(endpoint);

      const museoData = new Museo(response.data.museo[0]);
      setMuseo(museoData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching museo:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (museoId) {
      fetchMuseo(museoId);
    } else {
      setMuseo(new Museo({}));
      setLoading(false);
    }
  }, [museoId]);

  return {
    museo,
    loading,
    error,
    fetchMuseo,
    setMuseo,
  };
}
