import { useTheme } from "../../context/ThemeProvider";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";
import Icons from "../Other/IconProvider";
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

function MenuUsuario({ className }) {
  const { user, logout, tipoUsuario } = useAuth();
  const { isDarkMode, toggleTheme, isRetroMode } = useTheme();

  const formatName = (user) => {
    return `${user.nombre} ${user.apPaterno} ${user.apMaterno}`;
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
          <>
            <div className="menu-usuario-body-item">
              <div className="menu-usuario-body-item-img-container">
                <img src={modIcon} alt="Historial de visitas" />
              </div>
              <Link id="body-item-link" to={`/${tipoUsuario}/VerMods`}>
                Moderadores
              </Link>
            </div>

            <div className="menu-usuario-body-item">
              <div className="menu-usuario-body-item-img-container">
                <MdMuseum />
              </div>
              <Link id="body-item-link" to={`/${tipoUsuario}/Museo/Registrar`}>
                Registrar Museo
              </Link>
            </div>
          </>
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
