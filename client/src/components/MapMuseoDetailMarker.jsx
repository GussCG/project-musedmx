import React, { act, useCallback, useState } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";

import { AnimatePresence, motion } from "framer-motion";

import foto_default from "../assets/images/others/museo-main-1.jpg";

import { useNavigate, Link } from "react-router-dom";

import Icons from "./IconProvider";
const { museoIcon } = Icons;

const MapMuseoDetailMarker = React.memo(
  ({ museo, activeMuseo, setActiveMuseo }) => {
    const [localHovered, setLocalHovered] = useState(false);
    const [wasClicked, setWasClicked] = useState(false);

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
      setActiveMuseo(museo);
    }, [museo, setActiveMuseo]);

    const handleMouseLeave = useCallback(() => {
      setLocalHovered(false);
      if (!wasClicked) {
        setActiveMuseo(null);
      }
    }, [wasClicked, setActiveMuseo]);

    const handleClick = useCallback(() => {
      setWasClicked(true);
      setActiveMuseo(museo);
    }, [museo, setActiveMuseo]);

    const handleClose = useCallback(() => {
      setWasClicked(false);
      setActiveMuseo(null);
    }, [setActiveMuseo]);

    const shouldShowInfoWindow =
      activeMuseo?.mus_id === museo.mus_id && (localHovered || wasClicked);

    return (
      <>
        <AdvancedMarker
          position={{
            lat: museo.mus_g_latitud,
            lng: museo.mus_g_longitud,
          }}
          onClick={handleClick}
          onMouseOver={handleMouseEnter}
          onMouseOut={handleMouseLeave}
        >
          <div className="museo-marker-icon">
            <img src={museoIcon} alt="Museo Icon" className="museo-icon" />
          </div>
        </AdvancedMarker>

        {shouldShowInfoWindow && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              key={museo.mus_id}
            >
              <InfoWindow
                position={{
                  lat: museo.mus_g_latitud,
                  lng: museo.mus_g_longitud,
                }}
                onCloseClick={handleClose}
                className="info-window"
              >
                <div className="info-window-content">
                  <img
                    src={museo.mus_foto || foto_default}
                    alt={museo.mus_nombre}
                    className="info-window-image"
                    loading="lazy"
                  />
                  <Link to={`/Museos/${museo.mus_id}`}>{museo.mus_nombre}</Link>
                </div>
              </InfoWindow>
            </motion.div>
          </AnimatePresence>
        )}
      </>
    );
  }
);

export default MapMuseoDetailMarker;
