import { AnimatePresence, motion } from "framer-motion";
import Icons from "./IconProvider";
const { CgClose, IoIosArrowForward, IoIosArrowBack } = Icons;

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

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox show"
        key={`lightbox-${currentIndex}`}
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
          onClick={goToPrev}
          key={"prev-btn"}
        >
          <IoIosArrowBack />
        </motion.button>

        <motion.div
          className="lightbox-img-container"
          key={`lightbox-img-${currentImage}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <img src={currentImage.src} alt={`Imagen ${currentIndex + 1}`} />
        </motion.div>

        <motion.button
          className="btn-nav next"
          onClick={goToNext}
          key={"next-btn"}
        >
          <IoIosArrowForward />
        </motion.button>

        <motion.div className="image-counter">
          <p>
            {currentIndex + 1} / {images.length}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LightBox;
