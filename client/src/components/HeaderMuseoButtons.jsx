import React from "react";
import { Link } from "react-router";

function HeaderMuseoButtons() {
  return (
    <div className="header-buttons-container">
      <Link className="button-link" to="">
        Editar Información
      </Link>
      <Link className="button-link" to="">
        Editar Horarios
      </Link>
      <Link className="button-link" to="">
        Editar Imágenes
      </Link>
    </div>
  );
}

export default HeaderMuseoButtons;
