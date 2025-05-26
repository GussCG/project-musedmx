import { useState } from "react";
import Icons from "../Other/IconProvider";
const { FaStar, CgClose } = Icons;

function MenuFiltroResena({
  menuVisible,
  setMenuVisible,
  setFiltros,
  setPagina,
}) {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [tieneFotos, setTieneFotos] = useState(false);
  const [radioFecha, setRadioFecha] = useState("");

  const handleBorrar = () => {
    // Limpiar estados internos
    setRating(null);
    setRadioFecha("");
    setTieneFotos(false);

    // Aplicar filtros vacíos para mostrar sin filtro
    setFiltros({});

    // Reiniciar página a la 1
    setPagina(1);

    // Cerrar menú
    setMenuVisible(false);
  };

  const handleFiltrar = () => {
    const filtrosAplicados = {};
    if (rating !== null) filtrosAplicados.rating = rating;
    if (tieneFotos) filtrosAplicados.tieneFotos = tieneFotos;
    if (radioFecha !== "") filtrosAplicados.fecha = radioFecha;

    setFiltros(filtrosAplicados);
    setPagina(1); // Reiniciar a la primera página al aplicar filtros
    setMenuVisible(false);
  };

  const cerrarMenu = () => {
    setMenuVisible(false);
    handleBorrar();
  };

  return (
    <div>
      <div
        className={`bg-opaco ${menuVisible ? "open" : ""}`}
        id="fondo-opaco"
      ></div>
      <div
        className={`filtro-menu-container ${menuVisible ? "open" : ""}`}
        id="filtro-menu"
      >
        <div className="filtro-menu-header">
          <button className="filtro-menu-close-button" onClick={cerrarMenu}>
            <CgClose />
          </button>
          <h1>Filtro</h1>
        </div>
        <div className="filtro-menu-filter">
          <div className="filtro-menu-filter-header">
            <h2>Calificación</h2>
          </div>
          <div className="filtro-menu-filter-body open" id="calificacion-menu">
            <div className="stars-rate-container">
              {[...Array(5)].map((star, index) => {
                const currentRate = index + 1;
                return (
                  <label className="stars-rate" key={currentRate}>
                    <input
                      type="radio"
                      name="rating"
                      value={currentRate}
                      onClick={() => setRating(currentRate)}
                    />
                    <FaStar
                      className="stars-checkbox-span"
                      size={50}
                      color={
                        currentRate <= (hover || rating) ? "#000" : "#d9d9d9"
                      }
                      onMouseEnter={() => setHover(currentRate)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="filtro-menu-filter">
          <div className="filtro-menu-filter-header">
            <h2>Fecha</h2>
          </div>
          <div className="filtro-menu-filter-body open" id="fecha-menu">
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="fecha-1">
                Ordenar más reciente a más antiguo
              </label>
              <label className="filtro-rad">
                <input
                  type="radio"
                  name="fecha-filter"
                  id="fecha-1"
                  value="DESC"
                  checked={radioFecha === "DESC"}
                  onChange={(e) => setRadioFecha(e.target.value)}
                />
                <span className="radio-filter-span"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="fecha-2">
                Ordenar más antiguo a más reciente
              </label>
              <label className="filtro-rad">
                <input
                  type="radio"
                  name="fecha-filter"
                  id="fecha-2"
                  value="ASC"
                  checked={radioFecha === "ASC"}
                  onChange={(e) => setRadioFecha(e.target.value)}
                />
                <span className="radio-filter-span"></span>
              </label>
            </div>
          </div>
        </div>
        <div className="filtro-menu-filter">
          <div className="filtro-menu-filter-header">
            <h2>¿Tiene Fotos?</h2>
            <div className="switch-button">
              <input
                type="checkbox"
                name="fotos-filter"
                id="switch-label"
                className="switch-button__checkbox"
                checked={tieneFotos}
                onChange={() => setTieneFotos(!tieneFotos)}
              />
              <label htmlFor="switch-label" className="switch-button__label">
                <span className="switch-button-slider"></span>
              </label>
              <div className="switch-button-span-container">
                <span>Sí</span>
                <span>No</span>
              </div>
            </div>
          </div>
        </div>
        <div className="filtro-menu-botones">
          <button
            className="filtro-menu-boton gray"
            id="limpiar-button"
            onClick={handleBorrar}
          >
            Borrar
          </button>
          <button className="filtro-menu-boton black" onClick={handleFiltrar}>
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuFiltroResena;
