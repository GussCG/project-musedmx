import React from "react";

import MuseoCard from "../components/MuseoCard";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination } from "swiper/modules";

function MuseoSlider({ listaMuseos, editMode }) {
  // Funcion para asignar el loop a Swiper si hay menos de 2 museos favoritos o por visitar
  const checkMuseosLength = (museos) => {
    if (Object.values(museos).length > 3) {
      return true;
    } else {
      return false;
    }
  };

  const loopCheck = checkMuseosLength(listaMuseos);

  if (!listaMuseos || Object.values(listaMuseos).length === 0) {
    return (
      <div className="museo-swiper">
        <h2>No tienes museos en tu lista</h2>
      </div>
    );
  }

  return (
    <div className="museo-swiper">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        // Si hay menos de 3 museos favoritos
        slidesPerView={loopCheck ? 3 : Object.values(listaMuseos).length}
        centeredSlides={loopCheck}
        loop={loopCheck}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          clickable: true,
        }}
        initialSlide={0}
        className="swiper"
      >
        {Object.values(listaMuseos).map((museo) => (
          <SwiperSlide className="swiper-slide" key={museo.id}>
            <MuseoCard key={museo.id} museo={museo} editMode={editMode} />
          </SwiperSlide>
        ))}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow"></div>
          <div className="swiper-button-next slider-arrow"></div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}

export default MuseoSlider;
