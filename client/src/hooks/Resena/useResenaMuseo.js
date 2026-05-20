import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/api";

export default function useResenaMuseo({
  museoId,
  filtros = {},
  pagina = 1,
  porPagina = 6,
} = {}) {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [metaData, setMetaData] = useState({
    promedio: 0,
    distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  // Desestructuramos para usar valores primitivos como dependencias
  // Si en el futuro agregas otro filtro, lo agregas aquí
  const { rating } = filtros;

  useEffect(() => {
    if (!museoId) return;

    const controller = new AbortController();

    const fetchResenas = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${BACKEND_URL}/api/resena/museo/${museoId}`,
          {
            // Pasamos solo los valores que el back espera
            params: { rating, pagina, porPagina },
            signal: controller.signal,
          },
        );

        console.log("Respuesta de reseñas:", response);

        const {
          resenas: nuevasResenas,
          total: totalRes,
          totalPages,
          stats,
        } = response.data;

        setResenas((prev) => {
          // Si es la página 1 es un filtro nuevo o inicio, reemplazamos.
          // Si es > 1, es scroll infinito, acumulamos.
          return pagina === 1 ? nuevasResenas : [...prev, ...nuevasResenas];
        });

        setTotal(totalRes);
        setTotalPaginas(totalPages);

        if (stats && pagina === 1) {
          setMetaData(stats);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Error al cargar reseñas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResenas();
    return () => controller.abort();
  }, [museoId, pagina, rating, porPagina]);

  return {
    resenas,
    total,
    totalPaginas,
    loading,
    calificacionPromedio: metaData.promedio,
    calificacionesDistribucion: metaData.distribucion,
    hasMore: pagina < totalPaginas,
  };
}
