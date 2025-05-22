import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import loginImage from "../../assets/images/others/museo-login-image.png";
import Icons from "../../components/Other/IconProvider";
const { LuEye, LuEyeClosed } = Icons;
import LoginErrorMessage from "../../components/Forms/LoginErrorMessage";

function LoginForm() {
  // Usar el hook useAuth para obtener las funciones y estados de autenticación
  const { login, isLoading, error } = useAuth();
  const [shown, setShown] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const clearError = () => setErrorMessage("");

  const switchShown = () => {
    setShown(!shown);
  };

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
                  usr_correo: values.login_frm_email,
                  usr_contrasenia: values.login_frm_password,
                });
              } catch (error) {
                setErrorMessage(error.response.data.message);
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
