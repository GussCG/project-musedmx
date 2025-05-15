import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Museo from "../../models/Museo/Museo";
import { BACKEND_URL } from "../../constants/api";

export const useMuseos = ({
  tipo,
  searchQuery,
  isMapView,
  filters,
  sortBy,
}) => {
  const [museos, setMuseos] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    itemsPerPage: 12,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize filters object to prevent unnecessary changes
  const stableFilters = useMemo(
    () => filters,
    [JSON.stringify(filters.tipos), JSON.stringify(filters.alcaldias)]
  );

  const fetchMuseos = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        // Preparar parámetros
        const params = new URLSearchParams();

        if (searchQuery && searchQuery !== "null")
          params.append("search", searchQuery);
        if (!tipo && tipo) params.append("tipo", tipo);
        if (stableFilters.tipos.length)
          params.append("tipos", stableFilters.tipos.join(","));
        if (stableFilters.alcaldias.length)
          params.append("alcaldias", stableFilters.alcaldias.join(","));
        if (sortBy) params.append("sort", sortBy);

        // Manejo especial para tipo "3" (populares)
        if (tipo === "3") {
          params.append("limit", "10");
          params.append("sort", "best-rating");

          // Solo agregar página si no es MapView
          if (!isMapView) {
            params.append("page", page.toString());
          }
        } else {
          // Comportamiento normal para otros tipos
          if (!isMapView) {
            params.append("limit", "12");
            params.append("page", page.toString());
          }
        }

        params.append("isMapView", isMapView.toString());

        const response = await axios.get(
          `${BACKEND_URL}/api/museos?${params.toString()}`
        );

        setMuseos(response.data.data.items.map((museo) => new Museo(museo)));
        setPagination({
          totalItems: response.data.data.totalItems,
          totalPages: response.data.data.pagination.totalPages,
          currentPage: response.data.data.pagination.currentPage - 1,
          itemsPerPage: response.data.data.pagination.itemsPerPage,
        });
      } catch (error) {
        console.error("Error fetching museos:", error);
        setError(error.message);
        setMuseos([]);
        setPagination({
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          itemsPerPage: 12,
        });
      } finally {
        setLoading(false);
      }
    },
    [tipo, searchQuery, isMapView, stableFilters, sortBy]
  );

  useEffect(() => {
    fetchMuseos(1);
  }, [fetchMuseos]); // Only depend on fetchMuseos which is now stable

  return {
    museos,
    pagination,
    loading,
    error,
    fetchMuseos,
  };
};
