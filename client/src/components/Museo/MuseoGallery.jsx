import { buildImageGaleria } from "../../utils/buildImage";
import LightBox from "../Other/LightBox";
import useLightBox from "../../hooks/Other/useLightBox";
import { useMemo } from "react";
import LoadingIndicator from "../Other/LoadingIndicator";

function MuseoGallery({ images, loading = false }) {
  const lightbox = useLightBox(images);
  const imagesMemo = useMemo(() => {
    if (!images || images.length === 0) return [];

    const shuffled = [...images];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const seleccionadas = shuffled.slice(0, 10);

    return seleccionadas.map((image) => ({
      src: image.img,
      id: image.id,
    }));
  }, [images]);

  return (
    <>
      <LightBox
        images={imagesMemo}
        isOpen={lightbox.isOpen}
        currentIndex={lightbox.currentIndex}
        closeLightBox={lightbox.closeLightBox}
        goToPrev={lightbox.goToPrev}
        goToNext={lightbox.goToNext}
      />
      <section id="museo-section-3" className="museo-detail-item">
        <h1 className="h1-section">Galería de Fotos</h1>
        {loading ? (
          <div className="no-results">
            <LoadingIndicator />
          </div>
        ) : (
          <div className={`museo-section-3-galeria count-${imagesMemo.length}`}>
            {imagesMemo.map((image, index) => (
              <div
                key={image.id || index}
                className={`museo-galeria-foto foto-${index + 1}`}
                onClick={() => lightbox.openLightBox(index)}
              >
                <img
                  src={image.src}
                  alt={`Foto ${index + 1}`}
                  className="gallery_img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default MuseoGallery;
