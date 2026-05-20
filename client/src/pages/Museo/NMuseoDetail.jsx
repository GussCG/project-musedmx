import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/pages/NMuseoDetails.scss";

import MuseoGallery from "../../components/Museo/MuseoGallery";
import {
  procesarCalificaciones,
  procesarServicios,
} from "../../utils/calificacionesEncuesta";
import { useMuseo } from "../../hooks/Museo/useMuseo";
import useRespuestasTotales from "../../hooks/Encuesta/useRespuestasTotales";
import { useMuseosCercanos } from "../../hooks/Museo/useMuseosCercanos";
import useResenaMuseo from "../../hooks/Resena/useResenaMuseo";
import MuseoHero from "../../components/Museo/MuseoHero";
import MuseoDescription from "../../components/Museo/MuseoDescription";
import MuseoHUS from "../../components/Museo/MuseoHUS";
import ResenasRecientesMuseo from "../../components/Museo/ResenasRecientesMuseo";
import MuseoSimilares from "../../components/Museo/MuseoSimilares";
import { useParams } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import { TEMATICAS } from "../../constants/catalog.js";

function NMuseoDetail() {
  // FETCH DE MUSEO
  const { museoId } = useParams();
  const museoIdNumber = parseInt(museoId, 10);
  const { museo: museoInfo } = useMuseo(museoIdNumber);
  const { isDarkMode } = useTheme();

  const { loading: respuestasLoading, fetchRespuestasTotales } =
    useRespuestasTotales();

  const [respuestasTotales, setRespuestasTotales] = useState([]);
  const [serviciosTotales, setServiciosTotales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchRespuestasTotales({
          encuestaId: 1,
          museoId: museoIdNumber,
        });
        setRespuestasTotales(response.respuestas);
        setServiciosTotales(response.servicios);
        console.log("Respuestas totales:", response.respuestas);
        console.log("Servicios totales:", response.servicios);
      } catch (error) {
        console.error("Error fetching respuestas totales:", error);
      }
    };
    fetchData();
  }, [museoIdNumber]);

  const { museos: museosCercanos } = useMuseosCercanos({
    museoId: museoIdNumber,
    top_n: 10,
  });
  const [calificaciones, setCalificaciones] = useState({});
  const [serviciosOpacidad, setServiciosOpacidad] = useState({});

  useEffect(() => {
    if (!respuestasLoading && respuestasTotales && serviciosTotales) {
      const califs = procesarCalificaciones(respuestasTotales);
      const serv = procesarServicios(serviciosTotales);

      setCalificaciones(califs);
      setServiciosOpacidad(serv);
    }
  }, [respuestasLoading, respuestasTotales, serviciosTotales]);

  const [paginaResenas, setPaginaResenas] = useState(1);

  const cargarSiguientePagina = () => {
    if (!resenasLoading && totalPaginas > paginaResenas) {
      setPaginaResenas((prev) => prev + 1);
    }
  };

  const {
    resenas,
    totalPaginas,
    loading: resenasLoading,
  } = useResenaMuseo({
    museoId: museoIdNumber,
    pagina: paginaResenas,
  });

  const tematicaId = museoInfo?.tematica;
  const tematicaData = TEMATICAS[tematicaId] || {};

  const colores = isDarkMode
    ? tematicaData.museoDetailBGColorsDM
    : tematicaData.museoDetailBGColors;

  useEffect(() => {
    if (!colores) return;

    const htmlElement = document.documentElement;

    htmlElement.style.setProperty("--bg-grad-color-1", colores.background_1);
    htmlElement.style.setProperty("--bg-grad-color-2", colores.background_2);

    return () => {
      htmlElement.style.removeProperty("--bg-grad-color-1");
      htmlElement.style.removeProperty("--bg-grad-color-2");
    };
  }, [colores]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`museo-detail-${museoId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut", type: "tween" }}
      >
        <MuseoHero
          museo={museoInfo}
          redesSociales={museoInfo.redes_sociales}
          horario={museoInfo.horarios}
        />
        <MuseoDescription museo={museoInfo} calificaciones={calificaciones} />
        <MuseoHUS
          museo={museoInfo}
          horarios={museoInfo.horarios}
          servicios={serviciosOpacidad}
          ubicacion={museoInfo}
          MuseosCercanos={museosCercanos}
        />
        <MuseoGallery images={museoInfo.galeria} />
        <MuseoSimilares museoId={museoInfo.id} />
        <ResenasRecientesMuseo
          resenas={resenas}
          museoId={museoInfo.id}
          hasMore={totalPaginas > paginaResenas}
          loading={resenasLoading}
          nextPage={cargarSiguientePagina}
          museo={museoInfo}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default NMuseoDetail;
