import { Formik, Form, Field } from "formik";
import React from "react";

import { motion } from "framer-motion";

function RecuperarPass() {
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
              console.log(values);
            } catch (error) {
              console.error(error);
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
    </motion.div>
  );
}

export default RecuperarPass;
