import { Link } from 'react-router'
import '../styles/pages/NotFound.scss'

function NotFound() {
  return (
    <main id="notfound-main">
        <div id="notfound-text">
            <h1>404</h1>
            <h2>¡Ups! No encontramos la página que buscas</h2>
            <p>Lo sentimos, pero la página que buscas no existe, ha sido eliminada, o ha cambiado de nombre.</p>
            <Link to="/">Regresar a la página principal</Link>
        </div>
    </main>
  )
}

export default NotFound