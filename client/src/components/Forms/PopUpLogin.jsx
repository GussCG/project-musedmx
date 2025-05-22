import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../context/AuthProvider";
import LoginErrorMessage from "./LoginErrorMessage";
import { Formik, Form } from "formik";
import { Link } from "react-router";
import Icons from "../Other/IconProvider";
const { IoClose, LuEye, LuEyeClosed } = Icons;

function PopUpLogin() {
  const { login, isLogginPopupOpen, setIsLogginPopupOpen, isLoading, error } =
    useAuth();
  const [shown, setShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = () => setErrorMessage("");

  if (!isLogginPopupOpen) return null;

  const switchShown = () => {
    setShown(!shown);
  };

  return (
    <AnimatePresence>
      {isLogginPopupOpen && (
        <motion.div
          className="bg-opaco-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <main id="main-login-popup">
            <button
              id="close-login-popup"
              onClick={() => {
                setIsLogginPopupOpen(false);
                localStorage.removeItem("redirectPath");
              }}
            >
              <IoClose />
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
                <div className="login-popup-container">
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
                      <label htmlFor="login-frm-email">
                        Correo Electrónico
                      </label>
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
                            x: -20,
                          }}
                          transition={{
                            duration: 0.01,
                            ease: "easeIn",
                            type: "spring",
                            bounce: 0.4,
                            stiffness: 100,
                            damping: 20,
                          }}
                          style={{
                            overflow: "hidden",
                            width: "100%",
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PopUpLogin;
