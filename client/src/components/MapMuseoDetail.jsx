import React, { useState, useEffect } from "react";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import MuseoCard from "./MuseoCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MAP_DETAIL = import.meta.env.VITE_MAP_DETAIL_ID;

function MapMuseoDetail({ museo }) {
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

  // Para el infoWindow
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

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
        <Map defaultZoom={17} defaultCenter={museoCoords} mapId={MAP_DETAIL}>
          <AdvancedMarker
            position={museoCoords}
            onClick={() => setInfoWindowOpen(true)}
          >
            <Pin></Pin>
          </AdvancedMarker>

          {infoWindowOpen && (
            <InfoWindow
              position={museoCoords}
              onCloseClick={() => setInfoWindowOpen(false)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -30),
              }}
            >
              <div className="info-window">
                <img src={museoInfo.img} alt={museoInfo.nombre} />
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}

export default MapMuseoDetail;
