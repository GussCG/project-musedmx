// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination } from "swiper/modules";
import { buildImageGaleria } from "../../utils/buildImage";

function ImagenesSlider({ listaImagenes }) {
  // Prueba
  const imagenes = listaImagenes;

  return (
    <div className="resena-swiper">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={"auto"}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          clickable: true,
        }}
        initialSlide={0}
        className="swiper"
      >
        {imagenes.map((imagen, index) => (
          <SwiperSlide className="swiper-slide" key={index}>
            <img
              src={buildImageGaleria(imagen)}
              alt={`Imagen ${index + 1}`}
              loading="lazy"
              className="gallery_image"
            />
          </SwiperSlide>
        ))}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow"></div>
          <div className="swiper-button-next slider-arrow"></div>
        </div>
      </Swiper>
    </div>
  );
}

export default ImagenesSlider;
