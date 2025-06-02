import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router";

function HeaderButtons({ tipoUsuario }) {
  const { logout } = useAuth();
  return (
    <div id="header-user-buttons">
      <Link className="button-link" to="./Editar" id="header-user-edit-button">
        <label>Editar Perfil</label>
      </Link>

      {tipoUsuario === 1 ? (
        <Link
          className="button-link"
          to="./Historial"
          id="header-user-resenias-button"
        >
          <label>Mis Reseñas</label>
        </Link>
      ) : null}

      {tipoUsuario === 2 ? (
        <Link
          className="button-link"
          to="./VerMods"
          id="header-user-resenias-button"
        >
          <label>Moderadores</label>
        </Link>
      ) : null}

      {tipoUsuario === 3 ? (
        <Link
          className="button-link"
          to="./VerResenas"
          id="header-user-resenias-button"
        >
          <label>Reseñas</label>
        </Link>
      ) : null}

      <button
        className="button"
        onClick={logout}
        id="header-user-logout-button"
      >
        <label>Cerrar Sesión</label>
      </button>
    </div>
  );
}

export default HeaderButtons;
