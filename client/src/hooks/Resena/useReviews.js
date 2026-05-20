import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/api";

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  const fetchReviews = async (currentPage) => {
    try {
      setLoading(true);
      // Enviamos la página como query param
      const endpoint = `${BACKEND_URL}/api/resena?page=${currentPage}`;
      const response = await axios.get(endpoint, { withCredentials: true });

      if (response.data.success) {
        setReviews(response.data.resenas);
      }
    } catch (err) {
      setError(err);
      console.error("Error al obtener reseñas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page >= 0 && page < 5) {
      fetchReviews(page);
    }
  }, [page]);

  return {
    reviews,
    loading,
    error,
    page,
    setPage,
    refresh: () => fetchReviews(page),
  };
};
