import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMap } from "@vis.gl/react-google-maps";

import Icons from "./IconProvider";
const { TbLocationPin, CgClose, IoSearch, IoIosArrowBack } = Icons;

function MapaCambiarCentro({ onPlaceSelected }) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const autocompleteRef = useRef(null);
  const map = useMap();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setInputValue("");
    }
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
    if (!isOpen || !window.google || !inputRef.current) return;

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
  }, [isOpen, onPlaceSelected]);

  return (
    <div className="map-change-location-container">
      <button
        id="btn-change-location"
        onClick={toggleDropdown}
        type="button"
        title="Cambiar ubicación"
      >
        <TbLocationPin />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
        >
          {" "}
          <IoIosArrowBack />
        </motion.div>
      </button>
      <AnimatePresence mode="popLayout">
        {isOpen && (
          <motion.div
            layout
            className="map-change-location-dropdown"
            key={"map-change-location-dropdown"}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                type: "tween",
                ease: "easeOut",
                duration: 0.2,
              },
            }}
            exit={{
              opacity: 0,
              x: 20,
              transition: {
                ease: "easeIn",
                duration: 0.3,
              },
            }}
          >
            <input
              type="text"
              placeholder="Dirección, Código Postal o Lugar"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              ref={inputRef}
            ></input>
            <IoSearch />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MapaCambiarCentro;
