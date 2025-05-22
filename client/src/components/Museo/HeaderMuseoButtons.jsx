import { Link } from "react-router";
import { useAuth } from "../../context/AuthProvider";
import { TIPOS_USUARIO } from "../../constants/catalog";

function HeaderMuseoButtons({ museoId }) {
  const { tipoUsuario } = useAuth();

  return (
    <div className="header-buttons-container">
      <Link
        className="button-link"
        to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/Museo/Editar/${museoId}`}
      >
        Editar Información
      </Link>
      <Link
        className="button-link"
        to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/Museo/EditarHorario/${museoId}`}
      >
        Editar Horarios
      </Link>
      <Link
        className="button-link"
        to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/Museo/EditarImagenes/${museoId}`}
      >
        Editar Imágenes
      </Link>
    </div>
  );
}

export default HeaderMuseoButtons;
