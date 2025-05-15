import { Link } from "react-router";
import "../../styles/pages/NotFound.scss";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="notfound-main">
        <div id="notfound-text">
          <h1>404</h1>
          <h2>¡Ups! No encontramos la página que buscas</h2>
          <p>
            Lo sentimos, pero la página que buscas no existe, ha sido eliminada,
            o ha cambiado de nombre.
          </p>
          <Link to="/">Regresar a la página principal</Link>
        </div>
      </main>
    </motion.div>
  );
}

export default NotFound;
