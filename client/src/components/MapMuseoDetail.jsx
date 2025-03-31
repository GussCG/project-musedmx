import React, { useState, useEffect } from "react";
import CustomAdvancedMarker from "./CustomAdvancedMarker";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

import { useTheme } from "../context/ThemeProvider";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function MapMuseoDetail({ museo }) {
  const { isDarkMode, isRetroMode } = useTheme();

  const MAP_DETAIL = isRetroMode
    ? import.meta.env.VITE_MAP_RETROMODE_DETAIL_ID
    : isDarkMode
    ? import.meta.env.VITE_MAP_DARKMODE_DETAIL_ID
    : import.meta.env.VITE_MAP_DETAIL_ID;

  // Obtener la informacion del museo
  const museoInfo = {
    id: museo.id,
    nombre: museo.nombre,
    horarios: {
      Lunes: museo.horarios.Lunes,
      Martes: museo.horarios.Martes,
      Miercoles: museo.horarios.Miercoles,
      Jueves: museo.horarios.Jueves,
      Viernes: museo.horarios.Viernes,
      Sabado: museo.horarios.Sabado,
      Domingo: museo.horarios.Domingo,
    },
    img: museo.img,
    calificacion: museo.calificacion,
    costo: museo.costo,
    coords: {
      lat: museo.coords.lat,
      lng: museo.coords.lng,
    },
  };

  // Coordenadas del museo
  const museoCoords = museoInfo.coords;

  // Obtener la API Key de Google Maps desde el backend
  const [apiKey, setApiKey] = useState(null);
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/maps-key`)
      .then((response) => response.json())
      .then((data) => {
        setApiKey(data.key);
      })
      .catch((error) => console.error("Error obteniendo la API key: ", error));
  }, []);

  if (!apiKey) return <div>Cargando el mapa...</div>; // Mientras carga la API Key
  return (
    <APIProvider apiKey={apiKey}>
      <div className="map-container">
        <Map defaultZoom={17} center={museoCoords} mapId={MAP_DETAIL}>
          <CustomAdvancedMarker
            key={museo.id}
            lat={museo.coords.lat}
            lng={museo.coords.lng}
            nombre={museo.nombre}
            imagen={museo.img}
            idMuseo={museo.id}
          />
        </Map>
      </div>
    </APIProvider>
  );
}

export default MapMuseoDetail;
