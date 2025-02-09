import { useRef } from 'react'
import {Link, Outlet} from 'react-router-dom'

import logo from '../assets/images/placeholders/logo_placeholder.png'
import menuIcon from '../assets/icons/menu-icon.png'

import MenuContainer from './MenuContainer'
import { useAuth } from '../context/AuthProvider'

function NavBarMenu() {

  const {user, login, logout} = useAuth()

  const { isAuthenticated } = useAuth();

  const botonRef = useRef(null)
  const menuRef = useRef(null)

  const toggleMenu = () => {
    // Si el boton y el menu existen se cambia la clase de ambos para mostrar/ocultar el menu
    if (botonRef.current && menuRef.current) {
      botonRef.current.classList.toggle('close')
      menuRef.current.classList.toggle('show')
    }
  } 

  return (
    <>
      <nav id="nav-menu-container">
        <ul id="nav-menu">
            <li><Link to="/">
                <p id="nav-logo">Inicio</p>
                <img 
                  src={logo} 
                  alt="Logo®" 
                />
            </Link></li>
            <li className="nav-a"><Link to="/Museos">Ver Museos</Link></li>
            <li className="nav-a"><Link to="/Museos/CercaDeMi">Cerca de mi</Link></li>
            <li className="nav-a"><Link to="/Museos/Populares">Populares</Link></li>
            {/* Si el usuario esta loggeado se cambia por un link a su perfil */}
            {user ? (
              <li className="nav-a">
                <Link to="/Perfil">
                  <img 
                    src={user.foto} 
                    alt="Avatar" 
                    id="nav-avatar"
                    className='user-foto'
                  />
                </Link>
              </li>
            ) : (
              <li className="nav-a"><Link to="/Auth/Iniciar" id='nav-login-button'>Iniciar Sesión</Link></li>
            )}
        </ul>
        <button 
          className="menu-header-button" 
          id="menu-button"
          ref={botonRef}
          onClick={toggleMenu}
        >
            <span>
              <img src={menuIcon} alt='Menu'/>
            </span>
        </button>
      </nav>

      <MenuContainer ref={menuRef} toggleMenu={toggleMenu}/>
    </>
  )
}

export default NavBarMenu