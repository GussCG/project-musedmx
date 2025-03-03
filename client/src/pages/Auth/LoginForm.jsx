import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

import loginImage from "../../assets/images/others/museo-login-image.png";

import Icons from "../../components/IconProvider";
const { eyeClosedIcon, eyeOpenIcon } = Icons;

import Eye from "../../components/Eye";

function LoginForm() {
  // Usar el hook useAuth para obtener las funciones y estados de autenticación
  const { login, isLoading, error } = useAuth();
  const [shown, setShown] = useState(false);

  const switchShown = () => {
    setShown(!shown);
  };

  const [password, setPassword] = useState("");

  useEffect(() => {}, []);

  return (
    <>
      <main id="login-main">
        <div id="login-form">
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
                  {/* <Eye /> */}
                </div>
                <input
                  type="submit"
                  value={isLoading ? "Cargando..." : "Iniciar Sesión"}
                  className="button"
                  id="login-button"
                  disabled={isSubmitting || isLoading}
                />
              </Form>
            )}
          </Formik>
          {error && <p>{error}</p>}
          <Link to="/Auth/Recuperar">¿Olvidaste tu contraseña?</Link>
          <p>
            ¿No tienes una cuenta aún?{" "}
            <Link to="/Auth/Registrarse">Regístrate aquí</Link>
          </p>
        </div>
        <div id="login-linea"></div>
        <div id="login-imagen">
          <img src={loginImage} alt="Login" />
        </div>
      </main>
    </>
  );
}

export default LoginForm;
