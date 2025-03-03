import React, { use } from "react";
import { useState, useEffect, useRef } from "react";

import MenuFiltroMuseo from "../../components/MenuFiltroMuseo";
import { useSearchParams } from "react-router";

import NavBar from "../../components/NavBar";
import MuseoCard from "../../components/MuseoCard";
import MuseosMapView from "./MuseosMapView";
import MenuSort from "../../components/MenuSort";

import Icons from "../../components/IconProvider";
const {
  listButton,
  mapaButton,
  LuArrowUpDown,
  FaFilter,
  FaMap,
  TbCardsFilled,
} = Icons;

function MuseosList({ titulo, MuseosMostrados, tipo }) {
  // Para obtener el input de busqueda
  const [searchParams] = useSearchParams();
  let tituloBusqueda = `${searchParams.get("search")}`;

  if (tituloBusqueda === "null") {
    tituloBusqueda = titulo;
  }

  // Para obtener los museos del backend
  const [museos, setMuseos] = useState(MuseosMostrados);
  // Para cambiar la vista entre lista y mapa
  const [isMapView, setIsMapView] = useState(false);
  // Estado para controlar la visibilidad del menu de filtro
  const [menuVisible, setMenuVisible] = useState(false);

  const abrirMenu = (event) => {
    event?.stopPropagation();
    setMenuVisible(true);
  };

  // MenuSort
  const [sortBy, setSortBy] = useState("");
  const [isSortedMenuOpen, setIsSortedMenuOpen] = useState(false);
  const menuSortRef = useRef(null);
  const menuSortButtonRef = useRef(null);

  const toggleSortedMenu = (event) => {
    event?.stopPropagation();
    setIsSortedMenuOpen((prev) => !prev);
  };

  const sortedMuseos = [...museos].sort((a, b) => {
    if (sortBy === "name") {
      return a.nombre.localeCompare(b.nombre);
    } else if (sortBy === "rating") {
      return b.calificacion - a.calificacion;
    } else if (sortBy === "distance") {
      return a.distancia - b.distancia;
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
    <>
      <NavBar />
      <MenuFiltroMuseo
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
      />
      <main id="vermuseos-main">
        <section className="museos-header-section">
          <div className="museos-header-section-left">
            <h1>{tituloBusqueda}</h1>
            <button onClick={() => setIsMapView(!isMapView)}>
              {isMapView ? <TbCardsFilled /> : <FaMap />}
            </button>
          </div>
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
              {/* <img src={filtrarButton} alt="Filtrar" id="filtrar-button" /> */}
            </button>
          </div>
        </section>
        <section className="museos-container-section">
          {isMapView ? (
            <MuseosMapView
              titulo={titulo}
              MuseosMostrados={MuseosMostrados}
              tipo={tipo}
            />
          ) : (
            sortedMuseos.map((museo) => (
              <MuseoCard key={museo.id} museo={museo} />
            ))
          )}
        </section>
      </main>
    </>
  );
}

export default MuseosList;
