import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { ThreeDot } from "react-loading-indicators";

import MenuFiltroMuseo from "../../components/MenuFiltroMuseo";
import { useSearchParams, useLocation } from "react-router";

import MuseoCard from "../../components/MuseoCard";
import MuseosMapView from "./MuseosMapView";
import MenuSort from "../../components/MenuSort";
import MapIndicaciones from "../../components/MapIndicaciones";
import Museo from "../../models/Museo/Museo";

import { useViewMode } from "../../context/ViewModeProvider";

import Icons from "../../components/IconProvider";
import MuseumSearch from "../../components/MuseumSearch";
import { TEMATICAS } from "../../constants/catalog";

const {
  listButton,
  mapaButton,
  LuArrowUpDown,
  FaFilter,
  FaMap,
  TbCardsFilled,
  FaAngleDoubleUp,
  CgClose,
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
  const tituloSearch = `${searchParams.get("search")}`;

  const location = useLocation();
  const isBusquedaRoute = location.pathname.includes("/busqueda");

  const tituloBusqueda = isBusquedaRoute
    ? `Resultados de búsqueda: ${tituloSearch}`
    : titulo;

  // Para obtener los museos del backend
  const [museos, setMuseos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tipos: [],
    alcaldias: [],
  });
  const [sortBy, setSortBy] = useState(null);

  const fetchMuseos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let params = {
        ...(isBusquedaRoute &&
          tituloSearch &&
          tituloSearch !== "null" && { search: tituloSearch }),
        ...(!isBusquedaRoute && tipo && { tipo: tipo }),
        ...(filters?.tipos?.length && { tipos: filters.tipos.join(",") }),
        ...(filters?.alcaldias?.length && {
          alcaldias: filters.alcaldias.join(","),
        }),
        ...(sortBy && { sort: sortBy }),
      };

      const response = await axios.get(`${BACKEND_URL}/api/museos`, {
        params,
      });
      setMuseos(response.data.museos.map((museo) => new Museo(museo)));
    } catch (error) {
      setError(error.message);
      setMuseos([]);
    } finally {
      setIsLoading(false);
    }
  }, [tituloSearch, filters, sortBy, isBusquedaRoute, tipo]);

  useEffect(() => {
    fetchMuseos();
  }, [fetchMuseos]);

  // Para cambiar la vista entre lista y mapa
  const { isMapView, setIsMapView } = useViewMode();
  // Estado para controlar la visibilidad del menu de filtro
  const [menuVisible, setMenuVisible] = useState(false);

  const abrirMenu = (event) => {
    event?.stopPropagation();
    setMenuVisible(true);
  };

  const handleFilterApply = async (filtros) => {
    setFilters({
      tipos: filtros.tipos, // Ya deben ser IDs numéricos
      alcaldias: filtros.alcaldias,
    });
  };

  const handleFilterRemove = async (type, value) => {
    setFilters((prev) => {
      // Asegurarnos de que prev existe y tiene las propiedades necesarias
      const currentFilters = prev || { tipos: [], alcaldias: [] };

      if (type === "tipo") {
        return {
          ...currentFilters,
          tipos: currentFilters.tipos?.filter((t) => t !== value) || [],
        };
      }
      if (type === "alcaldia") {
        return {
          ...currentFilters,
          alcaldias: currentFilters.alcaldias?.filter((a) => a !== value) || [],
        };
      }
      return currentFilters;
    });
  };

  // MenuSort
  const [isSortedMenuOpen, setIsSortedMenuOpen] = useState(false);
  const menuSortRef = useRef(null);
  const menuSortButtonRef = useRef(null);

  const toggleSortedMenu = (event) => {
    event?.stopPropagation();
    setIsSortedMenuOpen((prev) => !prev);
  };

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

  useEffect(() => {
    if (tipo === "2") {
      setIsMapView(true);
    }
  }, [tipo, setIsMapView]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MuseumSearch swiperRef={null} />
      <MenuFiltroMuseo
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
        onFilterApply={handleFilterApply}
        onFilterRemove={handleFilterRemove}
        currentFilters={filters}
      />
      {isMapView ? <MapIndicaciones /> : null}
      <main id="vermuseos-main">
        <section className="museos-header-section">
          <div className="museos-header-section-left">
            <div className="museos-header-section-left-tittles">
              <h1>{tituloBusqueda}</h1>
              <p>Museos mostrados: {museos.length}</p>
            </div>
          </div>

          <div className="museos-header-section-right">
            {tipo !== "2" && (
              <button
                type="button"
                className="museos-header-section-right-button"
                onClick={() => setIsMapView(!isMapView)}
                title={isMapView ? "Ver lista" : "Ver mapa"}
              >
                {isMapView ? (
                  <>
                    <p>Ver lista</p>
                    <TbCardsFilled />
                  </>
                ) : (
                  <>
                    <p>Ver mapa</p>
                    <FaMap />
                  </>
                )}
              </button>
            )}
            {isMapView ? null : (
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
            )}

            {tipo !== "3" && (
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
            )}
          </div>
        </section>

        <AnimatePresence mode="wait">
          {(filters.tipos.length > 0 || filters.alcaldias.length > 0) && (
            <motion.div
              className="filtros-aplicados"
              key="filtros-aplicados"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Filtros aplicados:</h3>
              <div className="filtros-aplicados-list">
                {filters.tipos.map((tipo) => {
                  const tipoId = typeof tipo === "object" ? tipo.id : tipo;
                  const tematica = TEMATICAS[tipoId];
                  return tematica ? (
                    <motion.div
                      key={tipoId}
                      className="filtro-aplicado"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{tematica.nombre}</p>
                      <button
                        type="button"
                        className="filtro-aplicado-remove"
                        onClick={() => handleFilterRemove("tipo", tipoId)}
                      >
                        <CgClose />
                      </button>
                    </motion.div>
                  ) : null;
                })}
                {filters.alcaldias.map((alcaldia) => {
                  return (
                    <div key={alcaldia} className="filtro-aplicado">
                      <p>{alcaldia}</p>
                      <button
                        type="button"
                        className="filtro-aplicado-remove"
                        onClick={() => handleFilterRemove("alcaldia", alcaldia)}
                      >
                        <CgClose />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isMapView ? (
          <section className="museos-container-map-section">
            <MuseosMapView
              titulo={titulo}
              MuseosMostrados={museos}
              tipo={tipo}
              isMapView={isMapView}
            />
          </section>
        ) : (
          <section className="museos-container-section">
            {isLoading && (
              <div className="loading-indicator">
                <ThreeDot width={50} height={50} color="#000" count={3} />
              </div>
            )}
            <div className="museos-container">
              {museos.length === 0 && !isLoading ? (
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
              ) : (
                museos.map((museo) => (
                  <MuseoCard
                    key={museo.id}
                    museo={museo}
                    editMode={false}
                    sliderType={null}
                  />
                ))
              )}
            </div>
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
              title="Regresar al inicio"
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
