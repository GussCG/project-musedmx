import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useOTP } from "../../hooks/Usuario/useOTP";
import AuthOTPModal from "../../components/Forms/AuthOTPModal";
import { use, useState } from "react";
import ToastMessage from "../../components/Other/ToastMessage";
import useUsuario from "../../hooks/Usuario/useUsuario";

function RecuperarPass() {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [correo, setCorreo] = useState("");
  const { recuperarContrasena } = useUsuario();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="recuperar-main">
        <h1>Olvidaste tu contraseña?</h1>
        <Formik
          initialValues={{
            rec_frm_email: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await recuperarContrasena({
                usr_correo: values.rec_frm_email,
              });
              if (response?.success) {
                ToastMessage({
                  tipo: "success",
                  mensaje: "Correo de recuperación enviado exitosamente.",
                  position: "top-right",
                });
                setCorreo(values.rec_frm_email);
                setShowOtpModal(true);
              } else {
                ToastMessage({
                  tipo: "error",
                  mensaje: response.response.data.message,
                  position: "top-right",
                });
              }
            } catch (error) {
              console.error("Error al generar OTP:", error);
              ToastMessage({
                tipo: "error",
                mensaje:
                  "Ocurrió un error al enviar el correo de recuperación.",
                position: "top-right",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <p> Ingresa el correo electrónico con el que estás registrado</p>
              <div className="registros-field">
                <Field
                  type="email"
                  id="rec_frm_email"
                  name="rec_frm_email"
                  placeholder="Correo Electrónico"
                  required
                />
                <label htmlFor="rec_frm_email" className="frm-label">
                  Correo Electrónico
                </label>
              </div>
              <Field type="submit" value="Recuperar" className="button" />
            </Form>
          )}
        </Formik>
      </main>

      {showOtpModal && (
        <AuthOTPModal
          correo={correo}
          onClose={() => setShowOtpModal(false)}
          redirectTo="/Auth/CambiarContraseña"
        />
      )}
    </motion.div>
  );
}

export default RecuperarPass;
