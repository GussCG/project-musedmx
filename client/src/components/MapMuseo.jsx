import { useState, useEffect, useRef, useMemo, useCallback } from "react";

import {
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import Circle from "./Circle";
import CustomAdvancedMarker from "./CustomAdvancedMarker";
import MapMuseoDetailMarker from "./MapMuseoDetailMarker";
import { Link } from "react-router-dom";

import Icons from "./IconProvider";
const { FaPerson, CgClose, FaInfo, TbRouteSquare, MdMuseum, TbRadar2 } = Icons;

import foto_default from "../assets/images/others/museo-main-1.jpg";

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

// Este componente muestra en un museo-info -> los museos dentro del radio
function CercaDeMi({ userLocation, museosMostrados, radioKM, travelMode }) {
  const [museosConTiempos, setMuseosConTiempos] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoButton, setShowInfoButton] = useState(true);

  const timeLabels = {
    WALKING: "Caminando",
    BICYCLING: "En Bicicleta",
    DRIVING: "En Auto",
    TRANSIT: "En Transporte Público",
  };

  const calcularTiempoEstimado = useCallback((distancia, travelMode) => {
    const velocidades = {
      WALKING: 5, // km/h
      BICYCLING: 15, // km/h
      DRIVING: 40, // km/h
      TRANSIT: 25, // km/h
    };

    const velocidad = velocidades[travelMode] || 5; // km/h por defecto
    const horas = distancia / velocidad;
    const minutos = Math.round(horas * 60);

    return Math.max(1, minutos); // Asegurarse de que el tiempo mínimo sea 1 minuto
  }, []);

  // Calcular la distancia entre dos puntos geográficos
  // usando la fórmula del haversine
  const calcularDistancia = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
  }, []);

  const formatearDistancia = useCallback((distancia) => {
    const metros = distancia * 1000; // Convertir a metros
    return metros < 1000
      ? `${metros.toFixed(0)} m`
      : `${(metros / 1000).toFixed(1)} km`;
  }, []);

  const museosFiltrados = useMemo(() => {
    if (!userLocation || !museosMostrados) return [];

    return museosMostrados
      .map((museo) => {
        const distancia = calcularDistancia(
          userLocation.lat,
          userLocation.lng,
          museo.mus_g_latitud,
          museo.mus_g_longitud
        );
        return {
          ...museo,
          distancia,
        };
      })
      .filter((museo) => museo.distancia <= radioKM / 1000) // Filtrar museos dentro del radio
      .sort((a, b) => a.distancia - b.distancia); // Ordenar por distancia
  }, [userLocation, museosMostrados, radioKM]);

  useEffect(() => {
    const calcularTiempos = () => {
      const actualizados = museosFiltrados.map((museo) => ({
        ...museo,
        tiempoEstimado: calcularTiempoEstimado(museo.distancia, travelMode),
      }));
      setMuseosConTiempos(actualizados);
    };
    calcularTiempos();
  }, [museosFiltrados, travelMode, calcularTiempoEstimado]);

  const handleOpenInfo = () => {
    setShowInfo(true);
    setShowInfoButton(false); // Ocultar el botón al abrir la información
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
    setShowInfoButton(true); // Mostrar el botón al cerrar la información
  };

  return (
    <>
      <AnimatePresence>
        {showInfoButton && (
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
            title="Ver museos cercanos"
          >
            <TbRadar2 />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showInfo && (
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
            <h4>{`Museos dentro del radio: ${radioKM} m`}</h4>
            <p>{`Museos encontrados: ${museosFiltrados.length}`}</p>

            <ul className="museos-list">
              {museosConTiempos.map((museo) => (
                <motion.li
                  key={museo.mus_id}
                  className="museo-list-item"
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
                  <div className="museo-list-item-img">
                    <img
                      src={museo.mus_foto || foto_default}
                      alt={museo.mus_nombre}
                    />
                    <div className="museo-list-item-distance">
                      <p>{formatearDistancia(museo.distancia)}</p>
                    </div>
                  </div>
                  <div className="museo-list-item-info">
                    <div className="museo-list-item-name">
                      <Link to={`/Museos/${museo.mus_id}`}>
                        <p>{museo.mus_nombre}</p>
                      </Link>
                    </div>
                    <div className="museo-list-item-tiempo">
                      <p>
                        {museo.tiempoEstimado} min - {timeLabels[travelMode]}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MapMuseo({
  radioKM,
  museosMostrados,
  tipo,
  bounds,
  travelMode,
  mapType,
}) {
  const { isDarkMode, isRetroMode } = useTheme();
  const [activeMuseo, setActiveMuseo] = useState(null);
  const [zoom, setZoom] = useState(17);
  const [userInteracted, setUserInteracted] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const map = useMap();
  const [mapKey, setMapKey] = useState(0); // Clave para forzar la recarga del mapa
  const [currentMapId, setCurrentMapId] = useState(""); // ID del mapa actual

  const [location, setLocation] = useState({
    userLocation: null,
    mapCenter: null,
  });

  const handleMuseoActivation = useCallback((museo) => {
    setActiveMuseo((prev) => (prev?.mus_id === museo?.mus_id ? null : museo));
  }, []);

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
  useEffect(() => {
    const defaultLocation = { lat: 19.4326, lng: -99.1332 }; // Ciudad de México

    const successCallback = (position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setLocation({
        userLocation: newLocation,
        mapCenter: newLocation,
      });
    };

    const errorCallback = () => {
      setLocation({
        userLocation: defaultLocation,
        mapCenter: defaultLocation,
      });
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, [userInteracted]);

  // Inicializar el mapa
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
  }, [map, mapInitialized]);

  useEffect(() => {
    if (!map || !bounds || !mapInitialized || !location.userLocation) return;

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
  }, [map, bounds, mapInitialized, location.userLocation]);

  // useEffect(() => {
  //   if (userLocation && !userInteracted) {
  //     // Centrar al cambiar userLocation, si no hay interacción
  //     setMapCenter(userLocation);
  //   }
  // }, [userLocation, userInteracted]);

  const handleCenterChanged = useCallback(() => {
    if (map) {
      const newCenter = map.getCenter();
      if (newCenter) {
        setLocation((prev) => ({
          ...prev,
          mapCenter: {
            lat: newCenter.lat(),
            lng: newCenter.lng(),
          },
        }));
        setUserInteracted(true); // Marcar que hubo interacción del usuario
      }
    }
  }, [map]);

  const getSafeKey = (museo, index) => {
    return museo?.mus_id ? `museo-${museo.mus_id}` : `museo-${index}`;
  };

  return (
    <div className="map-container">
      {location.userLocation && (
        <Map
          key={`map-${mapKey}`}
          defaultZoom={zoom}
          bounds={bounds}
          center={location.mapCenter}
          mapId={currentMapId}
          mapTypeId={mapType}
          onCenterChanged={handleCenterChanged}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          {museosMostrados
            .filter((museo) => museo)
            .map((museo) => (
              <MapMuseoDetailMarker
                key={getSafeKey(museo)}
                museo={museo}
                isActive={activeMuseo?.mus_id === museo.mus_id}
                onActivate={handleMuseoActivation}
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
            <>
              <Circle
                center={location.userLocation}
                radius={radioKM}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.5,
                  strokeWeight: 3,
                  fillColor: "#FF0000",
                  fillOpacity: 0.1,
                }}
              />

              <CercaDeMi
                userLocation={location.userLocation}
                museosMostrados={museosMostrados}
                radioKM={radioKM}
                travelMode={travelMode}
              />
            </>
          ) : null}

          {museosMostrados.length === 1 && (
            <Directions
              userLocation={location.userLocation}
              museosMostrados={museosMostrados}
              travelMode={travelMode}
            />
          )}

          {/* Marcador del usuario */}
          <AdvancedMarker position={location.userLocation}>
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
