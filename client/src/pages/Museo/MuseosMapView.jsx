import React, { useState, useEffect, createElement } from "react";
import MapMuseo from "../../components/Maps/MapMuseo";
import MapIndicaciones from "../../components/Maps/MapIndicaciones";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useUserLocation } from "../../context/UserLocationProvider";

import Icons from "../../components/Other/IconProvider";
const { FaQuestion, IoIosArrowDown, LiaSearchLocationSolid } = Icons;

import { AnimatePresence, motion } from "framer-motion";

// Para obtener la API de Google Maps
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

import { TRAVEL_MODES, MAP_TYPES } from "../../constants/catalog";
import PopupPortal from "../../components/Other/PopupPortal";

// Dependiendo del titulo se muestra el radio de busqueda
// En Ver Todos y en Populares no se muestra el radio
function MuseosMapView({ MuseosMostrados, tipo, loading }) {
  // Estados
  const [apiKey, setApiKey] = useState(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [rangoRadio, setRangoRadio] = useState(0.1);
  const radioKM = rangoRadio * 1000;
  const [ubicacionCoords, setUbicacionCoords] = useState(null);
  const [showIndicaciones, setShowIndicaciones] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [selectedTravelMode, setSelectedTravelMode] = useState("WALKING");
  const [isOpenTravelMode, setIsOpenTravelMode] = useState(false);
  const [selectedMapType, setSelectedMapType] = useState("ROADMAP");
  const [selectedMapTypeNormalized, setSelectedMapTypeNormalized] =
    useState("roadmap");
  const [isOpenMapType, setIsOpenMapType] = useState(false);
  const { obtenerUbicacion, location } = useUserLocation();

  const toggleTravelMode = () => {
    setIsOpenTravelMode((prev) => !prev);
  };

  const toggleMapType = () => {
    setIsOpenMapType((prev) => !prev);
  };

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/maps-key`);
        const data = await response.json();
        setApiKey(data.key);
      } catch (error) {
        console.error("Error al cargar la API Key:", error);
      }
    };
    loadApiKey();
  }, []);

  useEffect(() => {
    if (!apiKey) return;

    const checkMapsReady = () => {
      if (window.google && window.google.maps) {
        setIsApiLoaded(true);
        setMapsReady(true);
      } else {
        setTimeout(checkMapsReady, 100);
      }
    };
    checkMapsReady();
  }, [apiKey]);

  // Funcion para manejar el cambio del rango en el input range
  const handleRangeChange = (e) => {
    setRangoRadio(e.target.value);
  };

  useEffect(() => {
    const dontShowAgain =
      localStorage.getItem("dontShowMapIndicaciones") === "true";
    if (!dontShowAgain) {
      setShowIndicaciones(true);
    }
  }, []);

  const handleInstrucciones = () => {
    setShowIndicaciones(true);
  };

  if (!apiKey) return <div>Cargando el mapa...</div>; // Mientras carga la API Key
  return (
    <>
      <PopupPortal>
        <MapIndicaciones
          isOpen={showIndicaciones}
          onClose={() => setShowIndicaciones(false)}
        />
      </PopupPortal>

      <motion.div
        id="museos-map-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className="museos-map-nav">
          <div id="museos-form-nav">
            {tipo === "2" ? (
              <div className="museos-nav-section range-section">
                <label
                  htmlFor="museos-range-ubicacion"
                  id="frm-range-ubicacion"
                >
                  <b>Tamaño de Radio:</b>
                  <br /> <output>{rangoRadio}</output> km
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={rangoRadio}
                  id="museos-range-ubicacion"
                  name="museos-range-ubicacion"
                  placeholder="Rango de Ubicación"
                  list="museos-range-ubicacion-list"
                  onChange={handleRangeChange}
                  required
                />
              </div>
            ) : null}
          </div>
        </section>
        <section className="museos-map-container">
          <APIProvider apiKey={apiKey} libraries={["places"]}>
            <div className="btn-map-container">
              <button
                type="button"
                className="btn-map"
                id="btn-map-user-location"
                onClick={handleInstrucciones}
                title="Ayuda"
              >
                <div className="btn-map-bg" />
                <FaQuestion />
              </button>

              <button
                type="button"
                className="btn-map"
                id="btn-map-get-location"
                title="Obtener ubicación actual"
                onClick={obtenerUbicacion}
              >
                <div className="btn-map-bg" />
                <LiaSearchLocationSolid />
              </button>

              <div className="btn-dropdown-container" id="dd-travel-mode">
                <button
                  type="button"
                  className="btn-map"
                  id="btn-map-travel-mode"
                  title="Modo de Viaje"
                  onClick={toggleTravelMode}
                >
                  <div className="btn-map-bg" />
                  {createElement(TRAVEL_MODES[selectedTravelMode]?.icon)}
                  <motion.div
                    className="arrow-dd"
                    animate={{ rotate: isOpenTravelMode ? 180 : 0 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <IoIosArrowDown />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpenTravelMode && (
                    <motion.div
                      className="btn-dropdown-content"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{
                        duration: 0.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      {Object.values(TRAVEL_MODES).map((mode, index) => (
                        <motion.button
                          key={mode.value}
                          initial={{ opacity: 0, x: -10, scale: 0.9 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            transition: {
                              delay: index * 0.1,
                              duration: 0.2,
                              ease: "easeOut",
                            },
                          }}
                          exit={{
                            opacity: 0,
                            x: -10,
                            scale: 0.9,
                            transition: {
                              delay:
                                (Object.values(TRAVEL_MODES).length -
                                  index -
                                  1) *
                                0.03,
                              duration: 0.15,
                              ease: "easeIn",
                            },
                          }}
                          type="button"
                          className="btn-map"
                          id={`btn-map-${mode.value}`}
                          title={mode.label}
                          onClick={() => {
                            setSelectedTravelMode(mode.value);
                            setIsOpenTravelMode(false);
                          }}
                        >
                          <div className="btn-map-bg" />
                          {createElement(mode.icon)}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="btn-dropdown-container" id="dd-map-type">
                <button
                  type="button"
                  className="btn-map"
                  id="btn-map-type"
                  title="Tipo de Mapa"
                  onClick={toggleMapType}
                >
                  <div className="btn-map-bg" />
                  {createElement(MAP_TYPES[selectedMapType]?.icon)}
                  <motion.div
                    className="arrow-dd"
                    animate={{ rotate: isOpenMapType ? 180 : 0 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <IoIosArrowDown />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpenMapType && (
                    <motion.div
                      className="btn-dropdown-content"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{
                        duration: 0.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      {Object.values(MAP_TYPES).map((type, index) => (
                        <motion.button
                          key={type.value}
                          initial={{ opacity: 0, x: -10, scale: 0.9 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            transition: {
                              delay: index * 0.1,
                              duration: 0.2,
                              ease: "easeOut",
                            },
                          }}
                          exit={{
                            opacity: 0,
                            x: -10,
                            scale: 0.9,
                            transition: {
                              delay:
                                (Object.values(MAP_TYPES).length - index - 1) *
                                0.03,
                              duration: 0.15,
                              ease: "easeIn",
                            },
                          }}
                          type="button"
                          className="btn-map"
                          id={`btn-map-${type.value}`}
                          title={type.label}
                          onClick={() => {
                            setSelectedMapType(type.value);
                            setSelectedMapTypeNormalized(type.normalized);
                            setIsOpenMapType(false);
                          }}
                        >
                          <div className="btn-map-bg" />
                          {createElement(type.icon)}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <MapMuseo
              radioKM={radioKM}
              museosMostrados={MuseosMostrados}
              ubicacionCoords={ubicacionCoords}
              place={null}
              tipo={tipo}
              travelMode={selectedTravelMode}
              mapType={selectedMapTypeNormalized}
              loadingMuseos={loading}
            />
          </APIProvider>
        </section>
      </motion.div>
    </>
  );
}

export default MuseosMapView;
