import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Icons from "../../components/Other/IconProvider";
const { LuEye, LuEyeClosed, MuseDMXLogoVertical } = Icons;
import AuthOTPModal from "../../components/Forms/AuthOTPModal";
import ToastMessage from "../../components/Other/ToastMessage";

function LoginForm() {
  // Usar el hook useAuth para obtener las funciones y estados de autenticación
  const { login, isLoading } = useAuth();
  const [shown, setShown] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

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
                setErrorMessage("");
                await login({
                  usr_correo: values.login_frm_email,
                  usr_contrasenia: values.login_frm_password,
                });
              } catch (error) {
                const msg =
                  error.response?.data?.message ||
                  "Ocurrió un error inesperado.";
                setErrorMessage(String(msg));
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

                {!!errorMessage && (
                  <ToastMessage
                    tipo="error"
                    mensaje={errorMessage}
                    onClose={clearError}
                  />
                )}

                <button
                  type="submit"
                  className="button"
                  id="login-button"
                  disabled={isSubmitting || isLoading}
                >
                  {isLoading ? "Cargando..." : "Entrar"}
                </button>
              </Form>
            )}
          </Formik>

          <Link to="/Auth/Recuperar">¿Olvidaste tu contraseña?</Link>
          <p>
            ¿No tienes una cuenta aún?{" "}
            <Link to="/Auth/Registrarse">Regístrate aquí</Link>
          </p>
          <p>
            ¿Tienes una cuenta, pero no estás verificado?{" "}
            <Link
              onClick={() => {
                setShowOtpModal(true);
              }}
            >
              Verifica aquí
            </Link>
          </p>
        </motion.div>
        <div id="login-linea"></div>
        <div id="login-imagen">
          <img src={MuseDMXLogoVertical} alt="Login" />
        </div>
      </main>

      {showOtpModal && <AuthOTPModal onClose={() => setShowOtpModal(false)} />}
    </motion.div>
  );
}

export default LoginForm;
