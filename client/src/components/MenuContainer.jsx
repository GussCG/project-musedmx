import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { forwardRef } from "react";

const MenuContainer = forwardRef((props, ref) => {
  const { user, logout, tipoUsuario } = useAuth();

  const tipo = {
    1: "Usuario",
    2: "Admin",
    3: "Mod",
  };

  return (
    <div className="menu-container" id="menu-responsive" ref={ref}>
      <div className="menu-header"></div>
      <div className="menu-body">
        <ul>
          <li>
            <Link to="/" onClick={props.toggleMenu}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/Museos" onClick={props.toggleMenu}>
              Ver Museos
            </Link>
          </li>
          <li>
            <Link to="/Museos/CercaDeMi" onClick={props.toggleMenu}>
              Cerca de mi
            </Link>
          </li>
          <li>
            <Link to="/Museos/Populares" onClick={props.toggleMenu}>
              Populares
            </Link>
          </li>
        </ul>
      </div>
      <div className="menu-footer">
        {user ? (
          <>
            <Link to={`/${tipoUsuario}`} onClick={props.toggleMenu}>
              Ver Mi Perfil
            </Link>
            <button onClick={(props.toggleMenu, () => logout())}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/Auth/Iniciar" onClick={props.toggleMenu}>
            Iniciar Sesión
          </Link>
        )}
      </div>
    </div>
  );
});

export default MenuContainer;
