import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import Icons from "./IconProvider";
const { RiFireFill, CgClose
} = Icons;

function MapaPopulares() {
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoButton, setShowInfoButton] = useState(true);
  // Dia de hoy en formato "dd/mm/yyyy" utc-6
  const [hoy, setHoy] = useState(new Date().toLocaleDateString("es-MX", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, "-"));

  const handleOpenInfo = () => {
    setShowInfo(true);
    setShowInfoButton(false); // Ocultar el botón al abrir la información
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
    setShowInfoButton(true); // Mostrar el botón al cerrar la información
  };

  return (
    <>
      <AnimatePresence>
        {showInfoButton && (
          <motion.button
            type="button"
            className="btn-map"
            id="btn-map-info"
            onClick={handleOpenInfo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.1,
              ease: "easeInOut",
            }}
            key={"map-info-button"}
            title="Ver museos cercanos"
          >
            <RiFireFill />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="map-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{
              duration: 0.1,
              ease: "easeInOut",
              type: "spring",
              stiffness: 50,
            }}
            key={"map-info"}>
            <button className="close-button" onClick={handleCloseInfo}>
              <CgClose />
            </button>
            <h4> Museos Populares</h4>
            <p> <b>Fecha </b>: {hoy} </p>
            <hr />
          </motion.div>
        )}

      </AnimatePresence>
    </>

  )
}

export default MapaPopulares