import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import MuseoCard from "../components/MuseoCard";

import Icons from "./IconProvider";
const { FaArrowCircleLeft, FaArrowCircleRight } = Icons;

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination } from "swiper/modules";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Retraso entre cada card
      delayChildren: 0.3, // Retraso inicial
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
  hover: {
    y: -5,
    scale: 1.02,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
};

function MuseoSlider({ listaMuseos, editMode, sliderType }) {
  const swiperRef = useRef(null);

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
      <motion.div
        key={`museo-slider-${sliderType}`}
        className="museo-swiper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>No tienes museos en tu lista</h2>
      </motion.div>
    );
  }

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (swiperRef.current) {
  //       swiperRef.current.update(); // Actualiza el Swiper al cambiar el tamaño de la ventana
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize); // Limpia el evento al desmontar el componente
  //   };
  // }, []);

  return (
    <motion.div
      key={`museo-slider-${sliderType}`}
      className="museo-swiper-container"
      variants={containerVariants}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        // Si hay menos de 3 museos favoritos
        slidesPerView={loopCheck ? 3 : Object.values(listaMuseos).length}
        centeredSlides={false}
        loop={false}
        pagination={false}
        navigation={
          loopCheck
            ? { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
            : false
        }
        initialSlide={0}
        className="museo-swiper"
      >
        <div className="swiper-button-next">
          <FaArrowCircleRight />
        </div>
        <div className="swiper-button-prev">
          <FaArrowCircleLeft />
        </div>

        {Object.values(listaMuseos).map((museo) => (
          <motion.div
            key={`${sliderType}-museo-card-${museo.id}`}
            variants={cardVariants}
            whileHover="hover"
            layout // Mantén esto para animaciones de reordenamiento
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SwiperSlide className="swiper-slide" key={`slide-${museo.mus_id}`}>
              <MuseoCard
                key={`museo-card-${museo.mus_id}`}
                museo={museo}
                editMode={editMode}
                sliderType={sliderType}
              />
            </SwiperSlide>
          </motion.div>
        ))}
      </Swiper>
    </motion.div>
  );
}

export default MuseoSlider;
