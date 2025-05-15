import { useState } from "react";

export const useMuseoFilters = () => {
  const [filters, setFilters] = useState({ tipos: [], alcaldias: [] });
  const [sortBy, setSortBy] = useState(null);

  const applyFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const removeFilter = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type === "tipo" ? "tipos" : "alcaldias"]: prev[
        type === "tipo" ? "tipos" : "alcaldias"
      ].filter((item) => item !== value),
    }));
  };

  return {
    filters,
    sortBy,
    setSortBy,
    applyFilters,
    removeFilter,
  };
};
