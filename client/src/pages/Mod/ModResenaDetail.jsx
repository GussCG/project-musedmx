import { AnimatePresence, motion } from "framer-motion";
import LightBox from "../../components/Other/LightBox";
import useLightBox from "../../hooks/Other/useLightBox";
import ModRechazar from "./ModRechazar";
import { useState } from "react";
import PopupPortal from "../../components/Other/PopupPortal";
import LightBoxPortal from "../../components/Other/LightBoxPortal";
import { useResena } from "../../hooks/Resena/useResena";
import { useParams, useNavigate } from "react-router-dom";
import { formatearFechaSinHora } from "../../utils/formatearFechas";
import { useResenaMods } from "../../hooks/Resena/useResenaMods";
import { useAuth } from "../../context/AuthProvider";
import ToastMessage from "../../components/Other/ToastMessage";

function ModResenaDetail() {
  const { user } = useAuth();
  const modCorreo = user?.usr_correo || "";
  const { resId } = useParams();
  const navigate = useNavigate();

  const { resena, loading, error } = useResena({ resId });

  const { aprobarResena } = useResenaMods();

  const imagenesCompletas = [
    ...(resena?.fotos || []),
    ...(resena?.res_foto_entrada ? [resena.res_foto_entrada] : []),
  ];

  const lightbox = useLightBox(imagenesCompletas || []);
  const [showRechazarPop, setShowRechazarPop] = useState(false);

  const handleAprobarResena = (resId, modCorreo) => async () => {
    try {
      const response = await aprobarResena(resId, modCorreo);
      if (response.success) {
        ToastMessage({
          tipo: "success",
          mensaje: "Reseña aprobada exitosamente.",
          position: "top-right",
        });
        navigate(`/Mod/VerResenas/${resena.mus_id}`);
      }
    } catch (error) {
      console.error("Error al aprobar la reseña:", error);
      ToastMessage({
        tipo: "error",
        mensaje: "Error al aprobar la reseña. Inténtalo de nuevo.",
        position: "top-right",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {imagenesCompletas && (
        <LightBoxPortal>
          <LightBox
            images={imagenesCompletas}
            isOpen={lightbox.isOpen}
            currentIndex={lightbox.currentIndex}
            closeLightBox={lightbox.closeLightBox}
            goToPrev={lightbox.goToPrev}
            goToNext={lightbox.goToNext}
          />
        </LightBoxPortal>
      )}
      <main id="aprobar-res-main">
        <h1>
          {resena?.res_aprobado === 1 ? "Detalles de reseña" : "Aprobar Reseña"}
        </h1>
        <div className="aprobar-res-container">
          <section className="user-info">
            <p>
              <b>Usuario</b>
              {resena?.visitas_vi_usr_correo}
            </p>
            <p>
              <b>Fecha de Publicación</b>
              {formatearFechaSinHora(resena?.visitas_vi_fechahora)}
            </p>
            <p>
              <b>Calificación</b>
              {resena?.res_calif_estrellas}
            </p>
          </section>
          <section className="user-resena-container">
            <div className="user-resena-cf">
              <p className="user-resena">
                <b>Comentario</b>:{" "}
                {resena?.res_comentario || "No hay comentario."}
              </p>
              {resena?.res_foto_entrada && (
                <div className="user-resena-entrada">
                  <h2>Entrada/Boleto</h2>
                  <img
                    src={resena.res_foto_entrada}
                    alt="Foto de entrada"
                    onClick={() =>
                      lightbox.openLightBox(imagenesCompletas.length - 1)
                    }
                  />
                </div>
              )}
            </div>
            {resena?.fotos && resena.fotos.length > 0 && (
              <div className="user-resena-imgs-container">
                {resena?.fotos.map((img, index) => (
                  <div className="user-resena-img" key={index}>
                    <img
                      src={img.foto}
                      alt={`Imagen ${index + 1}`}
                      onClick={() => lightbox.openLightBox(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="aprobar-res-buttons">
            {resena?.res_aprobado === 1 ? (
              <button
                type="button"
                className="button"
                onClick={() => navigate(`/Mod/VerResenas/${resena.mus_id}`)}
              >
                Volver a Reseñas
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="button"
                  onClick={handleAprobarResena(resId, modCorreo)}
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => setShowRechazarPop(true)}
                >
                  Rechazar
                </button>
              </>
            )}
          </section>
        </div>
      </main>
      <AnimatePresence>
        {showRechazarPop && (
          <PopupPortal>
            <ModRechazar
              key={`rechazar-pop`}
              onClose={() => setShowRechazarPop(false)}
            />
          </PopupPortal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ModResenaDetail;
