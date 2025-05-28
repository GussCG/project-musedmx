import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Museo from "../../models/Museo/Museo";
import { BACKEND_URL } from "../../constants/api";

export const useMuseosCercanos = ({ top_n = 10, museoId }) => {
  const [museos, setMuseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetched = useRef(false);

  const fetchMuseosCercanos = async () => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/cercanos/${museoId}`;
      const response = await axios.get(endpoint, {
        params: { top_n },
      });

      const museosData = response.data.museos.museos.map(
        (museo) => new Museo(museo)
      );
      setMuseos(museosData);
    } catch (error) {
      console.error("Error al obtener los museos cercanos:", error);
      setError(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Simular un retraso de carga
    }
  };

  useEffect(() => {
    if (museoId && !fetched.current) {
      fetched.current = true;
      fetchMuseosCercanos();
    }
  }, [museoId]);

  return {
    museos,
    loading,
    error,
    refetch: fetchMuseosCercanos,
  };
};
