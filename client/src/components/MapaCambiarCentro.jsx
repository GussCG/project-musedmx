import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMap } from "@vis.gl/react-google-maps";

import Icons from "./IconProvider";
const { TbLocationPin, CgClose, IoSearch } = Icons;

function MapaCambiarCentro({ onPlaceSelected }) {
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoButton, setShowInfoButton] = useState(true);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const autocompleteRef = useRef(null);
  const map = useMap();

  const handleOpenInfo = () => {
    setShowInfo(true);
    setShowInfoButton(false); // Ocultar el botón al abrir la información
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
    setShowInfoButton(true); // Mostrar el botón al cerrar la información
    setInputValue(""); // Limpiar el valor del input al cerrar
  };

  const handlePlaceSelected = (place) => {
    if (!place) return;

    const placeData = {
      name: place.name || "",
      geometry: {
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      },
    };

    onPlaceSelected(placeData);
    setInputValue(placeData.name); // Actualizar el valor del input con el nombre del lugar seleccionado
  };

  useEffect(() => {
    if (!showInfo || !window.google || !inputRef.current) return;

    async function initAutocomplete() {
      try {
        autocompleteRef.current =
          new google.maps.places.PlaceAutocompleteElement({
            inputElement: inputRef.current,
            componentRestrictions: { country: "MX" },
            fetchFields: ["place_id", "geometry", "name"],
            types: ["address"],
            bounds: new google.maps.LatLngBounds(
              new google.maps.LatLng(19.4326, -99.1332), // Ciudad de México
              new google.maps.LatLng(19.4326, -99.1332) // Ciudad de México
            ),
          });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.value;
          if (!place.geometry) {
            console.error("No geometry found for the selected place.");
            return;
          }
          handlePlaceSelected(place);
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }
    }

    initAutocomplete();

    return () => {
      if (autocompleteRef.current) {
        autocompleteRef.current.unbindAllListeners();
      }
    };
  }, [showInfo, onPlaceSelected]);

  return (
    <>
      <AnimatePresence>
        {showInfoButton && (
          <motion.button
            type="button"
            className="btn-map"
            id="btn-map-change-location"
            onClick={handleOpenInfo}
            transition={{
              duration: 0.1,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.1 }}
            key={"map-info-button"}
            title="Cambiar ubicación"
          >
            <TbLocationPin />
          </motion.button>
        )}
        {showInfo && (
          <motion.div
            className="map-change-location"
            initial={{ x: 250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 250, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 50 }}
            key={"map-info"}
          >
            <button>
              <IoSearch />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Dirección, Ciudad o Código Postal"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <button
              className="close-button"
              onClick={handleCloseInfo}
              title="Cerrar"
            >
              <CgClose />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MapaCambiarCentro;
