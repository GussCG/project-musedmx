import React from "react";
import { useState } from "react";

import MenuFiltroMuseo from "../components/MenuFiltroMuseo";
import { useSearchParams } from "react-router";

import mapaButton from "../assets/icons/mapa-icon.png";
import listButton from "../assets/icons/cartas-icon.png";
import filtrarButton from "../assets/icons/filtrar-icon.png";
import NavBar from "../components/NavBar";
import MuseoCard from "../components/MuseoCard";
import MuseosMapView from "./MuseosMapView";

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

  const abrirMenu = () => {
    setMenuVisible(true);
  };

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
              <img
                src={isMapView ? listButton : mapaButton}
                alt=" Cambiar a vista de mapa"
              />
            </button>
          </div>
          <div className="museos-header-section-right">
            <button
              className="museos-header-section-right-button"
              onClick={abrirMenu}
            >
              <img src={filtrarButton} alt="Filtrar" id="filtrar-button" />
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
            MuseosMostrados.map((museo) => (
              <MuseoCard key={museo.id} museo={museo} />
            ))
          )}
        </section>
      </main>
    </>
  );
}

export default MuseosList;
