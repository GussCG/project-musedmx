import React from "react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination } from "swiper/modules";

import galeriaFoto1 from "../assets/images/others/museo-main-1.jpg";
import galeriaFoto2 from "../assets/images/others/museo-main-2.jpg";
import galeriaFoto3 from "../assets/images/others/museo-main-3.jpg";
import galeriaFoto4 from "../assets/images/others/museo-main-4.jpg";
import galeriaFoto5 from "../assets/images/others/museo-main-5.jpg";

function ImagenesSlider({ listaImagenes, openLightbox }) {
  // Prueba
  const imagenes = listaImagenes || [
    galeriaFoto1,
    galeriaFoto2,
    galeriaFoto3,
    galeriaFoto4,
    galeriaFoto5,
  ];

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
              src={imagen}
              alt={`Imagen ${index + 1}`}
              loading="lazy"
              onClick={openLightbox}
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
