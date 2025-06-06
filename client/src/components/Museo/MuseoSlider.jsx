import { useRef, memo, useMemo } from "react";
import { motion } from "framer-motion";
import MuseoCard from "./MuseoCard";
import Icons from "../Other/IconProvider";
const { FaArrowCircleLeft, FaArrowCircleRight } = Icons;
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import LoadingIndicator from "../Other/LoadingIndicator";
import { useQV } from "../../hooks/QuieroVisitar/useQV";

const MuseoSlider = memo(function MuseoSlider({
  listaMuseos = [],
  editMode,
  sliderType,
  loading,
  refreshSugeridos,
  refetchFavoritos,
  refreshQV,
  correo,
}) {
  const swiperRef = useRef(null);

  const { eliminarQV } = useQV();
  const handleDeleteFromQV = async (correo, museoId) => {
    try {
      await eliminarQV(correo, museoId);
      refreshQV();
      if (refreshSugeridos) {
        refreshSugeridos();
      }
    } catch (error) {
      console.error("Error al eliminar el museo de Quiero Visitar:", error);
    }
  };

  return (
    <motion.div
      key={`museo-slider-${sliderType}`}
      className="museo-swiper-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <LoadingIndicator />
      ) : listaMuseos && listaMuseos.length > 0 ? (
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={10}
          // Si hay menos de 3 museos favoritos
          slidesPerView={listaMuseos.length > 3 ? 3 : listaMuseos.length}
          centeredSlides={false}
          loop={false}
          pagination={false}
          navigation={
            listaMuseos.length > 3
              ? { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
              : false
          }
          className="museo-swiper"
        >
          {listaMuseos.map((museo) =>
            loading ? (
              <LoadingIndicator key={museo.id} />
            ) : (
              <SwiperSlide className="swiper-slide" key={`slide-${museo.id}`}>
                <MuseoCard
                  key={`museo-card-${museo.id}`}
                  museo={museo}
                  editMode={editMode}
                  sliderType={sliderType}
                  refetchFavoritos={refetchFavoritos}
                  onDeleteFromQV={() => handleDeleteFromQV(correo, museo.id)}
                  loading={loading}
                />
              </SwiperSlide>
            )
          )}

          {listaMuseos.length > 3 && (
            <>
              <div className="swiper-button-prev">
                <FaArrowCircleLeft />
              </div>
              <div className="swiper-button-next">
                <FaArrowCircleRight />
              </div>
            </>
          )}
        </Swiper>
      ) : (
        <div className="museo-swiper-title">
          <h2 className="museo-swiper-title-text">
            {sliderType
              ? `No tiene ${sliderType.toLowerCase()}`
              : "No tiene museos por visitar"}
          </h2>
        </div>
      )}
    </motion.div>
  );
});

export default MuseoSlider;
