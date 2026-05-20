import { useMemo, useEffect, useState, useRef } from "react";
import { useMuseosPopulares } from "../../hooks/Museo/useMuseosPopulares";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import Icons from "../Other/IconProvider";
import MuseoCardSlider from "../Museo/MuseoCardSlider";
import MuseoCardSliderSkeleton from "../Museo/MuseoCardSliderSkeleton";

const { FaChevronLeft, FaChevronRight } = Icons;

function IndexMuseosDestacados() {
  const { museos, loading: isLoadingPopulares } = useMuseosPopulares();
  const swiperRef = useRef(null);

  return (
    <section className="index-museos-destacados">
      <div className="museos-destacados-header">
        <div className="title">
          <h2 className="index-museos-destacados-title">Museos Destacados</h2>
          <p className="index-museos-destacados-subtitle">
            Los museos más populares entre los visitantes esta semana
          </p>
        </div>

        <div className="controllers">
          <button onClick={() => swiperRef.current?.slidePrev()}>
            <FaChevronLeft />
          </button>
          <button onClick={() => swiperRef.current?.slideNext()}>
            <FaChevronRight />
          </button>
        </div>
      </div>

      {museos.length === 0 && !isLoadingPopulares && (
        <div className="loading-message">
          <p>No hay museos destacados en este momento.</p>
        </div>
      )}

      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={3}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {isLoadingPopulares
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <SwiperSlide key={`skeleton-${i}`}>
                  <MuseoCardSliderSkeleton />
                </SwiperSlide>
              ))
          : museos.map((museo) => (
              <SwiperSlide key={museo.id}>
                <MuseoCardSlider museo={museo} isIndex={true} />
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );
}

export default IndexMuseosDestacados;
