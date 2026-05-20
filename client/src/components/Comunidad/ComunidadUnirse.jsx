import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

function ComunidadUnirse() {
  const { user } = useAuth();
  return (
    <div className="comunidad-unirse">
      <h2 className="title">Tu voz también es arte.</h2>
      <p className="description">
        {!user
          ? "Inicia sesión para compartir tus experiencias, calificar los museos que visitas y guardar tus favoritos."
          : "¡Bienvenido! Comparte tus experiencias, califica los museos que visitas y guarda  tus favoritos."}
      </p>

      <div className="buttons">
        {!user ? (
          <>
            <Link to="/auth/Iniciar" className="btn ">
              Iniciar Sesión
            </Link>
            <Link to="/auth/Registrarse" className="btn secondary">
              Crear una Cuenta
            </Link>
          </>
        ) : (
          <Link to="/Usuario" className="btn ">
            Ver Mi Perfil
          </Link>
        )}
      </div>
    </div>
  );
}

export default ComunidadUnirse;
