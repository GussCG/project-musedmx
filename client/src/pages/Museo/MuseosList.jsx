import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { ThreeDot } from "react-loading-indicators";

import MenuFiltroMuseo from "../../components/MenuFiltroMuseo";
import { useSearchParams, useLocation } from "react-router";

import NavBar from "../../components/NavBar";
import MuseoCard from "../../components/MuseoCard";
import MuseosMapView from "./MuseosMapView";
import MenuSort from "../../components/MenuSort";
import MapIndicaciones from "../../components/MapIndicaciones";

import Icons from "../../components/IconProvider";
const {
  listButton,
  mapaButton,
  LuArrowUpDown,
  FaFilter,
  FaMap,
  TbCardsFilled,
  FaAngleDoubleUp,
} = Icons;

// BACKEND_URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function MuseosList({ titulo, tipo }) {
  const [showB2Up, setShowB2Up] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowB2Up(true);
      } else {
        setShowB2Up(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Para obtener el input de busqueda
  const [searchParams] = useSearchParams();
  let tituloBusqueda = `${searchParams.get("search")}`;

  const location = useLocation();
  const isBusquedaRoute = location.pathname.includes("/busqueda");

  tituloBusqueda = isBusquedaRoute
    ? `Resultados de búsqueda: ${searchParams.get("search")}`
    : titulo;

  const tituloSearch = searchParams.get("search");

  // Para obtener los museos del backend
  const [museos, setMuseos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMuseos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let endpoint = `${BACKEND_URL}/api/museos`;
        let params = {};

        if (isBusquedaRoute && tituloBusqueda && tituloBusqueda !== "null") {
          endpoint = `${BACKEND_URL}/api/museos/busqueda`;
          params = { search: tituloSearch };
        }

        console.log("endpoint:", endpoint);

        const response = await axios.get(endpoint, {
          params,
          paramsSerializer: {
            indexes: false,
          },
        });

        console.log("response:", response.data);
        setMuseos(response.data.museos);
      } catch (error) {
        setError(error.message);
        setMuseos([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce para evitar hacer demasiadas peticiones al backend
    const timerId = setTimeout(fetchMuseos, 1000);
    return () => clearTimeout(timerId);
  }, [tituloBusqueda, tipo]);

  // Para cambiar la vista entre lista y mapa
  const [isMapView, setIsMapView] = useState(false);
  // Estado para controlar la visibilidad del menu de filtro
  const [menuVisible, setMenuVisible] = useState(false);

  const abrirMenu = (event) => {
    event?.stopPropagation();
    setMenuVisible(true);
  };

  const [museosFiltrados, setMuseosFiltrados] = useState([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);

  const handleFilterApply = async (filtros) => {
    try {
      console.log("Filtros aplicados:", filtros);
      if (!filtros.tipos?.length && !filtros.alcaldias?.length) {
        setMuseosFiltrados([]);
        setFiltrosAplicados(false);
        return;
      }

      // Construir params
      const params = {};

      if (filtros.tipos?.length) params.tematicas = filtros.tipos;
      if (filtros.alcaldias?.length) params.alcaldias = filtros.alcaldias;

      const response = await axios.get(`${BACKEND_URL}/api/museos/filtroPor`, {
        params: params,
        paramsSerializer: {
          indexes: false,
        },
      });

      console.log("response:", response.data);
      setMuseosFiltrados(response.data.museos);
      setFiltrosAplicados(true);
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
      setMuseosFiltrados([]);
      setFiltrosAplicados(false);
    }
  };

  const museosAMostrar = filtrosAplicados ? museosFiltrados : museos;

  // MenuSort
  const [sortBy, setSortBy] = useState("");
  const [isSortedMenuOpen, setIsSortedMenuOpen] = useState(false);
  const menuSortRef = useRef(null);
  const menuSortButtonRef = useRef(null);

  const toggleSortedMenu = (event) => {
    event?.stopPropagation();
    setIsSortedMenuOpen((prev) => !prev);
  };

  const sortedMuseos = [...museosAMostrar].sort((a, b) => {
    if (sortBy === "name") {
      return a.mus_nombre.localeCompare(b.mus_nombre);
    } else if (sortBy === "rating") {
      return b.mus_calificacion - a.mus_calificacion;
    }
    return 0;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuSortRef.current && !menuSortRef.current.contains(event.target)) {
        setIsSortedMenuOpen(false);
      }
    };

    if (isSortedMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortedMenuOpen]);

  useEffect(() => {
    if (menuVisible) {
      setIsSortedMenuOpen(false);
    }
  }, [menuVisible]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavBar />
      <MenuFiltroMuseo
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
        onFilterApply={handleFilterApply}
      />
      {isMapView ? <MapIndicaciones /> : null}
      <main id="vermuseos-main">
        <section className="museos-header-section">
          <div className="museos-header-section-left">
            <h1>{tituloBusqueda}</h1>
            <button onClick={() => setIsMapView(!isMapView)}>
              {isMapView ? <TbCardsFilled /> : <FaMap />}
            </button>
          </div>
          {isMapView ? null : (
            <div className="museos-header-section-right">
              <>
                <button
                  className="museos-header-section-right-button"
                  title="Ordenar"
                  onClick={(event) => toggleSortedMenu(event)}
                  ref={menuSortButtonRef}
                >
                  <p>Ordenar por</p>
                  <LuArrowUpDown />
                </button>
                {isSortedMenuOpen && (
                  <MenuSort
                    ref={menuSortRef}
                    onSortChange={setSortBy}
                    sortBy={sortBy}
                  />
                )}
              </>
              <button
                type="button"
                className="museos-header-section-right-button"
                onClick={(event) => {
                  abrirMenu();
                }}
                title="Filtrar"
              >
                <p>Filtrar</p>
                <FaFilter />
              </button>
            </div>
          )}
        </section>

        {isMapView ? (
          <section className="museos-container-map-section">
            <MuseosMapView
              titulo={titulo}
              MuseosMostrados={museosAMostrar}
              tipo={tipo}
            />
          </section>
        ) : (
          <section className="museos-container-section">
            {isLoading && (
              <div className="loading-indicator">
                <ThreeDot
                  color={["#004879", "#0067ac", "#0085df", "#13a0ff"]}
                />
              </div>
            )}
            {sortedMuseos.length === 0 && !isLoading && (
              <motion.div
                className="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                key="no-results"
                transition={{ duration: 0.5 }}
              >
                <p>No se encontraron museos</p>
                <p>Intenta con otra búsqueda o filtros</p>
              </motion.div>
            )}
            {sortedMuseos.map((museo) => (
              <MuseoCard
                key={museo.mus_id}
                museo={museo}
                initial={{ scale: 1, opacity: 0, y: 20 }}
              />
            ))}
          </section>
        )}
      </main>

      <AnimatePresence>
        {showB2Up && !isMapView && (
          <motion.div
            className="b2up"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2, type: "tween" }}
            key="b2up"
          >
            <button
              className="b2up-button"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <FaAngleDoubleUp />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MuseosList;
