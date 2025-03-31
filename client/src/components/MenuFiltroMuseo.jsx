import React, { useState } from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import Icons from "./IconProvider";
const { CgClose, IoIosArrowDown } = Icons;

import { useTheme } from "../context/ThemeProvider";

function MenuFiltroMuseo({ menuVisible, setMenuVisible }) {
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

  const cerrarMenu = () => {
    setMenuVisible(false);
    setOpenDropdown(null);
    handleBorrar();
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

  const handleBorrar = () => {
    setRange([0, 100]);
    setSelectedFilters({
      tematica: {},
      alcaldia: {},
    });
  };

  // Para los estados de los checkboxes
  const [selectedFilters, setSelectedFilters] = useState({
    tematica: {},
    alcaldia: {},
  });

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
  const handleFiltrar = () => {
    let filtros = {
      tematica: Object.keys(selectedFilters.tematica).filter(
        (key) => selectedFilters.tematica[key]
      ),
      alcaldia: Object.keys(selectedFilters.alcaldia).filter(
        (key) => selectedFilters.alcaldia[key]
      ),
      range,
    };

    console.log(filtros);

    let museosEncontrados = 10;

    // Aqui se hace la llamada al backend para filtrar los museos
    // fetch('api/museos', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(filtros),
    // })
    // .then(res => res.json())
    // .then(data => console.log(data))
    // .catch(err => console.log(err))

    // Aqui se actualiza el numero de museos encontrados
    // museosEncontrados = data.length

    document.getElementById(
      "nmuseos"
    ).innerHTML = `Mostrando <output><b>${museosEncontrados}</b></output> museos`;
  };

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
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="tematica-1">Antropología</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="tematica-filter"
                  id="tematica-1"
                  checked={selectedFilters.tematica["Antropología"] || false}
                  onChange={() => toggleCheckbox("tematica", "Antropología")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="tematica-2">Arte</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="tematica-filter"
                  id="tematica-2"
                  checked={selectedFilters.tematica["Arte"] || false}
                  onChange={() => toggleCheckbox("tematica", "Arte")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="tematica-3">Arte Alternativo</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="tematica-filter"
                  id="tematica-3"
                  checked={
                    selectedFilters.tematica["Arte Alternativo"] || false
                  }
                  onChange={() =>
                    toggleCheckbox("tematica", "Arte Alternativo")
                  }
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="tematica-4">Arqueología</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="tematica-filter"
                  id="tematica-4"
                  checked={selectedFilters.tematica["Arqueología"] || false}
                  onChange={() => toggleCheckbox("tematica", "Arqueología")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="tematica-5">Ciencia y Tecnología</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="tematica-filter"
                  id="tematica-5"
                  checked={
                    selectedFilters.tematica["Ciencia y Tecnología"] || false
                  }
                  onChange={() =>
                    toggleCheckbox("tematica", "Ciencia y Tecnología")
                  }
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="tematica-6">Especializado</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="tematica-filter"
                  id="tematica-6"
                  checked={selectedFilters.tematica["Especializado"] || false}
                  onChange={() => toggleCheckbox("tematica", "Especializado")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="tematica-7">Historia</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="tematica-filter"
                  id="tematica-7"
                  checked={selectedFilters.tematica["Historia"] || false}
                  onChange={() => toggleCheckbox("tematica", "Historia")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="tematica-8">Otro</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="tematica-filter"
                  id="tematica-8"
                  checked={selectedFilters.tematica["Otro"] || false}
                  onChange={() => toggleCheckbox("tematica", "Otro")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
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
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="alcaldia-1">Benito Juárez</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="alcaldia-filter"
                  id="alcaldia-1"
                  checked={selectedFilters.alcaldia["Benito Juárez"] || false}
                  onChange={() => toggleCheckbox("alcaldia", "Benito Juárez")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="alcaldia-2">Cuauhtémoc</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="alcaldia-filter"
                  id="alcaldia-2"
                  checked={selectedFilters.alcaldia["Cuauhtémoc"] || false}
                  onChange={() => toggleCheckbox("alcaldia", "Cuauhtémoc")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="filtro-menu-filter-body-item">
              <label htmlFor="alcaldia-3">Miguel Hidalgo</label>
              <label className="filtro-chk">
                <input
                  type="checkbox"
                  name="alcaldia-filter"
                  id="alcaldia-3"
                  checked={selectedFilters.alcaldia["Miguel Hidalgo"] || false}
                  onChange={() => toggleCheckbox("alcaldia", "Miguel Hidalgo")}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
        </div>
        <div className="filtro-menu-rango-precios">
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
          {/* <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={rangoPrecio}
            onChange={handleRangoPrecioChange}
            id="rango-costo"
            name="rango-costo"
            placeholder="Rango de Costo"
            list="rango-costo-list"
            required
          /> */}
        </div>
        <p id="nmuseos">
          Mostrando{" "}
          <output>
            <b>0</b>
          </output>{" "}
          museos
        </p>
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
