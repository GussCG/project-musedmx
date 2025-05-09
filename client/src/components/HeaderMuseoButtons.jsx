import { Link } from "react-router";

import { useAuth } from "../context/AuthProvider";

function HeaderMuseoButtons({ museoId }) {
  const { tipoUsuario } = useAuth();

  return (
    <div className="header-buttons-container">
      <Link
        className="button-link"
        to={`/${tipoUsuario}/Museo/Editar/${museoId}`}
      >
        Editar Información
      </Link>
      <Link
        className="button-link"
        to={`/${tipoUsuario}/Museo/EditarHorario/${museoId}`}
      >
        Editar Horarios
      </Link>
      <Link
        className="button-link"
        to={`/${tipoUsuario}/Museo/EditarImagenes/${museoId}`}
      >
        Editar Imágenes
      </Link>
    </div>
  );
}

export default HeaderMuseoButtons;
