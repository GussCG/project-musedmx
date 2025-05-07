import React, { useState, useEffect, useMemo } from "react";
import CustomAdvancedMarker from "./CustomAdvancedMarker";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

import { useTheme } from "../context/ThemeProvider";
import buildImage from "../utils/buildImage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function MapMuseoDetail({ museo }) {
  const { isDarkMode, isRetroMode } = useTheme();

  const MAP_DETAIL = isRetroMode
    ? import.meta.env.VITE_MAP_RETROMODE_DETAIL_ID
    : isDarkMode
    ? import.meta.env.VITE_MAP_DARKMODE_DETAIL_ID
    : import.meta.env.VITE_MAP_DETAIL_ID;

  const [museoInfo, setMuseoInfo] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!museo) {
      setMuseoInfo(null);
      setLoading(false);
      return;
    } // Si no hay museo, no hacemos nada

    try {
      const info = {
        id: museo.mus_id,
        nombre: museo.mus_nombre,
        coords: {
          lat: museo.mus_g_latitud,
          lng: museo.mus_g_longitud,
        },
        img: buildImage(museo),
      };
      setLoading(false);

      if (isNaN(info.coords.lat) || isNaN(info.coords.lng)) {
        setError("Coordenadas no válidas");
        return;
      }
      setMuseoInfo(info);
      setError(null);
    } catch (error) {
      setError("Error al procesar la información del museo: " + error.message);
      setMuseoInfo(null);
    } finally {
      setLoading(false);
    }
  }, [museo]);

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
    if (!museoInfo?.coords) return null;
    return museoInfo.coords;
  }, [museoInfo?.coords]);

  console.log(mapCenter);

  if (!apiKey) return <div>Cargando el mapa...</div>; // Mientras carga la API Key
  return (
    <APIProvider apiKey={apiKey}>
      <div className="map-container">
        <Map
          defaultZoom={17}
          center={mapCenter}
          mapId={MAP_DETAIL}
          key={`${museoInfo?.id}-MAP-DETAIL`}
        >
          <CustomAdvancedMarker
            key={museoInfo.id}
            lat={mapCenter.lat}
            lng={mapCenter.lng}
            nombre={museoInfo.nombre}
            imagen={museoInfo.img}
            idMuseo={museoInfo.id}
          />
        </Map>
      </div>
    </APIProvider>
  );
}

export default MapMuseoDetail;
