import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Museo from "../../models/Museo/Museo";
import { BACKEND_URL } from "../../constants/api";

export const useMuseosSugeridos = ({ top_n = 10, correo }) => {
  const [museos, setMuseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetched = useRef(false);

  const fetchMuseosSugeridos = async () => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/museos/sugeridos/${encodedCorreo}`;
      const response = await axios.get(endpoint, {
        params: { top_n },
      });
      const museosData = response.data.museos.museos.map(
        (museo) => new Museo(museo)
      );
      setMuseos(museosData);
    } catch (error) {
      console.error("Error al obtener los museos sugeridos:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (correo && !fetched.current) {
      fetched.current = true;
      fetchMuseosSugeridos();
    }
  }, [correo]);

  return {
    museos,
    loading,
    error,
    refetch: fetchMuseosSugeridos,
  };
};
