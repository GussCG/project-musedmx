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
        <label>Editar Información</label>
      </Link>
      <Link
        className="button-link"
        to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/Museo/EditarHorario/${museoId}`}
      >
        <label>Editar Horario</label>
      </Link>
      <Link
        className="button-link"
        to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/Museo/EditarImagenes/${museoId}`}
      >
        <label>Editar Imágenes</label>
      </Link>
    </div>
  );
}

export default HeaderMuseoButtons;
