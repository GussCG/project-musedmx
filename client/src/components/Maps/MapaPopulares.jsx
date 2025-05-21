import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import foto_default from "../../assets/images/others/museo-main-1.jpg";
import Icons from "../Other/IconProvider";
const { RiFireFill, CgClose } = Icons;
import { TEMATICAS } from "../../constants/catalog";
import { buildImage } from "../../utils/buildImage";
import FavoritoButton from "../Museo/FavoritoButton";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import { useAuth } from "../../context/AuthProvider";
import MuseoItem from "../Museo/MuseoItem";

function MapaPopulares({ museosMostrados }) {
  const { user } = useAuth();
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
                <MuseoItem key={museo.id} museo={museo} index={index} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MapaPopulares;
