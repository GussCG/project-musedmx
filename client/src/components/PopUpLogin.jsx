import React, { useEffect, useState } from "react";

import { useAuth } from "../context/AuthProvider";

import closeIcon from "../assets/icons/close-b-icon.png";
import eyeOpenIcon from "../assets/icons/eye-opened-icon.png";
import eyeClosedIcon from "../assets/icons/eye-closed-icon.png";
import { Formik, Form } from "formik";
import { Link } from "react-router";

function PopUpLogin() {
  const { login, isLogginPopupOpen, setIsLogginPopupOpen, isLoading, error } =
    useAuth();

  const [shown, setShown] = useState(false);
  const [password, setPassword] = useState("");

  if (!isLogginPopupOpen) return null;

  const switchShown = () => {
    setShown(!shown);
  };

  return (
    <>
      <div className="bg-opaco-blur"></div>
      <main id="main-login-popup">
        <button
          id="close-login-popup"
          onClick={() => setIsLogginPopupOpen(false)}
        >
          <img src={closeIcon} alt="Cerrar" />
        </button>
        <h1>Iniciar Sesión</h1>
        <Formik
          initialValues={{
            login_frm_email: "",
            login_frm_password: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await login({
                email: values.login_frm_email,
                password: values.login_frm_password,
              });
            } catch (error) {
              console.error(error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleChange, handleSubmit, isSubmitting }) => (
            <div className="login-popup-container">
              <Form onSubmit={handleSubmit}>
                <div className="login-field">
                  <input
                    type="email"
                    id="login-frm-email"
                    name="login_frm_email"
                    placeholder="Correo Electrónico"
                    required
                  />
                  <label htmlFor="login-frm-email">Correo Electrónico</label>
                </div>
                <div className="login-field">
                  <input
                    type={shown ? "text" : "password"}
                    id="login-frm-password"
                    name="login_frm_password"
                    placeholder="Contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                  <label htmlFor="login-frm-password">Contraseña</label>
                  <img
                    src={shown ? eyeOpenIcon : eyeClosedIcon}
                    onClick={switchShown}
                    alt="Mostrar contraseña"
                    id="eye"
                    className="eye"
                  />
                </div>
                <input
                  type="submit"
                  value={isLoading ? "Cargando..." : "Iniciar Sesión"}
                  className="button"
                  id="login-button"
                  disabled={isSubmitting || isLoading}
                />
              </Form>
              <Link
                to="/Auth/Recuperar"
                onClick={() => setIsLogginPopupOpen(false)}
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <p>
                ¿No tienes una cuenta aún?{" "}
                <Link
                  to="/Auth/Registrarse"
                  onClick={() => setIsLogginPopupOpen(false)}
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          )}
        </Formik>
      </main>
    </>
  );
}

export default PopUpLogin;
