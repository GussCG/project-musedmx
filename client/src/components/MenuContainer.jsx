import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { forwardRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useTheme } from "../context/ThemeProvider";

import Icons from "./IconProvider";
const { CgClose, IoSunny, FaMoon, SiRetroarch } = Icons;

const MenuContainer = forwardRef(({ isOpen, toggleMenu }, ref) => {
  const { user, logout, tipoUsuario } = useAuth();

  const { isDarkMode, toggleTheme, isRetroMode } = useTheme();

  const [modo] = isDarkMode
    ? ["Modo Oscuro"]
    : isRetroMode
    ? ["Modo Retro"]
    : ["Modo Claro"];

  const buttonPosition = { x: "100%", y: "0" };

  const menuVariants = {
    hidden: {
      clipPath: `circle(0% at ${buttonPosition.x} ${buttonPosition.y})`,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    visible: {
      clipPath: `circle(150% at ${buttonPosition.x} ${buttonPosition.y})`,
      transition: {
        duration: 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="menu-container"
            id="menu-responsive"
            ref={ref}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="boton-cerrar">
              <button
                onClick={toggleMenu}
                aria-label="Cerrar menú"
                className="close-button"
              >
                <CgClose />
              </button>
            </div>
            <div className="menu-header"></div>
            <div className="menu-body">
              <ul>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/" onClick={toggleMenu}>
                    Inicio
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/Museos" onClick={toggleMenu}>
                    Ver Museos
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/Museos/CercaDeMi" onClick={toggleMenu}>
                    Cerca de mi
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/Museos/Populares" onClick={toggleMenu}>
                    Populares
                  </Link>
                </motion.li>
              </ul>
            </div>
            <div className="menu-footer">
              {user ? (
                <>
                  <div className="menu-container-darkmode-container">
                    <label className={isRetroMode ? "retrobg" : ""}>
                      {modo}
                    </label>
                    <div className="switch-button-dm">
                      <input
                        type="checkbox"
                        name="fotos-filter"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        id="switch-label"
                        className="switch-button__checkbox"
                      />
                      <label
                        htmlFor="switch-label"
                        className="switch-button__label"
                      >
                        <span className="switch-button-slider"></span>
                      </label>
                      <motion.div
                        className="switch-button-span-container"
                        animate={isDarkMode ? { rotate: 0 } : { rotate: 180 }}
                        transition={{
                          duration: 0.3,
                          type: "spring",
                          stiffness: 100,
                        }}
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
                  <Link to={`/${tipoUsuario}`} onClick={toggleMenu}>
                    Ver Mi Perfil
                  </Link>
                  <div className="menu-footer-logout">
                    <button onClick={(toggleMenu, () => logout())}>
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/Auth/Iniciar" onClick={toggleMenu}>
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

MenuContainer.displayName = "MenuContainer";

export default MenuContainer;
