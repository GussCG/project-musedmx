import React, { useState, useEffect, useRef, use, useCallback } from "react";

import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import Circle from "./Circle";
import CustomAdvancedMarker from "./CustomAdvancedMarker";
// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAP_DETAIL = import.meta.env.VITE_MAP_DETAIL_ID;

function MapMuseo({ radioKM, museosMostrados, ubicacionCoords, tipo }) {
  const [mapCenter, setMapCenter] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const map = useMap();
  // Obtener la ubicación del usuario
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    if (!ubicacionCoords) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          if (!userInteracted) {
            setMapCenter(location);
          }
        },
        (error) => {
          const defaultLocation = { lat: 19.4326, lng: -99.1332 };
          setUserLocation(defaultLocation);
          if (!userInteracted) {
            setMapCenter(defaultLocation);
          }
        }
      );
    } else {
      // Si se proporcionan coordenadas (nueva búsqueda)
      const coords = {
        lat:
          typeof ubicacionCoords.lat === "string"
            ? Number(ubicacionCoords.lat)
            : ubicacionCoords.lat,
        lng:
          typeof ubicacionCoords.lng === "string"
            ? Number(ubicacionCoords.lng)
            : ubicacionCoords.lng,
      };
      setUserLocation(coords);
      setMapCenter(coords); // Forzar el movimiento del mapa
      setUserInteracted(false); // Restablecer la interacción del usuario
    }
  }, [ubicacionCoords]); // Dependencia: ubicacionCoords

  useEffect(() => {
    if (userLocation && !userInteracted) {
      // Centrar al cambiar userLocation, si no hay interacción
      setMapCenter(userLocation);
    }
  }, [userLocation, userInteracted]);

  const handleCenterChanged = () => {
    if (map) {
      const newCenter = map.getCenter();
      if (newCenter) {
        setMapCenter({
          lat: newCenter.lat(),
          lng: newCenter.lng(),
        });
        setUserInteracted(true);
      }
    }
  };

  return (
    <div className="map-container">
      {userLocation && (
        <Map
          defaultZoom={17}
          center={mapCenter}
          mapId={MAP_DETAIL}
          onCenterChanged={handleCenterChanged}
        >
          {museosMostrados.map((museo) => (
            <CustomAdvancedMarker
              key={museo.id}
              lat={museo.coords.lat}
              lng={museo.coords.lng}
              nombre={museo.nombre}
              imagen={museo.img}
              idMuseo={museo.id}
            />
          ))}
          {tipo === "2" ? (
            <Circle
              center={userLocation}
              radius={radioKM}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.5,
                strokeWeight: 3,
                fillColor: "#FF0000",
                fillOpacity: 0.1,
              }}
            />
          ) : null}
          {/* Marcador del usuario */}
          <AdvancedMarker position={userLocation} />
        </Map>
      )}
    </div>
  );
}

export default MapMuseo;
