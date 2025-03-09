import React, { useState } from "react";

import Icons from "./IconProvider";

const { IoClose } = Icons;

function LoginErrorMessage({ error }) {
  const [isLogginErrorMessage, setIsLogginErrorMessage] = useState(true);

  const handleClose = () => {
    setIsLogginErrorMessage(false);
  };

  return (
    <>
      <div
        className={`login-error-message ${
          isLogginErrorMessage ? "show" : "hide"
        }`}
      >
        <p>{error}El correo o la contraseña no son correctos</p>
        <button id="close-login-popup" type="button" onClick={handleClose}>
          <IoClose />
        </button>
      </div>
    </>
  );
}

export default LoginErrorMessage;
