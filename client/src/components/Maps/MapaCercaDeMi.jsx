import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import Icons from "../Other/IconProvider";
const { CgClose, TbRadar2 } = Icons;
import foto_default from "../../assets/images/others/museo-main-1.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { buildImage } from "../../utils/buildImage";
import { TEMATICAS } from "../../constants/catalog";
import FavoritoButton from "../Museo/FavoritoButton";

function CercaDeMi({ userLocation, museosMostrados, radioKM, travelMode }) {
  const [museosConTiempos, setMuseosConTiempos] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoButton, setShowInfoButton] = useState(true);

  const timeLabels = {
    WALKING: "Caminando",
    BICYCLING: "En Bicicleta",
    DRIVING: "En Auto",
    TRANSIT: "En Transporte Público",
  };

  const calcularTiempoEstimado = useCallback((distancia, travelMode) => {
    const velocidades = {
      WALKING: 5, // km/h
      BICYCLING: 15, // km/h
      DRIVING: 40, // km/h
      TRANSIT: 25, // km/h
    };

    const velocidad = velocidades[travelMode] || 5; // km/h por defecto
    const horas = distancia / velocidad;
    const minutos = Math.round(horas * 60);

    return Math.max(1, minutos); // Asegurarse de que el tiempo mínimo sea 1 minuto
  }, []);

  // Calcular la distancia entre dos puntos geográficos
  // usando la fórmula del haversine
  const calcularDistancia = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
  }, []);

  const formatearDistancia = useCallback((distancia) => {
    const metros = distancia * 1000; // Convertir a metros
    return metros < 1000
      ? `${metros.toFixed(0)} m`
      : `${(metros / 1000).toFixed(1)} km`;
  }, []);

  const museosFiltrados = useMemo(() => {
    if (!userLocation || !museosMostrados) return [];

    return museosMostrados
      .map((museo) => {
        const distancia = calcularDistancia(
          userLocation.lat,
          userLocation.lng,
          museo.g_latitud,
          museo.g_longitud
        );
        return {
          ...museo,
          distancia,
        };
      })
      .filter((museo) => museo.distancia <= radioKM / 1000) // Filtrar museos dentro del radio
      .sort((a, b) => a.distancia - b.distancia); // Ordenar por distancia
  }, [userLocation, museosMostrados, radioKM]);

  useEffect(() => {
    const calcularTiempos = () => {
      const actualizados = museosFiltrados.map((museo) => ({
        ...museo,
        tiempoEstimado: calcularTiempoEstimado(museo.distancia, travelMode),
      }));
      setMuseosConTiempos(actualizados);
    };
    calcularTiempos();
  }, [museosFiltrados, travelMode, calcularTiempoEstimado]);

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
            <TbRadar2 />
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
            <h4>{`Museos Cerca`}</h4>
            <p>
              <b>Museos encontrados</b>: {museosFiltrados.length}
            </p>
            <p>
              <b>Radio</b>: {radioKM} m
            </p>

            <hr />

            <ul className="museos-list">
              {museosConTiempos.map(
                (museo) =>
                  museo.tematica && (
                    <motion.li
                      key={museo.id}
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
                      style={{
                        backgroundColor: `${
                          TEMATICAS[museo.tematica].museoCardColors.background
                        }`,
                      }}
                    >
                      <div className="museo-list-item-img">
                        <Link to={`/Museos/${museo.id}`}>
                          <img
                            src={museo.img || foto_default}
                            alt={museo.nombre}
                          />
                        </Link>
                        <div
                          className="museo-list-item-distance"
                          style={{
                            backgroundColor: `${
                              TEMATICAS[museo.tematica].museoCardColors
                                .backgroundImage
                            }`,
                          }}
                        >
                          <p>{formatearDistancia(museo.distancia)}</p>
                        </div>
                        <FavoritoButton />
                      </div>
                      <div className="museo-list-item-info">
                        <div className="museo-list-item-name">
                          <Link to={`/Museos/${museo.id}`}>
                            <p
                              style={{
                                color: `${
                                  TEMATICAS[museo.tematica].museoCardColors
                                    .header
                                }`,
                              }}
                            >
                              {museo.nombre}
                            </p>
                          </Link>
                        </div>
                        <div className="museo-list-item-tiempo">
                          <p
                            style={{
                              color: `${
                                TEMATICAS[museo.tematica].museoCardColors.text
                              }`,
                            }}
                          >
                            {museo.tiempoEstimado} min -{" "}
                            {timeLabels[travelMode]}
                          </p>
                        </div>
                        {museo.tematica && (
                          <>
                            <div className="museo-list-tematica-icon">
                              <img
                                src={TEMATICAS[museo.tematica].icon}
                                alt=""
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </motion.li>
                  )
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CercaDeMi;
