import React from "react";

function ValidPassword({
  faltaNumero,
  faltaMayuscula,
  faltaMinuscula,
  faltaCaracterEspecial,
  longitud,
}) {
  return (
    <div className="valid-password-container">
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
    </div>
  );
}

export default ValidPassword;
