import { useState, useEffect, useMemo, useCallback, use } from "react";
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
import LoadingMessage from "./LoadingMessage";

function MapMuseo({ radioKM, museosMostrados, tipo, travelMode, mapType }) {
  const { isDarkMode, isRetroMode } = useTheme();
  const [activeMuseo, setActiveMuseo] = useState(null);
  const [zoom, setZoom] = useState(17);
  const [userInteracted, setUserInteracted] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const map = useMap();
  const [mapKey, setMapKey] = useState(0); // Clave para forzar la recarga del mapa
  const [currentMapId, setCurrentMapId] = useState(""); // ID del mapa actual
  const [mapBounds, setMapBounds] = useState(null);

  const [location, setLocation] = useState({
    userLocation: { lat: 19.4326, lng: -99.1332 }, // Ciudad de México por defecto
    mapCenter: { lat: 19.4326, lng: -99.1332 },
  });

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

  // // Obtener la ubicación del usuario
  // useEffect(() => {
  //   const defaultLocation = { lat: 19.4326, lng: -99.1332 }; // Ciudad de México

  //   const successCallback = (position) => {
  //     console.log("Ubicación del usuario:", position);
  //     const newLocation = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude,
  //       accuracy: position.coords.accuracy,
  //     };

  //     console.log("Nueva ubicación del usuario:", newLocation);
  //     setLocation({
  //       userLocation: newLocation,
  //       mapCenter: newLocation,
  //     });
  //   };

  //   const errorCallback = (error) => {
  //     console.error(
  //       "Error al obtener la ubicación del usuario.",
  //       error.code,
  //       error.message
  //     );
  //     setLocation({
  //       userLocation: defaultLocation,
  //       mapCenter: defaultLocation,
  //     });
  //   };

  //   const options = {
  //     enableHighAccuracy: true,
  //     maximumAge: 0,
  //     timeout: 5000,
  //   };

  //   // Verificar soporte y permisos antes de intentar
  //   if ("geolocation" in navigator) {
  //     navigator.permissions
  //       ?.query({ name: "geolocation" })
  //       .then((permissionStatus) => {
  //         console.log("Estado del permiso:", permissionStatus.state);

  //         if (permissionStatus.state === "granted") {
  //           console.log("Obteniendo ubicación...");
  //           navigator.geolocation.getCurrentPosition(
  //             successCallback,
  //             errorCallback,
  //             options
  //           );
  //         } else {
  //           console.warn(
  //             "Permisos no concedidos, usando ubicación por defecto"
  //           );
  //           setLocation({
  //             userLocation: defaultLocation,
  //             mapCenter: defaultLocation,
  //           });
  //         }
  //       })
  //       .catch(() => {
  //         // Fallback para navegadores que no soportan permissions.query
  //         console.log("Intentando obtener ubicación sin verificar permisos...");
  //         navigator.geolocation.getCurrentPosition(
  //           successCallback,
  //           errorCallback,
  //           options
  //         );
  //       });
  //   } else {
  //     console.error("API de geolocalización no soportada");
  //     setLocation({
  //       userLocation: defaultLocation,
  //       mapCenter: defaultLocation,
  //     });
  //   }
  // }, [userInteracted]);

  // Inicializar el mapa
  useEffect(() => {
    if (!map || mapInitialized) return;

    const initMap = () => {
      try {
        const center = location.userLocation || location.mapCenter;

        if (isNaN(center.lat) || isNaN(center.lng)) {
          console.error("Coordenadas inválidas:", center);
          return;
        }

        map.setOptions({
          gestureHandling: "greedy",
          disableDefaultUI: true,
          keyboardShortcuts: false,
          center: new window.google.maps.LatLng(center.lat, center.lng),
          zoom: zoom,
        });
        setMapInitialized(true);
      } catch (error) {
        console.error("Error al inicializar el mapa:", error);
        setTimeout(initMap, 1000); // Reintentar después de 1 segundo
      }
    };
    initMap();
  }, [map, mapInitialized, location.userLocation, location.mapCenter, zoom]);

  // Ajustar el zoom del mapa al tamaño de la pantalla
  useEffect(() => {
    if (tipo === "2" || !map || !mapInitialized || !museosMostrados?.length)
      return;

    const newBounds = new window.google.maps.LatLngBounds();

    const museosParaCalculo = museosMostrados.slice(0, 35);

    museosParaCalculo.forEach((museo) => {
      if (museo?.g_latitud && museo?.g_longitud) {
        newBounds.extend(
          new window.google.maps.LatLng(museo.g_latitud, museo.g_longitud)
        );
      }
    });

    // Asegurar que son validos
    if (!newBounds.isEmpty()) {
      setMapBounds(newBounds);
    } else {
      if (location.userLocation) {
        const fallbackBounds = new window.google.maps.LatLngBounds();
        fallbackBounds.extend(
          new window.google.maps.LatLng(
            location.userLocation.lat,
            location.userLocation.lng
          )
        );
        setMapBounds(fallbackBounds);
      } else {
        console.warn(
          "No se puede calcular el bounds, ubicación del usuario no disponible."
        );
        setMapBounds(null); // No se puede calcular el bounds
      }
    }
  }, [map, mapInitialized, museosMostrados, tipo, location.userLocation]);

  // Aplicamos los bounds cuando cambian
  useEffect(() => {
    if (tipo === "2" || !map || !mapBounds) return;

    const padding = 50;
    try {
      map.fitBounds(mapBounds, padding);

      const currentZoom = map.getZoom();
      if (currentZoom > 16) map.setZoom(16); // Limitar el zoom máximo a 17
      if (currentZoom < 12) map.setZoom(12); // Limitar el zoom mínimo a 12
    } catch (error) {
      console.error("Error al ajustar los límites del mapa:", error);
      if (location.userLocation) {
        map.setCenter(location.userLocation);
        map.setZoom(12); // Ajustar el zoom al centro del usuario
      }
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
        setZoom(currentZoom);
      }
    } catch (error) {
      console.warn("Error al actualizar cámara:", error);
    }
  }, [map]);

  const getSafeKey = (museo, index) => {
    return museo?.id ? `museo-${museo.id}` : `museo-${index}`;
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
          center={location.mapCenter}
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
