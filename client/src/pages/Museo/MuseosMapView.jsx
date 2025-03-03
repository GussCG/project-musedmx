import React, { useState, useRef, useEffect } from "react";
import MapMuseo from "../../components/MapMuseo";

import { APIProvider } from "@vis.gl/react-google-maps";

import Icons from "../../components/IconProvider";
const { buscarimg } = Icons;

// Para obtener la API de Google Maps
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Dependiendo del titulo se muestra el radio de busqueda
// En Ver Todos y en Populares no se muestra el radio
function MuseosMapView({ titulo, MuseosMostrados, tipo }) {
  console.log(tipo);
  // Obtener la API Key de Google Maps desde el backend
  const [apiKey, setApiKey] = useState(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  useEffect(() => {
    const storedAPIKey = localStorage.getItem("GOOGLE_MAPS_API_KEY");
    if (storedAPIKey) {
      setApiKey(storedAPIKey);
      setIsApiLoaded(true);
    } else {
      fetch(`${BACKEND_URL}/api/maps-key`)
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("GOOGLE_MAPS_API_KEY", data.key);
          setApiKey(data.key);
          setIsApiLoaded(true);
        })
        .catch((error) =>
          console.error("Error obteniendo la API key: ", error)
        );
    }
  }, []);

  // Para el manejo del valor del rango
  const [rangoRadio, setRangoRadio] = useState(0.1);
  const radioKM = rangoRadio * 1000;

  // Para el autocomplete
  const [ubicacion, setUbicacion] = useState("");
  const [ubicacionCoords, setUbicacionCoords] = useState(null);
  const inputRef = useRef(null);

  // Esperar a que la API cargue correctamente
  useEffect(() => {
    if (isApiLoaded && window.google.maps.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["establishment"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setUbicacion(place.formatted_address);
          setUbicacionCoords({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    }
  }, [isApiLoaded, window.google]);

  if (!apiKey) return <div>Cargando el mapa...</div>; // Mientras carga la API Key

  // Funcion para manejar el cambio del rango en el input range
  const handleRangeChange = (e) => {
    setRangoRadio(e.target.value);
  };

  return (
    <div id="museos-map-view">
      <section className="museos-map-nav">
        <div id="museos-form-nav">
          <div className="museos-nav-section">
            <button type="button" disabled>
              <img src={buscarimg} alt="Buscar" />
            </button>
            <input
              ref={inputRef}
              type="text"
              id="museos-txt-ubicacion"
              placeholder="Introduce tu ubicación"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </div>
          {tipo === "2" ? (
            <div className="museos-nav-section range-section">
              <label htmlFor="museos-range-ubicacion" id="frm-range-ubicacion">
                <b>Tamaño de Radio:</b>
                <br /> <output>{rangoRadio}</output> km
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={rangoRadio}
                id="museos-range-ubicacion"
                name="museos-range-ubicacion"
                placeholder="Rango de Ubicación"
                list="museos-range-ubicacion-list"
                onChange={handleRangeChange}
                required
              />
            </div>
          ) : null}
        </div>
      </section>
      <section className="museos-map-container">
        <APIProvider apiKey={apiKey} libraries={["places"]}>
          <MapMuseo
            radioKM={radioKM}
            museosMostrados={MuseosMostrados}
            ubicacionCoords={ubicacionCoords}
            place={ubicacion}
            tipo={tipo}
          />
        </APIProvider>
      </section>
    </div>
  );
}

export default MuseosMapView;
