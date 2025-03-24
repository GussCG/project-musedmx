import React from "react";

function ErrorCampo({ mensaje }) {
  return (
    <div className="error-campo-container">
      <p>{mensaje}</p>
    </div>
  );
}

export default ErrorCampo;
