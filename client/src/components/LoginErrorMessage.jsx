import React, { useState } from "react";

import Icons from "./IconProvider";

import { motion } from "framer-motion";

const { IoClose } = Icons;

function LoginErrorMessage({ error, onClose }) {
  return (
    <motion.div
      className={`login-error-message`}
      initial={{ opacity: 0, y: "200%" }}
      animate={{ opacity: 1, y: "0%" }}
      exit={{ opacity: 0, y: "200%" }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <p>{error}</p>
      <button id="close-login-popup" type="button" onClick={onClose}>
        <IoClose />
      </button>
    </motion.div>
  );
}

export default LoginErrorMessage;
