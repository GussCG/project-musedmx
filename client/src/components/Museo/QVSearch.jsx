import { useState, useEffect } from "react";
import SearchBar from "../Other/SearchBar";
import axios from "axios";

function QVSearch() {
  const [museumSuggestions, setMuseumSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState(null);

  const handleWheel = (e) => {
    if (swiperRef) e.stopPropagation(); // Evitar que el evento de desplazamiento se propague al Swiper
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const museosResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/museos/nombres`
        );
        setMuseumSuggestions(museosResponse.data.museos || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "Error al cargar los museos. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Logica para pasar al back
  // Por el momento solo se hace un console log
  const registerMuseum = async (museumId) => {
    try {
      //   await axios.post(``, {
      //     mus_id: museumId,
      //   });
      setSelectedMuseum(museumId);
      console.log("Museo registrado:", museumId);
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
      <SearchBar
        placeholder="Busca un museo para agregarlo"
        suggestions={museumSuggestions}
        onSearch={handleSearch}
        onSuggestionSelect={handleSuggestionSelect}
        showNoResults={searchPerformed && museumSuggestions.length === 0}
      />
    </div>
  );
}

export default QVSearch;
