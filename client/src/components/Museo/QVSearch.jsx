import { useState, useEffect, useMemo } from "react";
import SearchBar from "../Other/SearchBar";
import axios from "axios";
import { useMuseos } from "../../hooks/Museo/useMuseos";
import Skeleton from "react-loading-skeleton";

function QVSearch({ correo, agregarQV, refreshQV, museosQV }) {
  const [museumSuggestions, setMuseumSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState(null);

  const { getMuseosNombres } = useMuseos({
    tipo: null,
    searchQuery: null,
    isMapView: false,
    filters: { tipos: [], alcaldias: [] },
    sortBy: null,
  });

  const suggestionNames = useMemo(() => {
    return museumSuggestions.map((museo) => museo.mus_nombre);
  }, [museumSuggestions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMuseosNombres();
        setMuseumSuggestions(response);
      } catch (error) {
        console.error("Error fetching museum suggestions:", error);
        setError("Error al cargar las sugerencias de museos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getMuseosNombres]);

  const registerMuseum = async (museumId) => {
    try {
      // Verificar si ya está en la lista
      const yaAgregado = museosQV.some((m) => {
        return m.id === museumId;
      });
      if (yaAgregado) {
        console.log("Ya agregado");
        return;
      }

      await agregarQV(correo, museumId);
      setSelectedMuseum(museumId);
      refreshQV();
    } catch (error) {
      console.error("Error al registrar el museo:", error);
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      setSearchPerformed(true);
      setSelectedMuseum(null);

      if (!museumSuggestions || museumSuggestions.length === 0) return;

      // Buscar museos que coincidan exactamente
      const exactMatch = museumSuggestions.find(
        (m) => m.mus_nombre.toLowerCase() === searchTerm.toLowerCase()
      );

      if (exactMatch) {
        await registerMuseum(exactMatch.mus_id);
      } else {
        // Si no hay coincidencia exacta, buscar similares
        const similarMuseums = museumSuggestions.filter((m) =>
          m.mus_nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (similarMuseums.length === 1) {
          // Si hay solo un resultado similar, registrarlo
          await registerMuseum(similarMuseums[0].mus_id);
        }
      }
    } catch (error) {
      console.error("Error searching museums:", error);
      setError("Error al buscar museos. Inténtalo nuevamente.");
    }
  };

  const handleSuggestionSelect = async (suggestion) => {
    try {
      const museum = museumSuggestions.find((m) => m.mus_nombre === suggestion);
      if (museum) {
        await registerMuseum(museum.mus_id);
      }
    } catch (error) {
      console.error("Error al registrar el museo:", error);
    }
  };

  return (
    <div
      className="nav-bar"
      onTouchStart={(e) => e.stopPropagation()}
      style={{ overscrollBehavior: "contain" }}
    >
      {loading ? (
        <Skeleton wrapper={SearchBar} />
      ) : (
        <SearchBar
          placeholder="Busca un museo para agregarlo"
          suggestions={suggestionNames}
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          showNoResults={searchPerformed && suggestionNames.length === 0}
        />
      )}
    </div>
  );
}

export default QVSearch;
