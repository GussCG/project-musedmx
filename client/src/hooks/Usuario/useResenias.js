import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Review from "../../models/Usuario/Review";
import { BACKEND_URL } from "../../constants/api";

export const useResenias = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resenias, setResenias] = useState([]);

  // Obtener todas las reseñas
  const fetchResenias = async () => {
    try {
      setLoading(true);      
      const endpoint = `${BACKEND_URL}/api/resenias`;
      const response = await axios.get(endpoint);

      setResenias(response.data.data.items.map((item) => new Review(item)));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching resenias:", error);
      setError(error);
      setResenias([]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    fetchResenias, 
    error, 
    loading, 
    resenias 
  };

}