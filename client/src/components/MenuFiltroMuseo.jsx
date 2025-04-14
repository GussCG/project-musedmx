import React, { useState, useCallback } from "react";
import axios from "axios";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import Icons from "./IconProvider";
const { CgClose, IoIosArrowDown } = Icons;

import { useTheme } from "../context/ThemeProvider";
import { id } from "react-day-picker/locale";

function MenuFiltroMuseo({ menuVisible, setMenuVisible, onFilterApply }) {
  const { isDarkMode } = useTheme();

  const trackStyle = [{ backgroundColor: isDarkMode ? "#fff" : "#000" }];

  const handleStyle = [
    {
      backgroundColor: isDarkMode ? "#fff" : "#000",
      borderColor: isDarkMode ? "#fff" : "#000",
    },
    {
      backgroundColor: isDarkMode ? "#fff" : "#000",
      borderColor: isDarkMode ? "#fff" : "#000",
    },
  ];

  const TEMATICAS = [
    {
      id: 1,
      tematica: "Antropología",
    },
    { id: 2, tematica: "Arte" },
    { id: 3, tematica: "Arte Alternativo" },
    { id: 4, tematica: "Arqueología" },
    { id: 5, tematica: "Ciencia y Tecnología" },
    { id: 6, tematica: "Especializado" },
    { id: 7, tematica: "Historia" },
    { id: 8, tematica: "Otro" },
  ];

  const ALCALDIAS = ["Benito Juárez", "Cuauhtémoc", "Miguel Hidalgo"];

  const cerrarMenu = () => {
    setMenuVisible(false);
    setOpenDropdown(null);
  };

  // Para los dropdowns de tematica y alcaldia
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleFilter = (filter) => {
    if (openDropdown === filter) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(filter);
    }
  };

  // Para el range de precios
  const [range, setRange] = useState([0, 100]);

  const handleRangeChange = (value) => {
    setRange(value);
  };

  // Para los estados de los checkboxes
  const [selectedFilters, setSelectedFilters] = useState({
    tematica: {},
    alcaldia: {},
  });
  const [museosCount, setMuseosCount] = useState(0);

  const toggleCheckbox = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [value]: !prev[category][value],
      },
    }));
  };

  // Codigo para filtrar museos
  const handleFiltrar = async () => {
    try {
      const filtros = {
        tipos: Object.keys(selectedFilters.tematica)
          .filter((key) => selectedFilters.tematica[key])
          .map((key) => TEMATICAS.find((t) => t.tematica === key)?.id) // Obtener el id de la tematica
          .filter((id) => id !== null),
        alcaldias: Object.keys(selectedFilters.alcaldia).filter(
          (key) => selectedFilters.alcaldia[key]
        ),
        precioMin: range[0],
        precioMax: range[1],
      };

      onFilterApply(filtros);
      cerrarMenu();
    } catch (error) {
      console.error("Error al aplicar los filtros:", error);
      setMuseosCount(0);
    }
  };

  const handleBorrar = useCallback(() => {
    // Resetear todos los filtros
    const resetFilters = {
      tipos: [],
      alcaldias: [],
      precioMin: 0,
      precioMax: 100,
    };

    // Actualizar estados locales
    setRange([0, 100]);
    setSelectedFilters({ tematica: {}, alcaldia: {} });

    // Aplicar reset de filtros
    onFilterApply(resetFilters);

    // Cerrar el menú automáticamente
    setMenuVisible(false);
    setOpenDropdown(null);
  }, [onFilterApply]);

  return (
    <>
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
            <h2>Temática</h2>
            <button
              className="filtro-menu-filter-button"
              onClick={() => toggleFilter("tematica")}
            >
              <IoIosArrowDown
                className={openDropdown === "tematica" ? "rotado" : "regresado"}
              />
            </button>
          </div>
          <div
            className={`filtro-menu-filter-body ${
              openDropdown === "tematica" ? "open" : ""
            }`}
            id="tematica"
          >
            {TEMATICAS.map((tematica) => (
              <div key={tematica.id} className="filtro-menu-filter-body-item">
                <label htmlFor={`tematica-${tematica.id}`}>
                  {tematica.tematica}
                </label>
                <label className="filtro-chk">
                  <input
                    type="checkbox"
                    name="tematica-filter"
                    id={`tematica-${tematica.id}`}
                    checked={
                      selectedFilters.tematica[tematica.tematica] || false
                    }
                    onChange={() =>
                      toggleCheckbox("tematica", tematica.tematica)
                    }
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="filtro-menu-filter">
          <div className="filtro-menu-filter-header">
            <h2>Alcaldía</h2>
            <button
              className="filtro-menu-filter-button"
              onClick={() => toggleFilter("alcaldia")}
            >
              <IoIosArrowDown
                className={openDropdown === "alcaldia" ? "rotado" : "regresado"}
              />
            </button>
          </div>
          <div
            className={`filtro-menu-filter-body ${
              openDropdown === "alcaldia" ? "open" : ""
            }`}
            id="alcaldia"
          >
            {ALCALDIAS.map((alcaldia, index) => (
              <div key={index} className="filtro-menu-filter-body-item">
                <label htmlFor={`alcaldia-${index + 1}`}>{alcaldia}</label>
                <label className="filtro-chk">
                  <input
                    type="checkbox"
                    name="alcaldia-filter"
                    id={`alcaldia-${index + 1}`}
                    checked={selectedFilters.alcaldia[alcaldia] || false}
                    onChange={() => toggleCheckbox("alcaldia", alcaldia)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="filtro-menu-rango-precios">
          <label htmlFor="rango-costo">
            Rango de Precios (MX): ${range[0]} - ${range[1]}
          </label>
          <div className="slider-precio-container">
            <Slider
              range
              min={0}
              max={100}
              step={5}
              value={range}
              onChange={handleRangeChange}
              handleStyle={handleStyle}
              trackStyle={trackStyle}
              railStyle={{
                backgroundColor: isDarkMode ? "#4B4B4B" : "#d9d9d9",
              }}
            />
          </div>
        </div> */}
        {/* <p id="nmuseos">
          Mostrando{" "}
          <output>
            <b>{museosCount}</b>
          </output>{" "}
          museos
        </p> */}
        <div className="filtro-menu-botones">
          <button
            className="filtro-menu-boton gray"
            id="borrar-button"
            onClick={handleBorrar}
          >
            Borrar
          </button>
          <button className="filtro-menu-boton black" onClick={handleFiltrar}>
            Listo
          </button>
        </div>
      </div>
    </>
  );
}

export default MenuFiltroMuseo;
