import React from "react";
import { motion } from "framer-motion";

import MuseoCard from "../components/MuseoCard";

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

  return (
    <motion.div
      className="museo-swiper"
      variants={containerVariants}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
          <motion.div
            key={`${sliderType}-museo-card-${museo.id}`}
            variants={cardVariants}
            whileHover="hover"
            layout // Mantén esto para animaciones de reordenamiento
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SwiperSlide className="swiper-slide" key={museo.id}>
              <MuseoCard
                key={museo.id}
                museo={museo}
                editMode={editMode}
                sliderType={sliderType}
              />
            </SwiperSlide>
          </motion.div>
        ))}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow"></div>
          <div className="swiper-button-next slider-arrow"></div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </motion.div>
  );
}

export default MuseoSlider;
