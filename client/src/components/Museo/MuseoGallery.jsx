import { buildImageGaleria } from "../../utils/buildImage";
import LightBox from "../Other/LightBox";
import useLightBox from "../../hooks/Other/useLightBox";
import { useMemo } from "react";
import LoadingIndicator from "../Other/LoadingIndicator";

function MuseoGallery({ images, loading }) {
  const lightbox = useLightBox(images);

  const imagesMemo = useMemo(() => {
    return images.map((image) => ({
      src: image.gal_foto,
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
          <div
            className={`museo-section-3-galeria count-${images.length}`}
            // onClick={openLightBox}
          >
            {imagesMemo.map((image, index) => (
              <div
                key={index}
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
