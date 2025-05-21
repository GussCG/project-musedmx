import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Museo from "../../models/Museo/Museo";
import { BACKEND_URL } from "../../constants/api";

export const useMuseosSimilares = ({ top_n = 10, museoId }) => {
  const [museos, setMuseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetched = useRef(false);

  const fetchMuseosSimilares = async () => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/similares/${museoId}`;
      const response = await axios.get(endpoint, {
        params: { top_n },
      });
      console.log("Response data:", response.data);
      const museosData = response.data.museos.museos.map(
        (museo) => new Museo(museo)
      );
      setMuseos(museosData);
    } catch (error) {
      console.error("Error al obtener los museos similares:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (museoId && !fetched.current) {
      fetched.current = true;
      fetchMuseosSimilares();
    }
  }, [museoId]);

  return {
    museos,
    loading,
    error,
    refetch: fetchMuseosSimilares,
  };
};
