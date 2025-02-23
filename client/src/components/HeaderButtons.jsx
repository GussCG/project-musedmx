import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router";

function HeaderButtons({ tipoUsuario }) {
  const { logout } = useAuth();
  return (
    <div id="header-user-buttons">
      <Link className="button-link" to="./Editar" id="header-user-edit-button">
        Editar Perfil
      </Link>

      {tipoUsuario === 1 ? (
        <Link
          className="button-link"
          to="./Historial"
          id="header-user-resenias-button"
        >
          Mis Reseñas
        </Link>
      ) : null}

      {tipoUsuario === 2 ? (
        <Link
          className="button-link"
          to="./VerMods"
          id="header-user-resenias-button"
        >
          Moderadores
        </Link>
      ) : null}

      {tipoUsuario === 3 ? (
        <Link
          className="button-link"
          to="./VerResenas"
          id="header-user-resenias-button"
        >
          Reseñas
        </Link>
      ) : null}

      <button
        className="button"
        onClick={logout}
        id="header-user-logout-button"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default HeaderButtons;
