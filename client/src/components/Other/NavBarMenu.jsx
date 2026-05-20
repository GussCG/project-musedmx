import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";

import Icons from "./IconProvider";
const { MuseDMXLogo, IoMenu, MdFlashlightOff, MdFlashlightOn } = Icons;

import MenuContainer from "./MenuContainer";
import { useAuth } from "../../context/AuthProvider";
import MenuUsuario from "../User/MenuUsuario";
import UserImage from "../User/UserImage";
import { useTheme } from "../../context/ThemeProvider";

function NavBarMenu() {
  const { user } = useAuth();

  const [showMenu, setShowMenu] = useState(false);
  const menuUserRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const botonRef = useRef(null);
  const menuRef = useRef(null);

  const { toggleTheme, isDarkMode } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (botonRef.current && menuRef.current) {
      botonRef.current.classList.toggle("close");
      menuRef.current.classList.toggle("show");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenuUser = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuUserRef.current && !menuUserRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <>
      <nav
        id="nav-menu-container"
        ref={navbarRef}
        className={scrolled ? "scrolled" : ""}
      >
        <ul id="nav-menu">
          <li>
            <Link className="navbarmenu-link" to="/">
              <img src={MuseDMXLogo} alt="Logo®" id="nav-logo-img" />
            </Link>
          </li>
          <li className="nav-a" id="ver-museos">
            <Link className="navbarmenu-link" to="/Museos">
              Ver Museos
            </Link>
          </li>
          <li className="nav-a" id="ver-cerca-de-mi">
            <Link className="navbarmenu-link" to="/Museos/CercaDeMi">
              Cerca de mí
            </Link>
          </li>
          <li className="nav-a" id="ver-comunidad">
            <Link className="navbarmenu-link" to="/Comunidad">
              Comunidad
            </Link>
          </li>
          <li className="nav-a" id="ver-noticias">
            <Link className="navbarmenu-link" to="/Noticias">
              Noticias
            </Link>
          </li>
          {/* Si el usuario esta loggeado se cambia por un link a su perfil */}
          {user ? (
            <li className="nav-a" ref={menuUserRef}>
              <div
                className="nav-user-img-container"
                onClick={toggleMenuUser}
                style={{ cursor: "pointer" }}
              >
                <UserImage
                  src={user.usr_foto || userPlaceholder}
                  alt="Avatar"
                  id="nav-user-img"
                />
              </div>
              <MenuUsuario className={showMenu ? "show" : ""} />
            </li>
          ) : (
            <div className="right-buttons">
              <li className="nav-a">
                <Link
                  to="/Auth/Iniciar"
                  className="button-link"
                  id="nav-button"
                  style={{
                    minWidth: "150px",
                    minHeight: "30px",
                    fontSize: "16px",
                  }}
                >
                  <label>Iniciar Sesión</label>
                </Link>
              </li>
              <button className="theme-toggle-button" onClick={toggleTheme}>
                {isDarkMode ? <MdFlashlightOn /> : <MdFlashlightOff />}
              </button>
            </div>
          )}
        </ul>
        <button
          className="menu-header-button"
          id="menu-button"
          ref={botonRef}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
        >
          <IoMenu />
        </button>
      </nav>

      <MenuContainer
        ref={menuRef}
        toggleMenu={toggleMenu}
        isOpen={isMenuOpen}
      />
    </>
  );
}

export default NavBarMenu;
