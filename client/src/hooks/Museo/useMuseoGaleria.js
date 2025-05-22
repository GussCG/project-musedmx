import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useMuseoGaleria(museoId, limit) {
  const [galeria, setGaleria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateGaleria = (newGaleria) => {
    try {
      const endpoint = `${BACKEND_URL}/api/museos/galeria/update/${museoId}`;
      const response = axios.put(endpoint, {
        galeria: newGaleria,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating galeria:", error);
      setError(error);
    }
  };

  const uploadImages = async (files) => {
    try {
      const endpoint = `${BACKEND_URL}/api/museos/galeria/upload/${museoId}`;
      const response = await axios.post(endpoint, files, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      setError(error);
    }
  };

  const fetchGaleria = async (id) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/galeria/${id}`;
      const response = await axios.get(endpoint, {
        params: { limit },
      });

      setGaleria(response.data.galeria);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching galeria:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (museoId) {
      fetchGaleria(museoId);
    } else {
      setGaleria([]);
      setLoading(false);
    }
  }, [museoId]);

  return {
    galeria,
    loading,
    error,
    fetchGaleria,
    uploadImages,
    updateGaleria,
  };
}
