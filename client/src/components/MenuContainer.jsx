import { Link } from 'react-router';
import { useAuth } from '../context/AuthProvider'
import { forwardRef } from 'react';

const MenuContainer = forwardRef( (props, ref) =>{
    const {user, login, logout} = useAuth()

    return (
        <div 
            className="menu-container" 
            id="menu-responsive"
            ref={ref}
        >
            <div className="menu-header">
            </div>
            <div className="menu-body">
                <ul>
                    <li><Link to="/" onClick={props.toggleMenu}>Inicio</Link></li>
                    <li><Link to="/Museos" onClick={props.toggleMenu}>Ver Museos</Link></li>
                    <li><Link to="/Museos/CercaDeMi" onClick={props.toggleMenu}>Cerca de mi</Link></li>
                    <li><Link to="/Museos/Populares" onClick={props.toggleMenu}>Populares</Link></li>
                </ul>
            </div>  
            <div className="menu-footer">
                {user ? (
                    <Link to="/Perfil" onClick={props.toggleMenu}>
                        <img 
                            src={user.foto} 
                            alt="Avatar" 
                            id="nav-avatar"
                            className='user-foto'
                        />
                    </Link>
                ) : (
                    <Link to="/Auth/Iniciar" onClick={props.toggleMenu}>Iniciar Sesión</Link>
                )}
            </div>
        </div>
    )
})

export default MenuContainer