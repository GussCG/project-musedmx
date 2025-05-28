import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaAngleDoubleUp } from "react-icons/fa";

function ScrollToTopButton({ isMapView = false }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300); // Mostrar solo si baja 300px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showButton && !isMapView && (
        <motion.div
          className="b2up"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2, type: "tween" }}
          key="b2up"
        >
          <button
            className="b2up-button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            title="Regresar al inicio"
          >
            <FaAngleDoubleUp />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ScrollToTopButton;
