// useMuseosPopulares.js - Versión optimizada
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Museo from "../../models/Museo/Museo";
import { BACKEND_URL } from "../../constants/api";

export const useMuseosPopulares = ({ top_n = 5, enabled }) => {
  const [museos, setMuseos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map()); // Cache para almacenar resultados

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setMuseos([]);
      return;
    }

    // Verificar si ya tenemos los datos en cache
    const cacheKey = `popular-${top_n}`;
    if (cacheRef.current.has(cacheKey)) {
      setMuseos(cacheRef.current.get(cacheKey));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const idsResponse = await axios.get(
          `${BACKEND_URL}/api/museos/populares`,
          { params: { top_n } }
        );

        const ids = idsResponse.data.museos?.map((m) => m.mus_id) || [];

        if (ids.length === 0) {
          setMuseos([]);
          return;
        }

        // Verificar qué IDs ya tenemos en cache
        const newIds = ids.filter(
          (id) => !cacheRef.current.has(`detail-${id}`)
        );
        const cachedMuseos = ids
          .filter((id) => cacheRef.current.has(`detail-${id}`))
          .map((id) => cacheRef.current.get(`detail-${id}`));

        // Solo hacer fetch de los museos que no están en cache
        const museosPromises = newIds.map((id) =>
          axios
            .get(`${BACKEND_URL}/api/museos/detalle/${id}`)
            .then((res) => {
              try {
                const museoInstance = new Museo(res.data?.museo[0]);
                if (museoInstance) {
                  cacheRef.current.set(`detail-${id}`, museoInstance);
                }
                return museoInstance || null;
              } catch (error) {
                console.error(
                  `Error al crear instancia de Museo ${id}:`,
                  error
                );
                return null;
              }
            })
            .catch((err) => {
              console.error(`Error cargando museo ${id}:`, err);
              return null;
            })
        );

        const newMuseos = (await Promise.all(museosPromises)).filter(Boolean);
        const allMuseos = [...cachedMuseos, ...newMuseos].slice(0, top_n);

        // Almacenar en cache el resultado completo
        cacheRef.current.set(cacheKey, allMuseos);
        setMuseos(allMuseos);
      } catch (err) {
        console.error("Error general al obtener museos populares:", err);
        setError(err);
        setMuseos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [top_n, enabled]); // Dependencias del efecto

  return {
    museosPopulares: museos,
    loading,
    error,
    refetch: () => {
      cacheRef.current.clear(); // Limpiar cache al forzar recarga
      setMuseos([]);
    },
  };
};
