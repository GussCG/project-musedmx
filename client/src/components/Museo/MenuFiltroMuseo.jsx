import { useState, useCallback, useEffect } from "react";
import "rc-slider/assets/index.css";
import Icons from "../Other/IconProvider";
const { CgClose, IoIosArrowDown } = Icons;
import { useTheme } from "../../context/ThemeProvider";

import { TEMATICAS, ALCALDIAS } from "../../constants/catalog";

function MenuFiltroMuseo({
  menuVisible,
  setMenuVisible,
  onFilterApply,
  currentFilters = { tipos: [], alcaldias: [] },
}) {
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

  useEffect(() => {
    if (currentFilters) {
      const newSelectedFilters = {
        tematica: {},
        alcaldia: {},
      };

      // Manejar tipos (que vienen como IDs numéricos)
      Object.values(TEMATICAS).forEach((tematica) => {
        newSelectedFilters.tematica[tematica.nombre] =
          currentFilters.tipos.some((tipoId) => {
            // Comparar directamente con el ID de la temática
            return tipoId === tematica.id;
          });
      });

      ALCALDIAS.forEach((alcaldia) => {
        newSelectedFilters.alcaldia[alcaldia] =
          currentFilters.alcaldias.includes(alcaldia);
      });

      setSelectedFilters(newSelectedFilters);
    }
  }, [currentFilters]);

  const toggleCheckbox = (category, value) => {
    console.log(`[toggleCheckbox] ${category} - ${value}`);
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
          .filter((nombreTematica) => selectedFilters.tematica[nombreTematica])
          .map((nombreTematica) => {
            // Encontrar la temática por nombre y devolver solo el ID
            const tematica = Object.values(TEMATICAS).find(
              (t) => t.nombre === nombreTematica
            );
            return tematica ? tematica.id : null; // Devuelve el ID, no el objeto
          })
          .filter((id) => id !== null),
        alcaldias: Object.keys(selectedFilters.alcaldia).filter(
          (key) => selectedFilters.alcaldia[key]
        ),
      };

      console.log("[handleFiltrar] Filtros a aplicar:", filtros);
      onFilterApply(filtros);
      cerrarMenu();
    } catch (error) {
      console.error("Error al aplicar los filtros:", error);
    }
  };

  const handleBorrar = useCallback(() => {
    console.log("[handleBorrar] Reseteando filtros...");
    const resetFilters = {
      tipos: [],
      alcaldias: [],
    };

    setRange([0, 100]);
    setSelectedFilters({ tematica: {}, alcaldia: {} });

    onFilterApply(resetFilters);
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
            {Object.values(TEMATICAS).map((tematica) => (
              <div key={tematica.id} className="filtro-menu-filter-body-item">
                <label htmlFor={`tematica-${tematica.id}`}>
                  {tematica.nombre}
                </label>
                <label className="filtro-chk">
                  <input
                    type="checkbox"
                    name="tematica-filter"
                    id={`tematica-${tematica.id}`}
                    checked={selectedFilters.tematica[tematica.nombre] || false}
                    onChange={() => toggleCheckbox("tematica", tematica.nombre)}
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
