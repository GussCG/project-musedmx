import { useEffect, useState } from "react";
import LightBox from "./LightBox"; // Asegúrate de que la ruta sea correcta
import { buildImageGaleria } from "../utils/buildImage";

function MuseoGallery({ images }) {
  // Función para determinar el span aleatorio de las imágenes
  const getRandomSpan = () => {
    const random = Math.random();
    return random > 0.8 ? 2 : 1; // 20% de probabilidad de que la imagen sea más grande
  };

  // Estado para controlar la visibilidad del lightbox
  const [lightBoxVisible, setLightBoxVisible] = useState(false);
  // Estado para controlar la imagen actual del lightbox
  const [currentImage, setCurrentImage] = useState("");

  const openLightBox = (e) => {
    if (e.target.src) {
      setCurrentImage(e.target.src);
      setLightBoxVisible(true);
    }
  };

  return (
    <>
      <LightBox
        lightBoxVisible={lightBoxVisible}
        setLightBoxVisible={setLightBoxVisible}
        currentImage={currentImage}
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
              onClick={openLightBox}
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
