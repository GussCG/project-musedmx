import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Museo from "../../models/Museo/Museo";
import { BACKEND_URL } from "../../constants/api";

export const useMuseosPopulares = ({ top_n = 10 }) => {
  const [museos, setMuseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetched = useRef(false);

  const fetchMuseosPopulares = async () => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/populares`;
      const response = await axios.get(endpoint, {
        params: { top_n },
      });

      const museosData = response.data.museos.museos.map(
        (museo) => new Museo(museo)
      );
      setMuseos(museosData);
    } catch (error) {
      console.error("Error al obtener los museos populares:", error);
      setError(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500); // Simular un retraso de carga
    }
  };

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchMuseosPopulares();
    }
  }, []);

  return {
    museos,
    loading,
    error,
    refetch: fetchMuseosPopulares,
  };
};
