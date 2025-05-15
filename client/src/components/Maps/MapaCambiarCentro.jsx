import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMap } from "@vis.gl/react-google-maps";
import Icons from "../Other/IconProvider";
import LoadingMessage from "./LoadingMessage";
const { TbLocationPin, IoSearch, IoIosArrowBack } = Icons;

function MapaCambiarCentro({ onPlaceSelected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteRef = useRef(null);
  const containerRef = useRef(null);
  const map = useMap();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const calculateBounds = (location) => {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(location);
    map.fitBounds(bounds);
    map.setZoom(15);
  };

  useEffect(() => {
    if (!isOpen || !window.google || !containerRef.current) return;

    const initAutocomplete = async () => {
      try {
        setIsLoading(true);
        await google.maps.importLibrary("places");

        const placeAutocomplete =
          new google.maps.places.PlaceAutocompleteElement();

        // Configurar las restricciones
        placeAutocomplete.setAttribute(
          "componentRestrictions",
          '{"country": ["MX"]}'
        );
        // placeAutocomplete.setAttribute("types", '["address"]');

        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(placeAutocomplete);
        autocompleteRef.current = placeAutocomplete;

        placeAutocomplete.addEventListener("gmp-select", async (event) => {
          const placePrediction = event.placePrediction;
          const place = placePrediction.toPlace();

          await place.fetchFields({
            fields: ["displayName", "formattedAddress", "location"],
          });

          const name = place.displayName?.text || "";
          const location = place.location;

          if (location) {
            const placeData = {
              name,
              geometry: {
                location: {
                  lat: location.lat,
                  lng: location.lng,
                },
              },
            };
            // Calcular los límites del mapa
            calculateBounds(location);

            // Llamar a la función onPlaceSelected con los datos del lugar
            onPlaceSelected(placeData);
          }
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAutocomplete();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
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
            <div ref={containerRef} className="autocomplete-container" />
            {isLoading && <LoadingMessage msg={"Buscando..."} />}
            <IoSearch />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MapaCambiarCentro;
