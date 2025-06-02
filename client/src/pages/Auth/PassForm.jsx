import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { motion } from "framer-motion";
import ValidPassword from "../../components/Forms/ValidPassword";
import Icons from "../../components/Other/IconProvider";
const { LuEye, LuEyeClosed } = Icons;

function PassForm() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isValidPass, setIsValidPass] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  // Para validar la contraseña validaciones individuales
  // Tiene que tener minimo 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial
  const [faltaNumero, setFaltaNumero] = useState(false);
  const [faltaMayuscula, setFaltaMayuscula] = useState(false);
  const [faltaMinuscula, setFaltaMinuscula] = useState(false);
  const [faltaCaracterEspecial, setFaltaCaracterEspecial] = useState(false);
  const [longitud, setLongitud] = useState(false);

  // Expresiones regulares para validar la contraseña
  const numeroRegex = /\d/;
  const mayusculaRegex = /[A-Z]/;
  const minusculaRegex = /[a-z]/;
  const caracterEspecialRegex = /[^A-Za-z0-9]/;

  useEffect(() => {
    if (password === "") {
      setIsValidPass(false);
      setFaltaNumero(false);
      setFaltaMayuscula(false);
      setFaltaMinuscula(false);
      setFaltaCaracterEspecial(false);
      setLongitud(false);
      return;
    }

    const esNumeroValido = numeroRegex.test(password);
    const esMayusculaValida = mayusculaRegex.test(password);
    const esMinusculaValida = minusculaRegex.test(password);
    const esCaracterEspecialValido = caracterEspecialRegex.test(password);
    const esLongitudValida = password.length >= 8;

    // Actualizamos los estados
    setFaltaNumero(esNumeroValido);
    setFaltaMayuscula(esMayusculaValida);
    setFaltaMinuscula(esMinusculaValida);
    setFaltaCaracterEspecial(esCaracterEspecialValido);
    setLongitud(esLongitudValida);

    setIsValidPass(
      esNumeroValido &&
        esMayusculaValida &&
        esMinusculaValida &&
        esCaracterEspecialValido &&
        esLongitudValida
    );
  }, [password]);

  // Validar la confirmación de la contraseña
  useEffect(() => {
    setIsPasswordMatch(
      password !== "" && password2 !== "" && password === password2
    );
  }, [password, password2]);

  // Para mostrar o no la contraseña
  const [shown1, setShown1] = useState(false);
  const [shown2, setShown2] = useState(false);

  const switchShown1 = () => {
    setShown1(!shown1);
  };

  const switchShown2 = () => {
    setShown2(!shown2);
  };

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    setIsFormValid(isValidPass && isPasswordMatch);
  }, [isValidPass, isPasswordMatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="cambiar-pass-main">
        <div className="cambiar-pass-header">
          <h1>Recuperar contraseña</h1>
          <p>
            Introduce una nueva contraseña para tu cuenta. Asegúrate de que sea
            segura y cumpla con los requisitos.
          </p>
        </div>

        <Formik
          initialValues={{
            pass_frm_password: "",
            pass_frm_confirmPassword: "",
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
              <div className="registros-field">
                <Field
                  type={shown1 ? "text" : "password"}
                  id="signin-frm-password"
                  name="pass_frm_password"
                  placeholder="Contraseña"
                  ref={passwordRef}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <label htmlFor="signin-frm-password" className="frm-label">
                  Contraseña
                </label>
                <motion.div
                  className="eye"
                  onClick={switchShown1}
                  key={shown1 ? "open" : "closed"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {shown1 ? <LuEye /> : <LuEyeClosed />}
                </motion.div>
                {password.length > 0 && !isValidPass && (
                  <ValidPassword
                    faltaNumero={faltaNumero}
                    faltaMayuscula={faltaMayuscula}
                    faltaMinuscula={faltaMinuscula}
                    faltaCaracterEspecial={faltaCaracterEspecial}
                    longitud={longitud}
                  />
                )}
              </div>
              <div className="registros-field">
                <Field
                  type={shown2 ? "text" : "password"}
                  id="signin-frm-confirmPassword"
                  name="pass_frm_confirmPassword"
                  placeholder="Contraseña"
                  ref={password2Ref}
                  onChange={(e) => setPassword2(e.target.value)}
                  value={password2}
                  required
                  style={
                    isPasswordMatch
                      ? { borderColor: "green", borderWidth: "2px" }
                      : { borderColor: "red", borderWidth: "2px" }
                  }
                />
                <label htmlFor="signin-frm-password" className="frm-label">
                  Confirmar Contraseña
                </label>
                <motion.div
                  className="eye"
                  onClick={switchShown2}
                  key={shown2 ? "open" : "closed"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {shown2 ? <LuEye /> : <LuEyeClosed />}
                </motion.div>
              </div>

              <Field
                type="submit"
                className={`button ` + (isFormValid ? "" : "disabled")}
                value="Cambiar contraseña"
                disabled={!isValidPass || !isPasswordMatch}
              />
            </Form>
          )}
        </Formik>
      </main>
    </motion.div>
  );
}

export default PassForm;
