import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useMuseoHorarios(museoId) {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cerrado, setCerrado] = useState(false);

  const fetchHorarios = async (id) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/horarios/${id}`;
      const response = await axios.get(endpoint);

      const fetchedHorarios = response.data.horarios;
      setHorarios(fetchedHorarios);

      const estaCerrado =
        fetchedHorarios.length > 0 &&
        fetchedHorarios.every(
          (h) => h.mh_hora_inicio === "00:00:00" && h.mh_hora_fin === "00:00:00"
        );
      setCerrado(estaCerrado);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching horarios:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (museoId) {
      fetchHorarios(museoId);
    } else {
      setHorarios([]);
      setCerrado(false);
      setLoading(false);
    }
  }, [museoId]);

  return {
    horarios,
    loading,
    error,
    cerrado,
    fetchHorarios,
    setHorarios,
  };
}
