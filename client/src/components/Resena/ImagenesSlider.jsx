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

function ImagenesSlider({ listaImagenes }) {
  const galeria = useMemo(() => {
    if (!listaImagenes || listaImagenes.length === 0) return [];
    return listaImagenes.map((image) => ({
      src: buildImageGaleria(image),
    }));
  }, [listaImagenes]);

  const lightbox = useLightBox(galeria);

  useEffect(() => {
    if (!listaImagenes || listaImagenes.length === 0) {
      console.log("No hay imágenes para mostrar en la galería.");
    }
  }, [listaImagenes]);

  return (
    <>
      <div className="resena-swiper">
        <LightBoxPortal>
          <LightBox
            images={galeria}
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
          {galeria.map((imagen, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              {imagen.src && (
                <img
                  src={imagen.src}
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
