import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import Circle from "../Other/Circle";
import MapMuseoDetailMarker from "./MapMuseoDetailMarker";
import { useUserLocation } from "../../context/UserLocationProvider";
import Icons from "../Other/IconProvider";
const { FaPerson } = Icons;
import { useTheme } from "../../context/ThemeProvider";
import MapaDirections from "./MapaDirections";
import MapaCercaDeMi from "./MapaCercaDeMi";
import { motion, AnimatePresence, m } from "framer-motion";
import MapaPopulares from "./MapaPopulares";
import MapaCambiarCentro from "./MapaCambiarCentro";
import LoadingMessage from "./LoadingMessage";
import CustomAdvancedMarker from "./CustomAdvancedMarker";
import MapaMuseosCercaDeMuseo from "./MapaMuseosCercaDeMuseo";
import ToastMessage from "../Other/ToastMessage";

function MapMuseo({
  radioKM,
  museosMostrados,
  tipo,
  travelMode,
  mapType,
  zoom,
}) {
  const { isDarkMode, isRetroMode } = useTheme();
  const [activeMuseo, setActiveMuseo] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const map = useMap();
  const [mapKey, setMapKey] = useState(0); // Clave para forzar la recarga del mapa
  const [currentMapId, setCurrentMapId] = useState(""); // ID del mapa actual
  const [mapBounds, setMapBounds] = useState(null);
  const [idMuseoPrincipal, setIdMuseoPrincipal] = useState(null);

  useEffect(() => {
    if (museosMostrados.length === 1) {
      const museo = museosMostrados[0];
      setIdMuseoPrincipal(museo.id);
    }
  }, [museosMostrados]);

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

  const handlePlaceSelected = useCallback(
    (placeData) => {
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
    },
    [map, setLocation]
  );

  // Inicializar el mapa
  useEffect(() => {
    if (!map) return;

    const center = {
      lat: museosMostrados?.[0]?.g_latitud || location?.userLocation?.lat,
      lng: museosMostrados?.[0]?.g_longitud || location?.userLocation?.lng,
    };

    map.setOptions({
      gestureHandling: "greedy",
      center: new window.google.maps.LatLng(center.lat, center.lng),
      keyboardShortcuts: false,
      disableDoubleClickZoom: true,
      zoom: zoom || 18,
      zoomControl: true,
      mapTypeControl: false,
      fullscreenControl: false,
      scaleControl: false,
      streetViewControl: true,
    });
    setMapInitialized(true);
  }, [map, location.userLocation, zoom]);

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
    if (!map || tipo !== 5 || museosMostrados.length <= 1) return;

    const bounds = new window.google.maps.LatLngBounds();

    museosMostrados.forEach((museo) => {
      if (museo?.g_latitud && museo?.g_longitud) {
        bounds.extend(
          new window.google.maps.LatLng(
            parseFloat(museo.g_latitud),
            parseFloat(museo.g_longitud)
          )
        );
      }
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  }, [map, museosMostrados, tipo]);

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

      setLocation((prev) => ({
        ...prev,
        mapCenter: museoLocation,
      }));
    }
  }, [map, mapInitialized, tipo, museosMostrados, setLocation]);

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
      map.setZoom(18); // Ajustar el zoom al museo
    }
  }, [map, museosMostrados]);

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

  const museosDentroDelRadio = useMemo(() => {
    if (tipo !== "2") return museosMostrados || [];

    if (!location?.userLocation) return [];

    return (museosMostrados || []).filter((museo) => {
      const distancia = calcularDistancia(
        location.userLocation.lat,
        location.userLocation.lng,
        museo.g_latitud,
        museo.g_longitud
      );
      return distancia <= radioKM / 1000;
    });
  }, [tipo, location?.userLocation, museosMostrados, radioKM]);

  const haMostradoMensajeUbicacion = useRef(false);
  const haMostradoMensajeVacio = useRef(false);

  useEffect(() => {
    if (tipo === "2") {
      if (!location?.userLocation && !haMostradoMensajeUbicacion.current) {
        ToastMessage({
          tipo: "error",
          mensaje: "No tienes una ubicación definida para calcular distancias.",
          position: "top-right",
        });
        haMostradoMensajeUbicacion.current = true;
      } else if (
        location?.userLocation &&
        museosMostrados?.length &&
        museosDentroDelRadio.length === 0 &&
        !haMostradoMensajeVacio.current
      ) {
        ToastMessage({
          tipo: "info",
          mensaje:
            "No se encontraron museos en tu área seleccionada. Ajusta el radio o cambia de ubicación.",
          position: "top-right",
        });
        haMostradoMensajeVacio.current = true;
      }
    }
  }, [tipo, location?.userLocation, museosDentroDelRadio, museosMostrados]);

  useEffect(() => {
    haMostradoMensajeVacio.current = false;
  }, [radioKM]);

  const getSafeKey = useCallback((museo, index) => {
    return museo?.id ? `museo-${museo.id}` : `museo-${index}`;
  }, []);

  useEffect(() => {
    if (!map || !location?.userLocation) return;

    map.panTo({
      lat: location.userLocation.lat,
      lng: location.userLocation.lng,
    });
  }, [location?.userLocation]);

  useEffect(() => {
    if (!map || tipo !== "2" || !location?.userLocation) return;

    // Convertir el radio a grados aproximados (1 grado ~ 111 km)
    const RADIUS_IN_DEGREES = radioKM / 1000 / 111;

    const { lat, lng } = location.userLocation;

    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(
        lat - RADIUS_IN_DEGREES,
        lng - RADIUS_IN_DEGREES
      ),
      new window.google.maps.LatLng(
        lat + RADIUS_IN_DEGREES,
        lng + RADIUS_IN_DEGREES
      )
    );

    map.fitBounds(bounds);
  }, [map, radioKM, location?.userLocation, tipo]);

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
          defaultZoom={zoom || 18}
          defaultCenter={location.mapCenter}
          mapId={currentMapId}
          mapTypeId={mapType}
          onCenterChanged={handleCenterChanged}
        >
          <AnimatePresence>
            {isLoadingMuseos && (
              <motion.div
                key={"loading-message"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingMessage
                  msg={
                    museosMostrados.length === 0
                      ? `No se encontraron museos en el mapa`
                      : "Cargando museos en el mapa y calculando los bounds"
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoadingMuseos &&
            museosDentroDelRadio
              .filter((museo) => museo)
              .map((museo) => (
                <MapMuseoDetailMarker
                  key={getSafeKey(museo)}
                  museo={museo}
                  isActive={activeMuseo?.id === museo.id}
                  onActivate={handleMuseoActivation}
                  isPrincipal={museo.id === idMuseoPrincipal}
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
                museosMostrados={museosDentroDelRadio}
                radioKM={radioKM}
                travelMode={travelMode}
              />
            </>
          )}

          {tipo === "3" && (
            <MapaPopulares museosMostrados={museosDentroDelRadio} />
          )}

          {museosMostrados.length === 1 && (
            <MapaDirections
              userLocation={location.userLocation}
              museosMostrados={museosDentroDelRadio}
              travelMode={travelMode}
            />
          )}

          <MapaCambiarCentro onPlaceSelected={handlePlaceSelected} />

          {/* Marcador del usuario */}
          {location.userLocation?.lat && location.userLocation?.lng && (
            <AdvancedMarker
              key={`user-marker-${location.userLocation.lat}-${location.userLocation.lng}`}
              position={{
                lat: Number(location.userLocation.lat),
                lng: Number(location.userLocation.lng),
              }}
              title={"Tu ubicación"}
            >
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

export default memo(MapMuseo);
