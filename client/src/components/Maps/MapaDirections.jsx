import { useState, useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import Icons from "../Other/IconProvider";
const { CgClose, FaInfo, TbRouteSquare } = Icons;
import { motion, AnimatePresence } from "framer-motion";
import { TEMATICAS } from "../../constants/catalog";

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

  const tema = TEMATICAS[museo.tematica];

  useEffect(() => {
    if (!map || !routesLib) return;

    const newDirectionsService = new routesLib.DirectionsService();
    const newDirectionsRenderer = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: tema.museoCardColors.text,
        strokeOpacity: 0.8,
        strokeWeight: 6,
      },
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
          lat: Number(museo.g_latitud),
          lng: Number(museo.g_longitud),
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

            {routes.length > 1 &&
              routes.some((r, i) => i !== routeIndex) &&
              travelMode !== "TRANSIT" && (
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

export default Directions;
