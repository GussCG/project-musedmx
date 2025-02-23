import React from "react";

import { Link } from "react-router-dom";

import editarPerfilIcon from "../assets/icons/editar-perfil-icon.png";
import historialIcon from "../assets/icons/historial-icon.png";
import userPlaceholder from "../assets/images/placeholders/user_placeholder.png";
import modIcon from "../assets/icons/moderador-icon.png";
import verResIcon from "../assets/icons/ver-resena-icon.png";

import { useAuth } from "../context/AuthProvider";

function MenuUsuario({ className }) {
  const { user, logout, tipoUsuario } = useAuth();

  const formatName = (user) => {
    return `${user.nombre} ${user.apPaterno} ${user.apMaterno}`;
  };

  return (
    <div className={`menu-usuario-container ${className}`}>
      <div className="menu-usuario-header">
        <img src={user?.foto || userPlaceholder} alt="Usuario" />
        <div className="menu-usuario-header-info">
          <h1>{formatName(user) || "Nombre de Usuario"}</h1>
          <p>{user?.email || "Correo"}</p>
          {user?.tipoUsuario === 2 && <p>Administrador</p>}
          {user?.tipoUsuario === 3 && <p>Moderador</p>}
          <Link id="header-info-link" to={`/${tipoUsuario}/`}>
            Ver Perfil
          </Link>
        </div>
      </div>
      <hr />
      <div className="menu-usuario-body">
        <div className="menu-usuario-body-item">
          <div className="menu-usuario-body-item-img-container">
            <img src={editarPerfilIcon} alt="Editar Perfil" />
          </div>
          <Link id="body-item-link" to={`/${tipoUsuario}/Editar`}>
            Editar Perfil
          </Link>
        </div>
        {user?.tipoUsuario === 1 && (
          <div className="menu-usuario-body-item">
            <div className="menu-usuario-body-item-img-container">
              <img src={historialIcon} alt="Historial de visitas" />
            </div>
            <Link id="body-item-link" to={`/${tipoUsuario}/Historial`}>
              Historial de visitas
            </Link>
          </div>
        )}

        {user?.tipoUsuario === 2 && (
          <div className="menu-usuario-body-item">
            <div className="menu-usuario-body-item-img-container">
              <img src={modIcon} alt="Historial de visitas" />
            </div>
            <Link id="body-item-link" to={`/${tipoUsuario}/VerMods`}>
              Moderadores
            </Link>
          </div>
        )}

        {user?.tipoUsuario === 3 && (
          <div className="menu-usuario-body-item">
            <div className="menu-usuario-body-item-img-container">
              <img src={verResIcon} alt="Historial de visitas" />
            </div>
            <Link id="body-item-link" to={`/${tipoUsuario}/VerResenas`}>
              Reseñas
            </Link>
          </div>
        )}
      </div>
      <hr />
      <div className="menu-usuario-footer">
        <button id="menu-usuario-btn-logout" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default MenuUsuario;
