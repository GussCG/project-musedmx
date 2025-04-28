import React from "react";
import { ThreeDot } from "react-loading-indicators";

import { AnimatePresence, motion } from "framer-motion";

function LoadingMessage({ msg }) {
  return (
    <div className="loading-container">
      <div className="loading-page-bg"></div>
      <div className="loading-page-content">
        <h1 className="loading-page-title">{msg}</h1>
        <ThreeDot color="#fff" size={50} className="loading-page-spinner" />
      </div>
    </div>
  );
}

export default LoadingMessage;
