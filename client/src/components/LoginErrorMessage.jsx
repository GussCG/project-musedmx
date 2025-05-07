import React, { useState } from "react";

import Icons from "./IconProvider";

import { motion } from "framer-motion";

const { IoClose } = Icons;

function LoginErrorMessage({ error, onClose }) {
  return (
    <div className="login-error-message">
      <p>{error}</p>
      <button id="close-login-popup" type="button" onClick={onClose}>
        <IoClose />
      </button>
    </div>
  );
}

export default LoginErrorMessage;
