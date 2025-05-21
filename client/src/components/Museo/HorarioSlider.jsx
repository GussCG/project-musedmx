import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { ThreeDot } from "react-loading-indicators";

import Icons from "../Other/IconProvider";
import HorarioPrecioCard from "./HorarioCard";
import LoadingIndicator from "../Other/LoadingIndicator";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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

      setInitialSlide(index);
      setKey((prevKey) => prevKey + 1);
    }
  }, [horarios]);

  return (
    <section id="museo-section-horario" className="museo-detail-item">
      <h1>Horarios y Precios</h1>
      {loading && (
        <div className="horario-swiper">
          <div className="no-results">
            <LoadingIndicator />
          </div>
        </div>
      )}

      {horarios?.length === 0 && !loading && (
        <div className="horario-swiper">
          <div className="no-results">
            <p>No hay horarios disponibles</p>
          </div>
        </div>
      )}

      {horarios?.length > 0 && (
        <>
          <Swiper
            key={key}
            ref={swiperRef}
            modules={[Navigation, EffectCoverflow]}
            centeredSlides={true}
            initialSlide={initialSlide}
            // effect="coverflow"
            // coverflowEffect={{
            //   depth: 100,
            //   modifier: 2,
            //   slideShadows: false,
            //   rotate: 0,
            //   stretch: 0,
            // }}
            slidesPerView={"auto"}
            grabCursor={true}
            spaceBetween={80}
            loop={horarios.length > 1}
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
        </>
      )}
    </section>
  );
}

export default HorarioSlider;
