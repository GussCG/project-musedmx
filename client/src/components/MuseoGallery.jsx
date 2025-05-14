import { useEffect, useState } from "react";
import { buildImageGaleria } from "../utils/buildImage";
import LightBox from "./LightBox";
import useLightBox from "../hooks/useLightBox";

function MuseoGallery({ images }) {
  // Función para determinar el span aleatorio de las imágenes
  const getRandomSpan = () => {
    const random = Math.random();
    return random > 0.8 ? 2 : 1; // 20% de probabilidad de que la imagen sea más grande
  };

  const lightbox = useLightBox(images);

  const galeria = images.map((image) => {
    return {
      src: buildImageGaleria(image),
    };
  });

  return (
    <>
      <LightBox
        images={galeria}
        isOpen={lightbox.isOpen}
        currentIndex={lightbox.currentIndex}
        closeLightBox={lightbox.closeLightBox}
        goToPrev={lightbox.goToPrev}
        goToNext={lightbox.goToNext}
      />
      <section id="museo-section-3" className="museo-detail-item">
        <h1 className="h1-section">Galería de Fotos</h1>
        <div
          className={`museo-section-3-galeria count-${images.length}`}
          // onClick={openLightBox}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`museo-galeria-foto foto-${index + 1}`}
              onClick={() => lightbox.openLightBox(index)}
            >
              <img
                src={buildImageGaleria(image)}
                alt={`Foto ${index + 1}`}
                className="gallery_img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default MuseoGallery;
