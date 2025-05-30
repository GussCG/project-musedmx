import { useTheme } from "../../context/ThemeProvider";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";
import Icons from "../Other/IconProvider";
import { TIPOS_USUARIO } from "../../constants/catalog";
const {
  editarPerfilIcon,
  historialIcon,
  modIcon,
  verResIcon,
  IoSunny,
  FaMoon,
  SiRetroarch,
  MdMuseum,
} = Icons;
import { useAuth } from "../../context/AuthProvider";
import UserImage from "./UserImage";

function MenuUsuario({ className }) {
  const { user, logout, tipoUsuario } = useAuth();
  const { isDarkMode, toggleTheme, isRetroMode } = useTheme();

  const formatName = (user) => {
    return `${user.usr_nombre} ${user.usr_ap_paterno} ${user.usr_ap_materno}`;
  };

  const [modo] = isDarkMode
    ? ["Modo Oscuro"]
    : isRetroMode
    ? ["Modo Retro"]
    : ["Modo Claro"];

  return (
    <motion.div
      className={`menu-usuario-container ${className}`}
      initial={{ visibility: "hidden" }}
      animate={{ visibility: "initial" }}
      exit={{ visibility: "hidden" }}
      transition={{ duration: 0.3 }}
    >
      <div className="menu-usuario-header">
        <UserImage src={user?.usr_foto} alt="Foto de Usuario" />
        <div className="menu-usuario-header-info">
          <h1>{formatName(user) || "Nombre de Usuario"}</h1>
          <p>{user?.usr_correo || "Correo"}</p>
          {user?.usr_tipo === 2 && <p>Administrador</p>}
          {user?.usr_tipo === 3 && <p>Moderador</p>}
          <Link
            id="header-info-link"
            to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/`}
          >
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
          <Link
            id="body-item-link"
            to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/Editar`}
          >
            Editar Perfil
          </Link>
        </div>
        {user?.usr_tipo === 1 && (
          <div className="menu-usuario-body-item">
            <div className="menu-usuario-body-item-img-container">
              <img src={historialIcon} alt="Historial de visitas" />
            </div>
            <Link
              id="body-item-link"
              to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/Historial`}
            >
              Historial de visitas
            </Link>
          </div>
        )}

        {user?.usr_tipo === 2 && (
          <>
            <div className="menu-usuario-body-item">
              <div className="menu-usuario-body-item-img-container">
                <img src={modIcon} alt="Historial de visitas" />
              </div>
              <Link
                id="body-item-link"
                to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/VerMods`}
              >
                Moderadores
              </Link>
            </div>

            <div className="menu-usuario-body-item">
              <div className="menu-usuario-body-item-img-container">
                <MdMuseum />
              </div>
              <Link
                id="body-item-link"
                to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/Museo/Registrar`}
              >
                Registrar Museo
              </Link>
            </div>
          </>
        )}

        {user?.usr_tipo === 3 && (
          <div className="menu-usuario-body-item">
            <div className="menu-usuario-body-item-img-container">
              <img src={verResIcon} alt="Historial de visitas" />
            </div>
            <Link
              id="body-item-link"
              to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/VerResenas`}
            >
              Reseñas
            </Link>
          </div>
        )}
      </div>
      <hr />
      <div className="menu-usuario-darkmode-container">
        <label className={isRetroMode ? "retrobg" : ""}>{modo}</label>
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
          <motion.div
            className="switch-button-span-container"
            animate={isDarkMode ? { rotate: 0 } : { rotate: 180 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
            id="switch-button-span"
          >
            {isDarkMode ? (
              <FaMoon />
            ) : isRetroMode ? (
              <SiRetroarch />
            ) : (
              <IoSunny />
            )}
          </motion.div>
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
