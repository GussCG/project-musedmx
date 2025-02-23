import { Formik, Form, Field } from "formik";
import React from "react";

function RecuperarPass() {
  return (
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
            <div class="registros-field">
              <Field
                type="email"
                id="rec_frm_email"
                name="rec_frm_email"
                placeholder="Correo Electrónico"
                required
              />
              <label for="rec_frm_email" class="frm-label">
                Correo Electrónico
              </label>
            </div>
            <Field type="submit" value="Recuperar" className="button" />
          </Form>
        )}
      </Formik>
    </main>
  );
}

export default RecuperarPass;
