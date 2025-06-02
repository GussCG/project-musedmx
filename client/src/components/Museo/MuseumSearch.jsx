import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "../Other/SearchBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMuseos } from "../../hooks/Museo/useMuseos";

function MuseumSearch({ swiperRef = null }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [museumSuggestions, setMuseumSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getMuseosNombres } = useMuseos({
    tipo: null,
    searchQuery: null,
    isMapView: false,
    filters: { tipos: [], alcaldias: [] },
    sortBy: null,
  });

  const handleSearch = useCallback(
    (searchTerm) => {
      navigate(`/Museos/busqueda?search=${encodeURIComponent(searchTerm)}`);
    },
    [navigate]
  );

  // Memoiza las sugerencias
  const suggestionNames = useMemo(() => {
    return museumSuggestions.map((museo) => museo.mus_nombre);
  }, [museumSuggestions]);

  const handleWheel = (e) => {
    if (swiperRef) e.stopPropagation();
  };

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

  return (
    <motion.div
      className="nav-bar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => {
        if (swiperRef?.current) {
          swiperRef.current.swiper.mousewheel.disable();
        }
      }}
      onMouseLeave={() => {
        if (swiperRef?.current) {
          swiperRef.current.swiper.mousewheel.enable();
        }
      }}
      onWheel={handleWheel}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      style={{
        overscrollBehavior: "contain",
      }}
    >
      {loading ? (
        <Skeleton wrapper={SearchBar} />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <SearchBar
          placeholder="Buscar museos..."
          suggestions={suggestionNames}
          onSearch={handleSearch}
          onSuggestionSelect={handleSearch}
          initialValue={searchQuery}
        />
      )}
    </motion.div>
  );
}

export default MuseumSearch;
