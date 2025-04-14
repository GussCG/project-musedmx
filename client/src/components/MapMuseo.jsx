import { useState, useEffect, useRef, useMemo } from "react";

import {
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import Circle from "./Circle";
import CustomAdvancedMarker from "./CustomAdvancedMarker";
import MapMuseoDetailMarker from "./MapMuseoDetailMarker";

import Icons from "./IconProvider";
const { FaPerson, CgClose, FaInfo, TbRouteSquare } = Icons;

import { useTheme } from "../context/ThemeProvider";

// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

function Directions({ userLocation, museosMostrados, travelMode }) {
  const museo = museosMostrados[0]; // Solo se usa el primer museo para la ruta
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0); // Para manejar rutas alternativas
  const selectedRoute = routes[routeIndex]; // Ruta seleccionada
  const leg = selectedRoute?.legs[0]; // Obtener la primera ruta y su primer segmento
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoButton, setShowInfoButton] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculatedRoute, setHasCalculatedRoute] = useState(false);

  useEffect(() => {
    if (!map || !routesLib) return;

    const newDirectionsService = new routesLib.DirectionsService();
    const newDirectionsRenderer = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: true,
    });

    setDirectionsService(newDirectionsService);
    setDirectionsRenderer(newDirectionsRenderer);

    // Limpiar al desmontar
    return () => {
      if (newDirectionsRenderer) {
        newDirectionsRenderer.setMap(null); // Limpiar el mapa
      }
      setDirectionsService(null);
      setDirectionsRenderer(null);
    };
  }, [map, routesLib]);

  const calculateRoute = () => {
    if (!directionsService || !directionsRenderer) return;

    setIsCalculating(true); // Iniciar el cálculo de la ruta
    setHasCalculatedRoute(true); // Indicar que se ha calculado la ruta

    directionsService
      .route({
        origin: userLocation,
        destination: {
          lat: Number(museo.mus_g_latitud),
          lng: Number(museo.mus_g_longitud),
        },
        travelMode: travelMode,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setMap(map); // Mostrar el mapa
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
        setShowInfo(true); // Mostrar la información de la ruta
      })
      .catch((error) => {
        console.error("Error al calcular la ruta:", error);
      })
      .finally(() => {
        setIsCalculating(false); // Finalizar el cálculo de la ruta
      });
  };

  useEffect(() => {
    if (hasCalculatedRoute && directionsRenderer && directionsService) {
      calculateRoute(); // Calcular la ruta al abrir la información
    }
  }, [travelMode]);

  // Limpiar ruta al cambiar de museo
  useEffect(() => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null); // Limpiar el mapa
      setRoutes([]); // Limpiar rutas
      setShowInfo(false); // Ocultar información de ruta
      setShowInfoButton(true); // Mostrar botón de información
      setHasCalculatedRoute(false); // Restablecer el estado de cálculo de ruta
    }
  }, [museo, directionsRenderer]);

  // Ruta alternativa
  useEffect(() => {
    if (!directionsRenderer || !routes.length) return;

    directionsRenderer.setRouteIndex(routeIndex); // Cambiar la ruta mostrada en el mapa
  }, [routeIndex, directionsRenderer, routes]);

  const handleOpenInfo = () => {
    if (routes.length > 0) {
      setShowInfo(true);
      setShowInfoButton(false); // Ocultar el botón al abrir la información
    }
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
    setShowInfoButton(true); // Mostrar el botón al cerrar la información
  };

  return (
    <>
      <AnimatePresence>
        {showInfoButton && hasCalculatedRoute && (
          <motion.button
            type="button"
            className="btn-map"
            id="btn-map-info"
            onClick={handleOpenInfo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.1,
              ease: "easeInOut",
            }}
            key={"map-info-button"}
          >
            <FaInfo />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="btn-map"
        id="btn-map-routes"
        title="¿Cómo llegar?"
        onClick={calculateRoute}
        disabled={isCalculating}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.1,
          ease: "easeInOut",
        }}
        key={"map-route-button"}
        whileHover={{ scale: 1.05 }}
      >
        <div className="btn-map-bg" />
        <TbRouteSquare />
      </motion.button>

      <AnimatePresence>
        {showInfo && routes.length > 0 && routes[routeIndex]?.legs[0] && (
          <motion.div
            className="map-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{
              duration: 0.1,
              ease: "easeInOut",
              type: "spring",
              stiffness: 50,
            }}
            key={"map-info"}
          >
            <button className="close-button" onClick={handleCloseInfo}>
              <CgClose />
            </button>
            <h4>Información de ruta</h4>
            <p>
              {leg.start_address.split(",")[0]} a{" "}
              {leg.end_address.split(",")[0]}
            </p>
            <p>
              <b>Distancia: </b>
              {leg.distance.text}
            </p>
            <p>
              <b>Duración: </b> {leg.duration.text}
            </p>

            {routes.length > 1 && (
              <div className="routes-alt">
                <h4>Otras Rutas</h4>
                <ul className="routes-list">
                  {routes.map((route, index) => (
                    <motion.li
                      key={index}
                      className="route-item"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        type: "spring",
                        stiffness: 50,
                      }}
                    >
                      <button
                        className={`route-button ${
                          index === routeIndex ? "active" : ""
                        }`}
                        onClick={() => setRouteIndex(index)}
                      >
                        {route.summary}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// // Este componente muestra en un museo-info -> los museos dentro del radio
// function CercaDeMi(){

// }

function MapMuseo({
  radioKM,
  museosMostrados,
  ubicacionCoords,
  tipo,
  bounds,
  travelMode,
  mapType,
  // onCenterUserLocation,
}) {
  const { isDarkMode, isRetroMode } = useTheme();

  const [hoveredMuseo, setHoveredMuseo] = useState(null);
  const [activeMuseo, setActiveMuseo] = useState(null);
  const [zoom, setZoom] = useState(17);

  const [mapCenter, setMapCenter] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const map = useMap();
  const [mapKey, setMapKey] = useState(0); // Clave para forzar la recarga del mapa
  const [currentMapId, setCurrentMapId] = useState(""); // ID del mapa actual

  const mapId = useMemo(() => {
    return isRetroMode
      ? import.meta.env.VITE_MAP_RETROMODE_DETAIL_ID
      : isDarkMode
      ? import.meta.env.VITE_MAP_DARKMODE_DETAIL_ID
      : import.meta.env.VITE_MAP_DETAIL_ID;
  }, [isDarkMode, isRetroMode]);

  useEffect(() => {
    if (mapId && mapId !== currentMapId) {
      setCurrentMapId(mapId);
      setMapKey((prevKey) => prevKey + 1); // Forzar la recarga del mapa
    }
  }, [mapId, currentMapId]);

  // Obtener la ubicación del usuario
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    if (!ubicacionCoords) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          if (!userInteracted) {
            setMapCenter(location);
          }
        },
        (error) => {
          const defaultLocation = { lat: 19.4326, lng: -99.1332 };
          setUserLocation(defaultLocation);
          if (!userInteracted) {
            setMapCenter(defaultLocation);
          }
        }
      );
    } else {
      // Si se proporcionan coordenadas (nueva búsqueda)
      const coords = {
        lat:
          typeof ubicacionCoords.lat === "string"
            ? Number(ubicacionCoords.lat)
            : ubicacionCoords.lat,
        lng:
          typeof ubicacionCoords.lng === "string"
            ? Number(ubicacionCoords.lng)
            : ubicacionCoords.lng,
      };
      setUserLocation(coords);
      setMapCenter(coords); // Forzar el movimiento del mapa
      setUserInteracted(false); // Restablecer la interacción del usuario
    }
  }, [ubicacionCoords]); // Dependencia: ubicacionCoords

  useEffect(() => {
    if (!map || mapInitialized) return;

    const initMap = () => {
      try {
        map.setOptions({
          gestureHandling: "greedy",
          disableDefaultUI: true,
        });
        setMapInitialized(true);
      } catch (error) {
        console.error("Error al inicializar el mapa:", error);
        setTimeout(initMap, 100);
      }
    };
    initMap();
  }, [map]);

  useEffect(() => {
    if (!map || !bounds || !mapInitialized) return;

    const applyBounds = () => {
      try {
        const padding = 50;
        map.fitBounds(bounds, padding);

        const currentZoom = map.getZoom();
        if (currentZoom > 16) map.setZoom(16); // Limitar el zoom máximo a 17
        if (currentZoom < 12) map.setZoom(12); // Limitar el zoom mínimo a 12
      } catch (error) {
        console.error("Error al ajustar los límites del mapa:", error);
        map.setCenter(userLocation);
        map.setZoom(12);
      }
    };
    applyBounds();
  }, [map, bounds, userLocation, mapInitialized]);

  useEffect(() => {
    if (userLocation && !userInteracted) {
      // Centrar al cambiar userLocation, si no hay interacción
      setMapCenter(userLocation);
    }
  }, [userLocation, userInteracted]);

  const handleCenterChanged = () => {
    if (map) {
      const newCenter = map.getCenter();
      if (newCenter) {
        setMapCenter({
          lat: newCenter.lat(),
          lng: newCenter.lng(),
        });
        setUserInteracted(true);
      }
    }
  };

  return (
    <div className="map-container">
      {userLocation && (
        <Map
          key={`map-${mapKey}`}
          defaultZoom={zoom}
          bounds={bounds}
          center={mapCenter}
          mapId={currentMapId}
          mapTypeId={mapType}
          onCenterChanged={handleCenterChanged}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          {museosMostrados.map((museo) => (
            <MapMuseoDetailMarker
              key={museo.mus_id}
              museo={museo}
              activeMuseo={activeMuseo}
              setActiveMuseo={setActiveMuseo}
            />
            // <CustomAdvancedMarker
            //   key={museo.mus_id}
            //   lat={museo.mus_g_latitud}
            //   lng={museo.mus_g_longitud}
            //   nombre={museo.mus_nombre}
            //   imagen={museo.mus_foto}
            //   idMuseo={museo.mus_id}
            // />
          ))}
          {tipo === "2" ? (
            <Circle
              center={userLocation}
              radius={radioKM}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.5,
                strokeWeight: 3,
                fillColor: "#FF0000",
                fillOpacity: 0.1,
              }}
            />
          ) : null}

          {museosMostrados.length === 1 && (
            <Directions
              userLocation={userLocation}
              museosMostrados={museosMostrados}
              travelMode={travelMode}
            />
          )}
          {/* Marcador del usuario */}
          <AdvancedMarker position={userLocation}>
            <div className="user-marker">
              <FaPerson />
            </div>
          </AdvancedMarker>
        </Map>
      )}
    </div>
  );
}

export default MapMuseo;
