import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useMuseoHorarios(museoId) {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHorarios = async (id) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/horarios/${id}`;
      const response = await axios.get(endpoint);
      // console.log("Horarios response:", response.data);
      setHorarios(response.data.horarios);
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
      setLoading(false);
    }
  }, [museoId]);

  return {
    horarios,
    loading,
    error,
    fetchHorarios,
    setHorarios,
  };
}
