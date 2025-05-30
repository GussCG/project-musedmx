import React from "react";
import { motion } from "framer-motion";

function ValidPassword({
  faltaNumero,
  faltaMayuscula,
  faltaMinuscula,
  faltaCaracterEspecial,
  longitud,
}) {
  return (
    <motion.div
      className="valid-password-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p>Contraseña no valida</p>
      <ul>
        <li>
          <label className="valid-password-chk">
            <input type="checkbox" checked={longitud} readOnly />
            <span className="checkmark"></span>
          </label>
          <label>
            Debe tener al menos <b>8</b> caracteres
          </label>
        </li>
        <li>
          <label className="valid-password-chk">
            <input type="checkbox" checked={faltaNumero} readOnly />
            <span className="checkmark"></span>
          </label>
          <label>
            Debe tener al menos un <b>número</b>
          </label>
        </li>
        <li>
          <label className="valid-password-chk">
            <input type="checkbox" checked={faltaMayuscula} readOnly />
            <span className="checkmark"></span>
          </label>
          <label>
            Debe tener al menos una <b>mayúscula</b>
          </label>
        </li>
        <li>
          <label className="valid-password-chk">
            <input type="checkbox" checked={faltaMinuscula} readOnly />
            <span className="checkmark"></span>
          </label>
          <label>
            Debe tener al menos una <b>minúscula</b>
          </label>
        </li>
        <li>
          <label className="valid-password-chk">
            <input type="checkbox" checked={faltaCaracterEspecial} readOnly />
            <span className="checkmark"></span>
          </label>
          <label>
            Debe tener al menos un caracter especial (
            <b>!@#$%^&amp;*()_+-={}[]|:;"'&lt;&gt;,.?/ ~</b>)
          </label>
        </li>
      </ul>
    </motion.div>
  );
}

export default ValidPassword;
