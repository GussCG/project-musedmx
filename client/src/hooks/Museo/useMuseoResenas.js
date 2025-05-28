import { useState, useEffect } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../constants/api";

export default function useMuseoResenas(museoId) {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calificacionPromedio, setCalificacionPromedio] = useState(0);
  const [calificacionesDistribucion, setCalificacionesDistribucion] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const fetchResenas = async (id) => {
    try {
      setLoading(true);

      const endpoint = `${BACKEND_URL}/api/museos/resenas/${id}`;
      const response = await axios.get(endpoint);

      const resenasData = response.data.resenas;
      setResenas(resenasData);

      if (resenasData.length > 0) {
        const suma = resenasData.reduce(
          (acc, resena) => acc + resena.res_calif_estrellas,
          0
        );
        const promedio = suma / resenasData.length;
        setCalificacionPromedio(promedio);
      } else {
        setCalificacionPromedio(0);
      }

      // Calcular distribución de estrellas
      const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      resenasData.forEach((r) => {
        const estrellas = parseInt(r.res_calif_estrellas, 10);
        if (distribucion[estrellas] !== undefined) {
          distribucion[estrellas]++;
        }
      });
      setCalificacionesDistribucion(distribucion);
    } catch (error) {
      console.error("Error fetching reseñas:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (museoId) {
      fetchResenas(museoId);
    } else {
      setResenas([]);
      setCalificacionPromedio(0);
      setCalificacionesDistribucion({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      });
      setLoading(false);
    }
  }, [museoId]);

  return {
    resenas,
    loading,
    error,
    calificacionPromedio,
    calificacionesDistribucion,
  };
}
