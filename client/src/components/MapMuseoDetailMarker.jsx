import React, { useCallback, useEffect, useState } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { AnimatePresence, motion } from "framer-motion";
import foto_default from "../assets/images/others/museo-main-1.jpg";
import { Link } from "react-router-dom";
import Icons from "./IconProvider";

const { museoIcon, CgClose, FaStar } = Icons;

const MapMuseoDetailMarker = React.memo(({ museo, isActive, onActivate }) => {
  const [wasClicked, setWasClicked] = useState(false);

  if (!museo) return null;

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
    <>
      <AdvancedMarker
        position={{
          lat: museo.mus_g_latitud,
          lng: museo.mus_g_longitud,
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
                lat: museo.mus_g_latitud,
                lng: museo.mus_g_longitud,
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
                key={museo.mus_id}
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
                      src={museo.mus_foto || foto_default}
                      alt={museo.mus_nombre}
                      className="info-window-image"
                      loading="lazy"
                    />

                    <div className="info-window-img-overlay">
                      <div className="info-window-img-rate">
                        <span className="info-window-img-rate-text">
                          {museo.mus_calificacion || 3.5}
                        </span>
                        <span className="info-window-img-rate-icon">
                          <FaStar />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="info-window-title">
                    <Link to={`/Museos/${museo.mus_id}`}>
                      {museo.mus_nombre}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </InfoWindow>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});

export default MapMuseoDetailMarker;
