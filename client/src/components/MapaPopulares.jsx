import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import foto_default from "../assets/images/others/museo-main-1.jpg";

import Icons from "./IconProvider";
const { RiFireFill, CgClose } = Icons;

const TEMATICAS = {
  1: "Antropología",
  2: "Arte",
  3: "Arte Alternativo",
  4: "Arqueología",
  5: "Ciencia y Tecnología",
  6: "Especializado",
  7: "Historia",
  8: "Otro",
};

function MapaPopulares({ museosMostrados }) {
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoButton, setShowInfoButton] = useState(true);
  // Dia de hoy en formato "dd/mm/yyyy" utc-6
  const [hoy, setHoy] = useState(
    new Date()
      .toLocaleDateString("es-MX", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-")
  );

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
            key={"map-info"}
          >
            <button className="close-button" onClick={handleCloseInfo}>
              <CgClose />
            </button>
            <h4> Museos Populares</h4>
            <p>
              {" "}
              <b>Fecha </b>: {hoy}{" "}
            </p>
            <hr />
            <ul className="museos-list">
              {museosMostrados.map((museo, index) => (
                <motion.li
                  key={museo.mus_id}
                  className="museo-list-item"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 50,
                  }}
                >
                  <div className="museo-list-item-img">
                    <img
                      src={museo.mus_foto || foto_default}
                      alt={museo.mus_nombre}
                    />
                    <div className="museo-list-item-rank">
                      <p>{index + 1}</p>
                    </div>
                  </div>
                  <div className="museo-list-item-info">
                    <div className="museo-list-item-name">
                      <Link to={`/Museos/${museo.mus_id}`}>
                        <p>{museo.mus_nombre}</p>
                      </Link>
                    </div>
                    <div className="museo-list-item-tematica">
                      <p>{TEMATICAS[museo.mus_tematica]}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MapaPopulares;
