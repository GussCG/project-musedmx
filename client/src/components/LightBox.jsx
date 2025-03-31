import React, { useState } from "react";

import { motion } from "framer-motion";

import Icons from "./IconProvider";
const { closeIcon } = Icons;

function LightBox({ lightBoxVisible, setLightBoxVisible, currentImage }) {
  const closeLightBox = () => {
    setLightBoxVisible(false);
  };

  if (!lightBoxVisible) {
    return null;
  }

  return (
    <div className="lightbox show">
      <button className="btn-close" onClick={closeLightBox}>
        <img src={closeIcon} alt="Cerrar" />
      </button>
      <motion.img
        src={currentImage}
        className="show-img"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, type: "spring" }}
      />
    </div>
  );
}

export default LightBox;
