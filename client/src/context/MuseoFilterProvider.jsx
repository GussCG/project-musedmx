import { createContext, useContext, useState, useEffect } from "react";

const MuseoFilterContext = createContext();

export function MuseoFilterProvider({ children }) {
  const [filters, setFilters] = useState(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("museoFilters")
        : null;
    return saved ? JSON.parse(saved) : { tipos: [], alcaldias: [] };
  });

  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("museoFilters", JSON.stringify(filters));
    }
  }, [filters]);

  const applyFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const removeFilter = (type, value) => {
    const key = type === "tipo" ? "tipos" : "alcaldias";
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item !== value),
    }));
  };

  return (
    <MuseoFilterContext.Provider
      value={{ filters, sortBy, setSortBy, applyFilters, removeFilter }}
    >
      {children}
    </MuseoFilterContext.Provider>
  );
}

// Exporta el hook para usar el contexto
export function useMuseoFilters() {
  const context = useContext(MuseoFilterContext);
  if (!context) {
    throw new Error(
      "useMuseoFilters debe usarse dentro de un MuseoFiltersProvider"
    );
  }
  return context;
}
