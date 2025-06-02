import { useState } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useServicio() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/encuesta/servicios`;
      console.log("Fetching servicios from:", endpoint);
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching servicios:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    servicios,
    loading,
    error,
    fetchServicios,
  };
}
