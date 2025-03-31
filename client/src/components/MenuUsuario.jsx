import React from "react";
import { useTheme } from "../context/ThemeProvider";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import userPlaceholder from "../assets/images/placeholders/user_placeholder.png";

import Icons from "../components/IconProvider";
const {
  editarPerfilIcon,
  historialIcon,
  modIcon,
  verResIcon,
  IoSunny,
  FaMoon,
} = Icons;

import { useAuth } from "../context/AuthProvider";

function MenuUsuario({ className }) {
  const { user, logout, tipoUsuario } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const formatName = (user) => {
    return `${user.nombre} ${user.apPaterno} ${user.apMaterno}`;
  };

  return (
    <motion.div
      className={`menu-usuario-container ${className}`}
      initial={{ visibility: "hidden" }}
      animate={{ visibility: "initial" }}
      exit={{ visibility: "hidden" }}
      transition={{ duration: 0.3 }}
    >
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
      <div className="menu-usuario-darkmode-container">
        <label>Modo Oscuro</label>
        <div className="switch-button-dm">
          <input
            type="checkbox"
            name="fotos-filter"
            checked={isDarkMode}
            onChange={toggleTheme}
            id="switch-label"
            className="switch-button__checkbox"
          />
          <label htmlFor="switch-label" className="switch-button__label">
            <span className="switch-button-slider"></span>
          </label>
          <div className="switch-button-span-container">
            <FaMoon />
            <IoSunny />
          </div>
        </div>
      </div>
      <hr />
      <div className="menu-usuario-footer">
        <button id="menu-usuario-btn-logout" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>
    </motion.div>
  );
}

export default MenuUsuario;
