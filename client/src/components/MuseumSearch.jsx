import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import SearchBar from "./SearchBar";

function MuseumSearch({ swiperRef = null }) {
  const navigate = useNavigate();
  const [museumSuggestions, setMuseumSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleWheel = (e) => {
    if (swiperRef) e.stopPropagation(); // Evitar que el evento de desplazamiento se propague al Swiper
  };

  // Sugerencias de museos (nombres de museos)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const museosResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/museos/nombres`
        );
        setMuseumSuggestions(museosResponse.data.museos);
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

  const handleSearch = (searchTerm) => {
    navigate(`/Museos/busqueda?search=${encodeURIComponent(searchTerm)}`);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>; // Mostrar error si hay uno

  return (
    <motion.div
      className="nav-bar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => {
        if (swiperRef?.current) {
          swiperRef.current.swiper.mousewheel.disable(); // Deshabilitar el desplazamiento del mouse en el Swiper
        }
      }}
      onMouseLeave={() => {
        if (swiperRef?.current) {
          swiperRef.current.swiper.mousewheel.enable(); // Habilitar el desplazamiento del mouse en el Swiper
        }
      }}
      onWheel={handleWheel} // Manejar el evento de desplazamiento
      onTouchStart={(e) => {
        e.stopPropagation();
      }} // Evitar que el evento de toque se propague al Swiper
      style={{
        overscrollBehavior: "contain",
      }}
    >
      <SearchBar
        placeholder="Buscar museos..."
        suggestions={museumSuggestions}
        onSearch={handleSearch}
        onSuggestionSelect={handleSearch}
      />
    </motion.div>
  );
}

export default MuseumSearch;
