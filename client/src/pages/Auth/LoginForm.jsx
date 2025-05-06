import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

import loginImage from "../../assets/images/others/museo-login-image.png";

import Icons from "../../components/IconProvider";
const { eyeClosedIcon, eyeOpenIcon } = Icons;

import Eye from "../../components/Eye";
import LoginErrorMessage from "../../components/LoginErrorMessage";
import { LuEye, LuEyeClosed } from "react-icons/lu";

function LoginForm() {
  // Usar el hook useAuth para obtener las funciones y estados de autenticación
  const { login, isLoading, error } = useAuth();
  const [shown, setShown] = useState(false);

  const [errorMessage, setErrorMessage] = useState(
    "Correo o contraseña incorrecta"
  );

  const clearError = () => setErrorMessage("");

  const switchShown = () => {
    setShown(!shown);
  };

//   const [password, setPassword] = useState("");

  useEffect(() => {}, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
                  usr_correo: values.login_frm_email,
                  usr_contrasenia: values.login_frm_password,
                });
              } catch (error) {
                setErrorMessage(error.message);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <div className="login-field">
                  <input
                    type="email"
                    id="login-frm-email"
                    name="login_frm_email"
                    placeholder="Correo Electrónico"
					onChange={handleChange}
  					value={values.login_frm_email}
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
                    // onChange={(e) => setPassword(e.target.value)}
                    // value={password}
					onChange={handleChange}
  					value={values.login_frm_password}
                    required
                  />
                  <label htmlFor="login-frm-password">Contraseña</label>
                  <motion.div
                    className="eye"
                    onClick={switchShown}
                    key={shown ? "open" : "closed"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {shown ? <LuEye /> : <LuEyeClosed />}
                  </motion.div>
                </div>
                <AnimatePresence>
                  {errorMessage && (
                    <LoginErrorMessage
                      error={errorMessage}
                      onClose={clearError}
                    />
                  )}
                </AnimatePresence>
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
    </motion.div>
  );
}

export default LoginForm;
