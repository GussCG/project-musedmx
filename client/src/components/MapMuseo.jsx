import { useState, useEffect, useMemo, useCallback } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import Circle from "./Circle";
import MapMuseoDetailMarker from "./MapMuseoDetailMarker";

import Icons from "./IconProvider";
const { FaPerson } = Icons;

import { useTheme } from "../context/ThemeProvider";

import MapaDirections from "./MapaDirections";
import MapaCercaDeMi from "./MapaCercaDeMi";
import { motion, AnimatePresence } from "framer-motion";
import MapaPopulares from "./MapaPopulares";
import MapaCambiarCentro from "./MapaCambiarCentro";
import LoadingPage from "./LoadingMessage";
import LoadingMessage from "./LoadingMessage";

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

  const handlePlaceSelected = useCallback((place) => {
    if (place.geometry?.location) {
      setLocation((prev) => ({
        ...prev,
        mapCenter: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      }));
      setUserInteracted(true); // Marcar que hubo interacción del usuario
    }
  }, []);

  return (
    <motion.div
      className="map-container"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
      key={`map-container-${mapKey}`}
    >
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
          <LoadingMessage msg="Cargando museos en el mapa" />
          {museosMostrados
            .filter((museo) => museo)
            .map((museo) => (
              <MapMuseoDetailMarker
                key={getSafeKey(museo)}
                museo={museo}
                isActive={activeMuseo?.mus_id === museo.mus_id}
                onActivate={handleMuseoActivation}
              />
            ))}
          {tipo === "2" && (
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

              <MapaCercaDeMi
                userLocation={location.userLocation}
                museosMostrados={museosMostrados}
                radioKM={radioKM}
                travelMode={travelMode}
              />
            </>
          )}

          {tipo === "3" && <MapaPopulares />}

          {museosMostrados.length === 1 && (
            <MapaDirections
              userLocation={location.userLocation}
              museosMostrados={museosMostrados}
              travelMode={travelMode}
            />
          )}

          <MapaCambiarCentro onPlaceSelected={handlePlaceSelected} />

          {/* Marcador del usuario */}
          <AdvancedMarker position={location.userLocation}>
            <div className="user-marker">
              <FaPerson />
            </div>
          </AdvancedMarker>
        </Map>
      )}
    </motion.div>
  );
}

export default MapMuseo;
