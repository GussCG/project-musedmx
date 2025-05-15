import React, { useCallback, useEffect, useState } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Icons from "../Other/IconProvider";
import { buildImage } from "../../utils/buildImage";
import FavoritoButton from "../Museo/FavoritoButton";
const { museoIcon, CgClose, FaStar } = Icons;

const MapMuseoDetailMarker = React.memo(({ museo, isActive, onActivate }) => {
  const [wasClicked, setWasClicked] = useState(false);

  useEffect(() => {
    if (!museo) return;
  }, [museo]);

  const handleMarkerClick = useCallback(
    (e) => {
      if (e && typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }
      setWasClicked(true);
      onActivate(museo);
    },
    [museo, onActivate]
  );

  const handleMouseEnter = useCallback(() => {
    if (!wasClicked) {
      onActivate(museo);
    }
  }, [museo, onActivate, wasClicked]);

  const handleMouseLeave = useCallback(() => {
    if (!wasClicked) {
      onActivate(null);
    }
  }, [wasClicked, onActivate]);

  const handleClose = useCallback(
    (e) => {
      e?.stopPropagation();
      setWasClicked(false);
      onActivate(null);
    },
    [onActivate]
  );

  return (
    museo && (
      <>
        <AdvancedMarker
          position={{
            lat: museo.g_latitud,
            lng: museo.g_longitud,
          }}
          onClick={handleMarkerClick}
          onMouseOver={handleMouseEnter}
          onMouseOut={handleMouseLeave}
        >
          <div className="museo-marker-icon">
            <img src={museoIcon} alt="Museo Icon" className="museo-icon" />
          </div>
        </AdvancedMarker>

        <AnimatePresence>
          {isActive && (
            <div className="info-window-container">
              <InfoWindow
                position={{
                  lat: museo.g_latitud,
                  lng: museo.g_longitud,
                }}
                onCloseClick={handleClose}
                className="info-window"
                headerDisabled={true}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  key={museo.id}
                >
                  <button
                    className="info-window-close-btn"
                    onClick={handleClose}
                    aria-label="Cerrar ventana"
                  >
                    <CgClose />
                  </button>
                  <div className="info-window-content">
                    <div className="info-window-img">
                      <img
                        src={buildImage(museo)}
                        alt={museo.nombre}
                        className="info-window-image"
                        loading="lazy"
                      />

                      <div className="info-window-img-overlay">
                        <div className="info-window-img-rate">
                          <span className="info-window-img-rate-text">
                            {museo.calificacion || 3.5}
                          </span>
                          <span className="info-window-img-rate-icon">
                            <FaStar />
                          </span>
                        </div>
                        <FavoritoButton />
                      </div>
                    </div>
                    <div className="info-window-title">
                      <Link to={`/Museos/${museo.id}`}>{museo.nombre}</Link>
                    </div>
                  </div>
                </motion.div>
              </InfoWindow>
            </div>
          )}
        </AnimatePresence>
      </>
    )
  );
});

export default MapMuseoDetailMarker;
