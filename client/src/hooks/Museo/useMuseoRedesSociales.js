import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useMuseoRedesSociales(museoId) {
  const [redesSociales, setRedesSociales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRedesSociales = async (id) => {
    try {
      setLoading(true);

      const endpoint = `${BACKEND_URL}/api/museos/redes/${id}`;
      const response = await axios.get(endpoint);

      setRedesSociales(response.data.redes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching redes sociales:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (museoId) {
      fetchRedesSociales(museoId);
    } else {
      setRedesSociales([]);
      setLoading(false);
    }
  }, [museoId]);

  return {
    redesSociales,
    loading,
    error,
  };
}
