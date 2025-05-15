import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Scrollbar,
  Mousewheel,
  Pagination,
  EffectFade,
  Autoplay,
} from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Fotos de museos
import Museo1 from "../../assets/images/others/museo-main-1.jpg";
import Museo2 from "../../assets/images/others/museo-main-2.jpg";
import Museo3 from "../../assets/images/others/museo-main-3.jpg";
import Museo4 from "../../assets/images/others/museo-main-4.jpg";
import Museo5 from "../../assets/images/others/museo-main-5.jpg";

import Icons from "./IconProvider";
import MuseumSearch from "../Museo/MuseumSearch";
const { IoSearch } = Icons;

// Contenido de los slides
const slidesContent = [
  {
    img: Museo1,
    label: "todos los museos?",
    buttonText: "Ver Museos",
    buttonLink: "/Museos",
    searchBar: false,
  },
  {
    img: Museo2,
    label: "los museos cerca de ti?",
    buttonText: "Ver Cerca de Mi",
    buttonLink: "/Museos/CercaDeMi",
    searchBar: false,
  },
  {
    img: Museo3,
    label: "los museos más populares?",
    buttonText: "Ver Populares",
    buttonLink: "/Museos/Populares",
    searchBar: false,
  },
  {
    img: Museo4,
    label: "",
    buttonText: "Buscar",
    buttonLink: "",
    searchBar: true,
  },
];

function IndexSlider() {
  const [progress, setProgress] = useState(0);
  const swiperRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}`;
  };

  return (
    <div className="index-slider">
      <Swiper
        ref={swiperRef}
        direction={"vertical"}
        slidesPerView={1}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          thresholdDelta: 30,
          releaseOnEdges: true,
        }}
        pagination={false}
        modules={[Mousewheel, Pagination, Scrollbar, EffectFade, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onTouchStart={() => {
          setIsAnimating(true);
        }}
        onTouchEnd={() => {
          setIsAnimating(false);
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          setProgress((swiper.activeIndex + 1) / slidesContent.length);
        }}
        onProgress={(swiper, progress) => {
          setProgress(progress);
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        effect={"fade"}
        speed={1000}
        className="index-swiper"
        nested={true}
        preventInteractionOnTransition={true}
        noSwipingSelector=".nav-bar, .nav-bar *"
      >
        {slidesContent.map((slide, index) => (
          <SwiperSlide key={index} className="index-slider">
            <div className="index-slider-bg">
              <img src={slide.img} alt="" />
            </div>
            <div className="index-slider-content">
              <h1>
                {slide.searchBar ? (
                  <motion.span
                    key={`static-${activeIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    Busca el museo que quieres ver
                  </motion.span>
                ) : (
                  <div className="index-slider-text">
                    <span className="fixed-text">¿Quieres ver </span>
                    <AnimatePresence mode="wait">
                      <Link to={slide.buttonLink}>
                        <span className="index-slider-label">
                          <motion.span
                            key={`label-${activeIndex}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            {slidesContent[activeIndex].label}
                          </motion.span>
                        </span>
                      </Link>
                    </AnimatePresence>
                  </div>
                )}
              </h1>

              <AnimatePresence mode="wait">
                {slide.searchBar && <MuseumSearch swiperRef={swiperRef} />}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-progressbar" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20" />
          </svg>
          <span className="progress-content" ref={progressContent}></span>
        </div>
      </Swiper>

      <div className="swiper-pagination">
        {slidesContent.map((_, index) => (
          <div
            key={index}
            className={`swiper-pagination-bullet ${
              activeIndex === index ? "swiper-pagination-bullet-active" : ""
            }`}
            onClick={() => {
              swiperRef.current.swiper.slideTo(index);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default IndexSlider;
