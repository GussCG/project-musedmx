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

  const [password, setPassword] = useState("");

  useEffect(() => {}, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="login-main">
        <motion.div id="login-form" layout>
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
                setErrorMessage(error.message);
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

                <AnimatePresence mode="popLayout">
                  {errorMessage && (
                    <motion.div
                      layout
                      className="error-message-container"
                      key={"error-message"}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      exit={{
                        scale: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                        type: "spring",
                        bounce: 0.4,
                        stiffness: 100,
                        damping: 20,
                      }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <LoginErrorMessage
                        error={errorMessage}
                        onClose={clearError}
                      />
                    </motion.div>
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
        </motion.div>
        <div id="login-linea"></div>
        <div id="login-imagen">
          <img src={loginImage} alt="Login" />
        </div>
      </main>
    </motion.div>
  );
}

export default LoginForm;
