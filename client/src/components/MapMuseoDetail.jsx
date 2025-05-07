import React, { useState, useEffect, useMemo } from "react";
import CustomAdvancedMarker from "./CustomAdvancedMarker";

import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

import { useTheme } from "../context/ThemeProvider";
import { buildImage } from "../utils/buildImage";
import { AnimatePresence, motion } from "framer-motion";
import LoadingMessage from "./LoadingMessage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function MapMuseoDetail({ museo }) {
  const { isDarkMode, isRetroMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const MAP_DETAIL = isRetroMode
    ? import.meta.env.VITE_MAP_RETROMODE_DETAIL_ID
    : isDarkMode
    ? import.meta.env.VITE_MAP_DARKMODE_DETAIL_ID
    : import.meta.env.VITE_MAP_DETAIL_ID;

  const [apiKey, setApiKey] = useState(null);

  // Obtener la API Key de Google Maps desde el backend
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/maps-key`)
      .then((response) => response.json())
      .then((data) => {
        setApiKey(data.key);
      })
      .catch((error) => console.error("Error obteniendo la API key: ", error));
  }, []);

  const mapCenter = useMemo(() => {
    if (!museo?.g_latitud || !museo?.g_longitud) return null;
    return {
      lat: parseFloat(museo.g_latitud),
      lng: parseFloat(museo.g_longitud),
    };
  }, [museo?.g_latitud, museo?.g_longitud]);

  useEffect(() => {
    if (museo?.g_latitud && museo.g_longitud && apiKey) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Simular un tiempo de carga de 1 segundo

      return () => clearTimeout(timeoutId); // Limpiar el timeout si el componente se desmonta
    }
  }, [museo, apiKey]);

  if (!apiKey) return <div>Cargando el mapa...</div>; // Mientras carga la API Key
  return (
    <APIProvider apiKey={apiKey}>
      <div className="map-container">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key={"loading-message"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <LoadingMessage msg="Cargando museo en el mapa" />
            </motion.div>
          )}
        </AnimatePresence>
        <Map
          defaultZoom={19}
          center={mapCenter}
          mapId={MAP_DETAIL}
          key={`${museo?.id}-MAP-DETAIL`}
          disableDefaultUI={true}
          streetViewControl={true}
          zoomControl={true}
        >
          <CustomAdvancedMarker
            key={museo.id}
            lat={mapCenter.lat}
            lng={mapCenter.lng}
            nombre={museo.nombre}
            imagen={buildImage(museo)}
            idMuseo={museo.id}
          />
        </Map>
      </div>
    </APIProvider>
  );
}

export default MapMuseoDetail;
