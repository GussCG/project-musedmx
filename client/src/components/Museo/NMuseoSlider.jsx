import { useRef, memo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import MuseoCardSliderSkeleton from "./MuseoCardSliderSkeleton";
import Icons from "../Other/IconProvider";
import MuseoCardSlider from "./MuseoCardSlider";
import QVSearch from "./QVSearch";

const { FaChevronLeft, FaChevronRight, FaGear } = Icons;

const NMuseoSlider = memo(function NMuseoSlider({
  museos,
  title,
  subtitle = "",
  isLoading,
  refetchFavoritos,
  onDeleteFromQV,
  onAddFromQV,
  correo,
  editMode = false,
  museosQV,
}) {
  const swiperRef = useRef(null);
  const [editModeActive, setEditModeActive] = useState(false);

  return (
    <>
      <div className="museos-slider-header">
        <div className="title">
          <div className="title-container">
            <h2 className="museos-slider-title">{title}</h2>
            {editMode && (
              <button
                type="button"
                onClick={() => setEditModeActive(!editModeActive)}
                className={`edit-mode-button ${editModeActive ? "active" : ""}`}
                title={
                  editModeActive
                    ? "Salir del modo edición"
                    : "Entrar en modo edición"
                }
              >
                <FaGear />
              </button>
            )}
          </div>
          <p className="museos-slider-subtitle">{subtitle}</p>
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

      {editMode && (
        <QVSearch
          correo={correo}
          agregarQV={onAddFromQV}
          refreshQV={() => {}}
          museosQV={museosQV || []}
        />
      )}

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <SwiperSlide key={`skeleton-${i}`}>
                <MuseoCardSliderSkeleton />
              </SwiperSlide>
            ))
        ) : museos && museos.length > 0 ? (
          museos.map((museo) => (
            <SwiperSlide key={museo.id}>
              <MuseoCardSlider
                key={`museo-card-${museo.id}`}
                museo={museo}
                editMode={editModeActive}
                refetchFavoritos={refetchFavoritos}
                onDeleteFromQV={() => onDeleteFromQV(museo.id)}
              />
            </SwiperSlide>
          ))
        ) : (
          <div className="no-museos-message">
            <p>No hay {title} para mostrar.</p>
          </div>
        )}
      </Swiper>
    </>
  );
});

export default NMuseoSlider;
