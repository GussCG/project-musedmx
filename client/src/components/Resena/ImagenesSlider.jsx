import { useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import { buildImageGaleria } from "../../utils/buildImage";

import Icons from "../Other/IconProvider";
import LightBox from "../Other/LightBox";
import LightBoxPortal from "../Other/LightBoxPortal";
import useLightBox from "../../hooks/Other/useLightBox";
const { FaArrowCircleLeft, FaArrowCircleRight } = Icons;

function ImagenesSlider({ fotos }) {
  const fotosMemo = useMemo(() => {
    if (!fotos || fotos.length === 0) {
      console.log("No hay imágenes para mostrar en la galería.");
      return [];
    }
    // Obtengo una url
    return fotos
      .map((foto) => {
        if (typeof foto === "string") {
          return foto; // Si ya es una URL, la retorno directamente
        } else if (foto && foto.url) {
          return foto.url; // Si es un objeto con una propiedad url, la retorno
        } else {
          console.warn("Foto no válida:", foto);
          return null; // Retorno null para fotos no válidas
        }
      })
      .filter(Boolean); // Filtra los valores nulos
  }, [fotos]);

  const lightbox = useLightBox(fotosMemo);

  return (
    <>
      <div className="resena-swiper">
        <LightBoxPortal>
          <LightBox
            images={fotosMemo}
            isOpen={lightbox.isOpen}
            currentIndex={lightbox.currentIndex}
            closeLightBox={lightbox.closeLightBox}
            goToPrev={lightbox.goToPrev}
            goToNext={lightbox.goToNext}
          />
        </LightBoxPortal>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={"auto"}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            clickable: true,
          }}
          initialSlide={0}
          className="swiper"
        >
          {fotosMemo.map((imagen, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              {imagen && (
                <img
                  src={imagen}
                  alt={`Imagen ${index + 1}`}
                  loading="lazy"
                  className="gallery_image"
                  onClick={() => lightbox.openLightBox(index)}
                />
              )}
            </SwiperSlide>
          ))}
          <div className="swiper-controllers">
            <div className="swiper-button-prev">
              <FaArrowCircleLeft />
            </div>
            <div className="swiper-button-next">
              <FaArrowCircleRight />
            </div>
          </div>
        </Swiper>
      </div>
    </>
  );
}

export default ImagenesSlider;
