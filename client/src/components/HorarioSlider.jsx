import { useRef, useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, EffectCoverflow, Pagination } from "swiper/modules";
import { ThreeDot } from "react-loading-indicators";

import Icons from "./IconProvider";
import HorarioPrecioCard from "./HorarioCard";
const { FaArrowCircleLeft, FaArrowCircleRight } = Icons;

function HorarioSlider({ horarios, loading, error }) {
  const swiperRef = useRef(null);
  const [initialSlide, setInitialSlide] = useState(0);
  const [hoy, setHoy] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    const hoy = new Date()
      .toLocaleDateString("es-MX", {
        weekday: "long",
        timeZone: "America/Mexico_City",
      })
      .toLowerCase();
    setHoy(hoy);

    if (horarios?.length) {
      const index = horarios.findIndex(
        (horario) => horario.mh_dia.toLowerCase() === hoy
      );

      setKey((prevKey) => prevKey + 1);
    }
  }, [horarios]);

  const resetSwiper = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.update();
      swiperRef.current.swiper.slideTo(initialSlide);
    }
  };

  return (
    <section id="museo-section-horario" className="museo-detail-item">
      {loading && (
        <div className="message">
          <div className="loading-indicator">
            <ThreeDot width={50} height={50} color="#000" count={3} />
          </div>
        </div>
      )}

      {horarios?.length === 0 && !loading && (
        <div className="message">
          <p>No hay horarios disponibles</p>
        </div>
      )}

      <h1>Horarios y Precios</h1>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, EffectCoverflow]}
        centeredSlides={true}
        initialSlide={initialSlide}
        effect="coverflow"
        coverflowEffect={{
          depth: 100,
          modifier: 2,
          slideShadows: false,
          rotate: 0,
          stretch: 0,
        }}
        slidesPerView={"auto"}
        grabCursor={true}
        spaceBetween={80}
        loop={true}
        pagination={false}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        className="horario-swiper"
      >
        {horarios.map((horario, index) => (
          <SwiperSlide key={`horario-${index}`}>
            <HorarioPrecioCard horario={horario} hoy={hoy} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-controllers">
        <div className="swiper-button-prev">
          <FaArrowCircleLeft />
        </div>
        <div className="swiper-button-next">
          <FaArrowCircleRight />
        </div>
      </div>
    </section>
  );
}

export default HorarioSlider;
