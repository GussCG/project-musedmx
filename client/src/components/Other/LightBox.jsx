import { useEffect } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import Icons from "./IconProvider";
const {
  CgClose,
  IoIosArrowForward,
  IoIosArrowBack,
  FaPlus,
  FaMinus,
  RiResetLeftFill,
} = Icons;
import { useState, useRef } from "react";

function LightBox({
  images,
  isOpen,
  currentIndex,
  closeLightBox,
  goToPrev,
  goToNext,
}) {
  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  const containerRef = useRef(null);

  const [scale, setScale] = useState(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 5));
  };
  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 1));
  };
  const handleReset = () => {
    setScale(1);
    x.set(0);
    y.set(0);
  };

  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowRight") {
        goToNext();
        handleReset();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
        handleReset();
      } else if (e.key === "Escape") {
        closeLightBox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNext, goToPrev, closeLightBox]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY;
      setScale((prevScale) => {
        const newScale = delta > 0 ? prevScale - 0.1 : prevScale + 0.1;
        return Math.min(Math.max(newScale, 1), 5);
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [currentImage]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="lightbox show"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        <motion.button
          className="btn-close"
          onClick={closeLightBox}
          key={"close-btn"}
        >
          <CgClose />
        </motion.button>

        <motion.button
          className="btn-nav prev"
          onClick={() => {
            goToPrev();
            handleReset();
          }}
          key={"prev-btn"}
        >
          <IoIosArrowBack />
        </motion.button>

        <motion.div
          className="lightbox-img-container"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, type: "spring" }}
          ref={containerRef}
        >
          <motion.img
            src={currentImage.src || currentImage.foto || currentImage}
            alt={`Imagen ${currentIndex + 1}`}
            drag={scale > 1} // Solo permite drag con zoom
            dragConstraints={{
              top: -window.innerHeight * (scale - 1.2),
              right: window.innerWidth * (scale - 1.2),
              bottom: window.innerHeight * (scale - 1.2),
              left: -window.innerWidth * (scale - 1.2),
            }}
            dragElastic={0.2}
            dragMomentum={false}
            style={{ x, y, scale }}
            whileDrag={{ cursor: "grabbing" }}
          />
        </motion.div>

        <motion.button
          className="btn-nav next"
          onClick={() => {
            goToNext();
            handleReset();
          }}
          key={"next-btn"}
        >
          <IoIosArrowForward />
        </motion.button>

        <motion.div className="zoom-controls">
          <div className="left-controls">
            <button className="btn-zoom" onClick={handleZoomIn}>
              <FaPlus />
            </button>
          </div>
          <div className="center-controls">
            <p>
              {currentIndex + 1} / {images.length}
            </p>
            <button className="btn-reset" onClick={handleReset}>
              <RiResetLeftFill />
            </button>
          </div>
          <div className="right-controls">
            <button className="btn-zoom" onClick={handleZoomOut}>
              <FaMinus />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LightBox;
