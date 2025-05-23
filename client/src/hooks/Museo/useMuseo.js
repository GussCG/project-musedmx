import { useState, useEffect } from "react";
import axios from "axios";
import Museo from "../../models/Museo/Museo";

import { BACKEND_URL } from "../../constants/api";

export function useMuseo(museoId) {
  const [museo, setMuseo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMuseo = async (id) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/detalle/${id}`;
      const response = await axios.get(endpoint);

      const museoData = new Museo(response.data.museo);
      setMuseo(museoData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching museo:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registrarMuseo = async (formData) => {
    try {
      setLoading(true);

      const endpoint = `${BACKEND_URL}/api/museos`;
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (err) {
      console.error("Error registering museo:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMuseo = async (museoId, formData) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/museos/editar/${museoId}`;
      const response = await axios.post(endpoint, formData);

      return response.data;
    } catch (err) {
      console.error("Error updating museo:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (museoId) {
      fetchMuseo(museoId);
    } else {
      setMuseo(new Museo({}));
      setLoading(false);
    }
  }, [museoId]);

  return {
    museo,
    loading,
    error,
    fetchMuseo,
    setMuseo,
    registrarMuseo,
    updateMuseo,
  };
}
