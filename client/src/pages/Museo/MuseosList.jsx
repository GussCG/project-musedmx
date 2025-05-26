import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MenuFiltroMuseo from "../../components/Museo/MenuFiltroMuseo";
import { useSearchParams, useLocation } from "react-router";
import MuseoCard from "../../components/Museo/MuseoCard";
import MuseosMapView from "./MuseosMapView";
import MenuSort from "../../components/Other/MenuSort";
import MapIndicaciones from "../../components/Maps/MapIndicaciones";
import { useViewMode } from "../../context/ViewModeProvider";
import Icons from "../../components/Other/IconProvider";
import MuseumSearch from "../../components/Museo/MuseumSearch";
import { TEMATICAS } from "../../constants/catalog";
import ReactPaginate from "react-paginate";
import { useMuseos } from "../../hooks/Museo/useMuseos";
import { useMuseoFilters } from "../../hooks/Museo/useMuseoFilters";
import { useScrollToTop } from "../../hooks/Other/useScrollToTop";
import LoadingIndicator from "../../components/Other/LoadingIndicator";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMuseosPopulares } from "../../hooks/Museo/useMuseosPopulares";

const {
  listButton,
  mapaButton,
  LuArrowUpDown,
  FaFilter,
  FaMap,
  TbCardsFilled,
  FaAngleDoubleUp,
  CgClose,
  IoIosArrowForward,
  IoIosArrowBack,
} = Icons;

function MuseosList({ titulo, tipo }) {
  // Para obtener el input de busqueda
  const [searchParams] = useSearchParams();
  const tituloSearch = `${searchParams.get("search")}`;
  const location = useLocation();
  const isBusquedaRoute = location.pathname.includes("/busqueda");
  const tituloBusqueda = isBusquedaRoute
    ? `Resultados de búsqueda: ${tituloSearch}`
    : titulo;

  // Vista
  const { isMapView, setIsMapView } = useViewMode();

  // Filtros
  const { filters, sortBy, setSortBy, applyFilters, removeFilter } =
    useMuseoFilters();

  const handleFilterRemove = (type, value) => {
    removeFilter(type, value);
  };

  // Fetch de museos
  const isPopulares = tipo === "3";

  const museosParams = useMemo(
    () => ({
      tipo,
      searchQuery: isPopulares ? null : tituloSearch,
      filters: isPopulares ? { tipos: [], alcaldias: [] } : filters,
      sortBy: isPopulares ? null : sortBy,
      isMapView: isPopulares ? false : isMapView,
    }),
    [tipo, tituloSearch, filters, sortBy, isMapView, isPopulares]
  );

  const {
    museos: museosNormales,
    pagination,
    fetchMuseos,
    loading: isLoadingNormales,
  } = useMuseos(museosParams);

  const {
    museos: museosPopulares,
    loading: isLoadingPopulares,
    error: errorPopulares,
  } = useMuseosPopulares({
    top_n: 10,
  });

  // Decide qué datos usar basado en el tipo
  const museos = isPopulares ? museosPopulares : museosNormales;
  const isLoading = isPopulares ? isLoadingPopulares : isLoadingNormales;

  // MenuSort
  const [isSortedMenuOpen, setIsSortedMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
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

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    fetchMuseos(newPage);
  };

  const abrirMenu = (event) => {
    event?.stopPropagation();
    setMenuVisible(true);
  };

  useEffect(() => {
    if (tipo === "2") {
      setIsMapView(true);
    }
  }, [tipo, setIsMapView]);

  useEffect(() => {}, [tipo, tituloSearch, filters, sortBy, isMapView]);

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
        onFilterApply={applyFilters}
        onFilterRemove={removeFilter}
        currentFilters={filters}
      />
      {isMapView ? <MapIndicaciones /> : null}
      <main id="vermuseos-main">
        <section className="museos-header-section">
          <div className="museos-header-section-left">
            <div className="museos-header-section-left-tittles">
              <h1>{tituloBusqueda}</h1>
              <p>
                Museos mostrados: {isPopulares ? 10 : pagination.totalItems}
              </p>
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
            {isMapView || isPopulares ? null : (
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

            {!isPopulares && (
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
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <MuseosMapView
                titulo={titulo}
                MuseosMostrados={museos}
                tipo={tipo}
                isMapView={isMapView}
                loading={isLoading}
              />
            )}
          </section>
        ) : (
          <section className="museos-container-section">
            <>
              <div className="museos-container">
                {museos.length === 0 ? (
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
                      loading={isLoading}
                    />
                  ))
                )}
              </div>
            </>

            {pagination.totalPages > 1 && !isPopulares && (
              <ReactPaginate
                breakLabel="..."
                breakClassName="break"
                nextLabel={<IoIosArrowForward />}
                onPageChange={(event) => {
                  handlePageClick(event);
                  scrollToTop();
                }}
                pageRangeDisplayed={1}
                marginPagesDisplayed={1}
                pageCount={pagination.totalPages}
                previousLabel={<IoIosArrowBack />}
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="previous"
                previousLinkClassName="previous"
                nextClassName="next"
                nextLinkClassName="next"
                breakLinkClassName="page-link"
                activeClassName="active"
                forcePage={pagination.currentPage}
              />
            )}
          </section>
        )}
      </main>
    </motion.div>
  );
}

export default MuseosList;
