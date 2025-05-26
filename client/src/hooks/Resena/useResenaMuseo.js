import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/api";

export default function useResenaMuseo({
  museoId,
  filtros = {},
  pagina = 1,
  porPagina = 10,
} = {}) {
  const [resenas, setResenas] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para reseñas completas sin filtro (para promedio y distribución fijos)
  const [resenasCompleto, setResenasCompleto] = useState([]);

  useEffect(() => {
    if (
      !museoId ||
      !Number.isInteger(Number(museoId)) ||
      Number(museoId) <= 0
    ) {
      setResenas([]);
      setResenasCompleto([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchResenasFiltradas = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          ...filtros,
          pagina,
          porPagina,
        };

        const response = await axios.get(
          `${BACKEND_URL}/api/resena/museo/${museoId}`,
          {
            params,
            signal: controller.signal,
          }
        );
        const data = response.data.resenas;
        setResenas(data.resenas || []);
        setTotal(data.total || 0);
        setTotalPaginas(data.totalPages || 0);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchResenasCompletas = async () => {
      try {
        // Aquí NO aplicamos filtros, sólo el museoId
        const response = await axios.get(
          `${BACKEND_URL}/api/resena/museo/${museoId}`,
          {
            params: { pagina: 1, porPagina: 10000 }, // o un número grande para traer todas
            signal: controller.signal,
          }
        );
        const data = response.data.resenas;
        setResenasCompleto(data.resenas || []);
      } catch (err) {
        if (axios.isCancel(err)) return;
      }
    };

    fetchResenasFiltradas();
    fetchResenasCompletas();

    return () => controller.abort();
  }, [
    museoId,
    pagina,
    porPagina,
    filtros.rating,
    filtros.tieneFotos,
    filtros.ordenFecha,
  ]);

  // Promedio calculado solo con resenasCompleto (sin filtro)
  const calificacionPromedio = useMemo(() => {
    if (resenasCompleto.length === 0) return 0;
    const suma = resenasCompleto.reduce(
      (acc, r) => acc + Number(r.res_calif_estrellas || 0),
      0
    );
    return suma / resenasCompleto.length;
  }, [resenasCompleto]);

  // Distribución calculada solo con resenasCompleto (sin filtro)
  const calificacionesDistribucion = useMemo(() => {
    const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    resenasCompleto.forEach(({ res_calif_estrellas }) => {
      const estrellas = parseInt(res_calif_estrellas, 10);
      if (distribucion[estrellas] !== undefined) {
        distribucion[estrellas]++;
      }
    });
    return distribucion;
  }, [resenasCompleto]);

  return {
    resenas,
    calificacionPromedio,
    calificacionesDistribucion,
    total,
    totalPaginas,
    currentPage: pagina,
    loading,
    error,
  };
}
