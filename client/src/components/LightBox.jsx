import React from "react";

import { AnimatePresence, motion } from "framer-motion";

import Icons from "./IconProvider";
const { CgClose } = Icons;

function LightBox({ lightBoxVisible, setLightBoxVisible, currentImage }) {
  const closeLightBox = () => {
    setLightBoxVisible(false);
  };

  if (!lightBoxVisible) {
    return null;
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className="lightbox show"
        key={`lightbox-${currentImage}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        <motion.button
          className="btn-close"
          onClick={closeLightBox}
          key={"close-btn"}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <CgClose />
        </motion.button>
        <motion.img
          src={currentImage}
          className="show-img"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, type: "spring" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default LightBox;
