import { AnimatePresence, motion } from "framer-motion";
import LightBox from "../../components/LightBox";
import useLightBox from "../../hooks/useLightBox";
import ModRechazar from "./ModRechazar";
import { useState } from "react";

function ModResenaDetail() {
  const galeria = [
    {
      src: "https://th.bing.com/th/id/OIP.XBICrQ8PArULwN_UwchP2gHaE8?cb=iwc1&rs=1&pid=ImgDetMain",
    },
    {
      src: "https://th.bing.com/th/id/OIP.XBICrQ8PArULwN_UwchP2gHaE8?cb=iwc1&rs=1&pid=ImgDetMain",
    },
    {
      src: "https://th.bing.com/th/id/OIP.XBICrQ8PArULwN_UwchP2gHaE8?cb=iwc1&rs=1&pid=ImgDetMain",
    },
    {
      src: "https://th.bing.com/th/id/OIP.XBICrQ8PArULwN_UwchP2gHaE8?cb=iwc1&rs=1&pid=ImgDetMain",
    },
    {
      src: "https://th.bing.com/th/id/OIP.XBICrQ8PArULwN_UwchP2gHaE8?cb=iwc1&rs=1&pid=ImgDetMain",
    },
  ];

  const lightbox = useLightBox(galeria);
  const [showRechazarPop, setShowRechazarPop] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LightBox
        images={galeria}
        isOpen={lightbox.isOpen}
        currentIndex={lightbox.currentIndex}
        closeLightBox={lightbox.closeLightBox}
        goToPrev={lightbox.goToPrev}
        goToNext={lightbox.goToNext}
      />
      <main id="aprobar-res-main">
        <h1>Aprobar Reseña</h1>
        <div className="aprobar-res-container">
          <section className="user-info">
            <p>
              <b>Usuario</b>: correo@ejemplo.com
            </p>
            <p>
              <b>Fecha de Publicación</b>: 30-04-2004
            </p>
            <p>
              <b>Calificación</b>: 5
            </p>
          </section>
          <section className="user-resena-container">
            <p className="user-resena">
              <b>Comentario</b>: Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Quisquam voluptatibus, quisquam laudantium.
              Quisquam voluptatibus, quisquam laudantium.
            </p>
            <div className="user-resena-imgs-container">
              {galeria.map((img, index) => (
                <div className="user-resena-img" key={index}>
                  <img
                    src={img.src}
                    alt={`Imagen ${index + 1}`}
                    onClick={() => lightbox.openLightBox(index)}
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="aprobar-res-buttons">
            <button type="button" className="button">
              Aprobar
            </button>
            <button
              type="button"
              className="button"
              onClick={() => setShowRechazarPop(true)}
            >
              Rechazar
            </button>
          </section>
        </div>
      </main>
      <AnimatePresence>
        {showRechazarPop && (
          <ModRechazar
            key={`rechazar-pop`}
            onClose={() => setShowRechazarPop(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ModResenaDetail;
