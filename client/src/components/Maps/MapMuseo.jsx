import { useState, useEffect, useMemo, useCallback } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import Circle from "../Other/Circle";
import MapMuseoDetailMarker from "./MapMuseoDetailMarker";
import { useUserLocation } from "../../context/UserLocationProvider";
import Icons from "../Other/IconProvider";
const { FaPerson } = Icons;
import { useTheme } from "../../context/ThemeProvider";
import MapaDirections from "./MapaDirections";
import MapaCercaDeMi from "./MapaCercaDeMi";
import { motion, AnimatePresence } from "framer-motion";
import MapaPopulares from "./MapaPopulares";
import MapaCambiarCentro from "./MapaCambiarCentro";
import LoadingMessage from "./LoadingMessage";

function MapMuseo({ radioKM, museosMostrados, tipo, travelMode, mapType }) {
  const { isDarkMode, isRetroMode } = useTheme();
  const [activeMuseo, setActiveMuseo] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const map = useMap();
  const [mapKey, setMapKey] = useState(0); // Clave para forzar la recarga del mapa
  const [currentMapId, setCurrentMapId] = useState(""); // ID del mapa actual
  const [mapBounds, setMapBounds] = useState(null);

  const { location, setLocation } = useUserLocation();

  const isLoadingMuseos = museosMostrados.length === 0;

  const handleMuseoActivation = useCallback((museo) => {
    setActiveMuseo((prev) => (prev?.id === museo?.id ? null : museo));
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

  const handlePlaceSelected = (placeData) => {
    const newLocation = {
      lat: placeData.geometry.location.lat(),
      lng: placeData.geometry.location.lng(),
    };

    setLocation((prev) => ({
      ...prev,
      mapCenter: newLocation,
      userLocation: newLocation,
    }));

    if (map) {
      map.panTo(newLocation);
    }
  };

  // Inicializar el mapa
  useEffect(() => {
    if (!map || mapInitialized) return;

    const center = location.userLocation;

    if (!center || isNaN(center.lat) || isNaN(center.lng)) {
      console.warn(
        "Ubicación del usuario no válida, usando ubicación por defecto."
      );
      return;
    }

    map.setOptions({
      gestureHandling: "greedy",
      disableDefaultUI: true,
      keyboardShortcuts: false,
      center: new window.google.maps.LatLng(center.lat, center.lng),
      zoom: 12,
    });

    setMapInitialized(true);
  }, [map, mapInitialized, location.userLocation]);

  // Ajustar el zoom del mapa al tamaño de la pantalla
  useEffect(() => {
    if (tipo === "2" || !map || !museosMostrados?.length) return;

    const bounds = new window.google.maps.LatLngBounds();
    const museosParaCalculo = museosMostrados.slice(0, 35);

    museosParaCalculo.forEach((museo) => {
      if (museo?.g_latitud && museo?.g_longitud) {
        bounds.extend(
          new window.google.maps.LatLng(museo.g_latitud, museo.g_longitud)
        );
      }
    });

    // Asegurar que son validos
    if (!bounds.isEmpty()) {
      setMapBounds(bounds);
    } else if (location.userLocation) {
      const fallback = new window.google.maps.LatLngBounds();
      fallback.extend(
        new window.google.maps.LatLng(
          location.userLocation.lat,
          location.userLocation.lng
        )
      );
      setMapBounds(fallback);
    }
  }, [map, museosMostrados, tipo, location.userLocation]);

  useEffect(() => {
    if (!map || !mapInitialized || tipo !== "4" || museosMostrados.length !== 1)
      return;

    const museo = museosMostrados[0];

    if (museo?.g_latitud && museo?.g_longitud) {
      const museoLocation = {
        lat: parseFloat(museo.g_latitud),
        lng: parseFloat(museo.g_longitud),
      };

      map.setCenter(museoLocation);
      map.setZoom(16);

      setLocation((prev) => ({
        ...prev,
        mapCenter: museoLocation,
      }));
    }
  }, [map, mapInitialized, tipo, museosMostrados, setLocation]);

  // Aplicamos los bounds cuando cambian
  useEffect(() => {
    if (!map || tipo === "2" || tipo === "4" || tipo === "3" || !mapBounds)
      return;

    const padding = 50;

    try {
      map.fitBounds(mapBounds, padding);
    } catch (error) {
      console.warn("Error en fitBounds:", err);
      map.setCenter(location.userLocation);
      map.setZoom(14);
    }
  }, [map, mapBounds, tipo, location.userLocation]);

  const handleCenterChanged = useCallback(() => {
    if (!map) return;

    try {
      const center = map.getCenter();
      const currentZoom = map.getZoom();

      if (center && typeof currentZoom === "number") {
        setLocation((prev) => ({
          ...prev,
          mapCenter: { lat: center.lat(), lng: center.lng() },
        }));
      }
    } catch (error) {
      console.warn("Error al actualizar cámara:", error);
    }
  }, [map]);

  // Cuando sea un solo museo se desplaza el mapa a su ubicación
  useEffect(() => {
    if (map && museosMostrados.length === 1) {
      const museoLocation = {
        lat: parseFloat(museosMostrados[0].g_latitud),
        lng: parseFloat(museosMostrados[0].g_longitud),
      };

      map.panTo(museoLocation); // Desplazar el mapa a la ubicación del museo
    }
  }, [map, museosMostrados]);

  const getSafeKey = (museo, index) => {
    return museo?.id ? `museo-${museo.id}` : `museo-${index}`;
  };

  return (
    <motion.div
      className="map-container"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
      key={`map-container-${mapKey}`}
    >
      {location?.mapCenter && (
        <Map
          key={`map-${mapKey}`}
          defaultZoom={12}
          defaultCenter={location.mapCenter}
          mapId={currentMapId}
          mapTypeId={mapType}
          onCenterChanged={handleCenterChanged}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          <AnimatePresence>
            {isLoadingMuseos && (
              <motion.div
                key={"loading-message"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingMessage msg="Cargando museos en el mapa y calculando los bounds" />
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoadingMuseos &&
            museosMostrados
              .filter((museo) => museo)
              .map((museo) => (
                <MapMuseoDetailMarker
                  key={getSafeKey(museo)}
                  museo={museo}
                  isActive={activeMuseo?.id === museo.id}
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

          {tipo === "3" && <MapaPopulares museosMostrados={museosMostrados} />}

          {museosMostrados.length === 1 && (
            <MapaDirections
              userLocation={location.userLocation}
              museosMostrados={museosMostrados}
              travelMode={travelMode}
            />
          )}

          <MapaCambiarCentro onPlaceSelected={handlePlaceSelected} />

          {/* Marcador del usuario */}
          {location.userLocation && (
            <AdvancedMarker
              key={`user-marker-${location.userLocation.lat}-${location.userLocation.lng}`}
              position={{
                lat: Number(location.userLocation.lat),
                lng: Number(location.userLocation.lng),
              }}
              title={"Tu ubicación"}
            >
              {/* Icono del usuario */}
              <div className="user-marker">
                <FaPerson />
              </div>
            </AdvancedMarker>
          )}
        </Map>
      )}
    </motion.div>
  );
}

export default MapMuseo;
