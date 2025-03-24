import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import userPlaceholder from "../assets/images/placeholders/user_placeholder.png";

import Icons from "./IconProvider";
const { menuIcon, logo } = Icons;

import MenuContainer from "./MenuContainer";
import { useAuth } from "../context/AuthProvider";
import MenuUsuario from "./MenuUsuario";

function NavBarMenu() {
  const { user, login, logout } = useAuth();

  const { isAuthenticated } = useAuth();

  const [showMenu, setShowMenu] = useState(false);
  const menuUserRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);

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

  const botonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    // Si el boton y el menu existen se cambia la clase de ambos para mostrar/ocultar el menu
    if (botonRef.current && menuRef.current) {
      botonRef.current.classList.toggle("close");
      menuRef.current.classList.toggle("show");
    }
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
              <p id="nav-logo">Inicio</p>
              <img src={logo} alt="Logo®" id="nav-logo-img" />
            </Link>
          </li>
          <li className="nav-a">
            <Link className="navbarmenu-link" to="/Museos">
              Ver Museos
            </Link>
          </li>
          <li className="nav-a">
            <Link className="navbarmenu-link" to="/Museos/CercaDeMi">
              Cerca de mi
            </Link>
          </li>
          <li className="nav-a">
            <Link className="navbarmenu-link" to="/Museos/Populares">
              Populares
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
                <img
                  src={user.foto || userPlaceholder}
                  alt="Avatar"
                  id="nav-user-img"
                />
              </div>
              <MenuUsuario className={showMenu ? "show" : ""} />
            </li>
          ) : (
            <li className="nav-a">
              <Link to="/Auth/Iniciar" className="button" id="nav-button">
                Iniciar Sesión
              </Link>
            </li>
          )}
        </ul>
        <button
          className="menu-header-button"
          id="menu-button"
          ref={botonRef}
          onClick={toggleMenu}
        >
          <span>
            <img src={menuIcon} alt="Menu" />
          </span>
        </button>
      </nav>

      <MenuContainer ref={menuRef} toggleMenu={toggleMenu} />
    </>
  );
}

export default NavBarMenu;
