import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useMuseoGaleria(museoId, limit) {
  const [galeria, setGaleria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const uploadImagesGaleria = async (museoId, files) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/galeria/agregar-fotos/${museoId}`;
      const response = await axios.post(endpoint, files, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading images to galeria:", error);
      setError(error);
      throw error; // Re-throw the error for further handling if needed
    } finally {
      setLoading(false);
    }
  };

  const eliminarImagenGaleria = async (museoId, galFotoId) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/galeria/eliminar-foto/${museoId}/${galFotoId}`;
      console.log("Endpoint de eliminación:", endpoint);
      const response = await axios.delete(endpoint, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting image from galeria:", error);
      setError(error);
    } finally {
      setLoading(false);
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
    eliminarImagenGaleria,
    uploadImagesGaleria,
  };
}
