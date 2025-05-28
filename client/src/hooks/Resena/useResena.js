import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/api";

export const useResena = ({ resId } = {}) => {
  const [resena, setResena] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResenaByIdResena = async (resId) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/resena/detalle/${resId}`;
      console.log("Fetching resena by ID:", endpoint);
      const response = await axios.get(endpoint, {
        withCredentials: true,
      });
      setResena(response.data.resena[0]);
      return response.data.resena[0];
    } catch (error) {
      setError(error);
      console.error("Error fetching resena by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resId) {
      fetchResenaByIdResena(resId);
    } else {
      setResena(null);
      setLoading(false);
      setError(new Error("res_id is required to fetch resena"));
    }
  }, [resId]);

  return {
    resena,
    loading,
    error,
    fetchResenaByIdResena,
    setResena,
  };
};
