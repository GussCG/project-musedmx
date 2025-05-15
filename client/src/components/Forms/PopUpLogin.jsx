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
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("Correo Invalido");

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
                    email: values.login_frm_email,
                    password: values.login_frm_password,
                  });
                } catch (error) {
                  setErrorMessage(error);
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
                    {errorMessage && (
                      <LoginErrorMessage
                        error={errorMessage}
                        onClose={clearError}
                      />
                    )}
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
