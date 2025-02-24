import React, { useRef, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { toast, Bounce } from "react-toastify";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import modPlaceholder from "../assets/images/placeholders/user_placeholder.png";

import eyeOpenIcon from "../assets/icons/eye-opened-icon.png";
import eyeClosedIcon from "../assets/icons/eye-closed-icon.png";

function ModForm() {
  // Estados
  const [tel, setTel] = useState();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const signInButtonRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);

  // Fecha de nacimiento
  let today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  today = today.toISOString().split("T")[0];

  // Expresion regular para validar la contraseña
  // Al menos 8 caracteres, una letra mayuscula, una letra minuscula y un numero
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  // Manejar el cambio de la contraseña
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setIsValid(passwordRegex.test(newPassword));
  };

  // Manejar el cambio de la confirmacion de la contraseña
  const handlePassword2Change = (event) => {
    const confirmPassword = event.target.value;
    setPassword2(confirmPassword);
    setIsPasswordMatch(password === confirmPassword);
  };

  // Desabilitar el boton de registro si algun campo es invalido
  const isFormValid = isValid && isPasswordMatch && tel;

  // Registrar moderador
  const handleRegister = (values) => {
    try {
      const modData = new FormData();

      if (!isPossiblePhoneNumber(tel)) {
        toast.error("Número de teléfono inválido", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        return;
      }

      modData.append("nombre", values.signinfrmnombre);
      modData.append("apPaterno", values.signinfrmappaterno);
      modData.append("apMaterno", values.signinfrmapmaterno);
      modData.append("email", values.signinfrmemail);
      modData.append("password", password);
      modData.append("tel", tel);
      modData.append("fecNac", values.signinfrmfecnac);
      modData.append("tipoUsuario", 3);
      modData.append("foto", modPlaceholder);

      // Lógica para enviar los datos al backend

      // Manejo de respuesta del backend

      console.log("Moderador registrado");
      console.log("Datos del moderador:");
      modData.forEach((value, key) => {
        console.log(key + ": " + value);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [shown1, setShown1] = useState(false);
  const [shown2, setShown2] = useState(false);

  const switchShown1 = () => {
    setShown1(!shown1);
  };

  const switchShown2 = () => {
    setShown2(!shown2);
  };

  // Logica para validar las contraseñas
  useEffect(() => {
    let password = passwordRef.current;
    let password2 = password2Ref.current;
    let signInButton = signInButtonRef.current;

    // Validamos las contraseña y la confirmacion de la contraseña
    // Si son iguales se pinta de verde y se activa el boton de registro
    if (signInButton) {
      signInButton.disabled = true;
    }

    const validatePasswords = () => {
      if (password2.value == "") {
        password2.style.borderColor = "black";
        password2.style.borderWidth = "1px";
        password2.setCustomValidity("");
        signInButton.disabled = true;
        return;
      }

      if (password.value !== password2.value) {
        password2.setCustomValidity("Las contraseñas no coinciden");
        password2.style.borderColor = "red";
        password2.style.borderWidth = "2px";
        signInButton.disabled = true;
      } else {
        password2.setCustomValidity("");
        password2.style.borderColor = "green";
        password2.style.borderWidth = "2px";
        signInButton.disabled = false;
      }
    };

    password?.addEventListener("input", validatePasswords);
    password2?.addEventListener("input", validatePasswords);

    return () => {
      password?.removeEventListener("input", validatePasswords);
      password2?.removeEventListener("input", validatePasswords);
    };
  }, []);

  return (
    <>
      <main id="registros-main">
        <div id="registros-form">
          <Formik
            initialValues={{
              signinfrmnombre: "",
              signinfrmappaterno: "",
              signinfrmapmaterno: "",
              signinfrmemail: "",
              signinfrmtelefono: "",
              signinfrmfecnac: "",
              signinfrmpassword: "",
              signinfrmrepassword: "",
            }}
            onSubmit={(values) => {
              // console.log(values);
              handleRegister(values);
            }}
          >
            {({ setFieldValue, values }) => (
              <Form id="signin-form">
                <div className="registros-container">
                  <div className="registros-datos">
                    <h1>Datos del moderador</h1>
                    <div className="registros-field">
                      <Field
                        type="text"
                        id="signin-frm-nombre"
                        name="signinfrmnombre"
                        placeholder="Nombre"
                        required
                      />
                      <label htmlFor="signin-frm-nombre" className="frm-label">
                        Nombre
                      </label>
                    </div>
                    <div className="registros-field">
                      <Field
                        type="text"
                        id="signin-frm-appaterno"
                        name="signinfrmappaterno"
                        placeholder="Apellido Paterno"
                        required
                      />
                      <label
                        htmlFor="signin-frm-appaterno"
                        className="frm-label"
                      >
                        Apellido Paterno
                      </label>
                    </div>
                    <div className="registros-field">
                      <Field
                        type="text"
                        id="signin-frm-apmaterno"
                        name="signinfrmapmaterno"
                        placeholder="Apellido Materno"
                        required
                      />
                      <label
                        htmlFor="signin-frm-apmaterno"
                        className="frm-label"
                      >
                        Apellido Materno
                      </label>
                    </div>
                    <div className="registros-field">
                      <Field
                        type="email"
                        id="signin-frm-email"
                        name="signinfrmemail"
                        placeholder="Correo Electrónico"
                        required
                      />
                      <label htmlFor="signin-frm-email" className="frm-label">
                        Correo Electrónico
                      </label>
                    </div>
                    <div
                      className={`registros-field-telefonos ${
                        tel ? "has-value" : ""
                      }`}
                    >
                      <PhoneInput
                        defaultCountry="MX"
                        placeholder="Teléfono"
                        name="signinfrmtelefono"
                        id="signin-frm-telefono"
                        value={tel}
                        onChange={setTel}
                        required
                      />
                      <label
                        htmlFor="signin-frm-telefono"
                        className="frm-label"
                      >
                        Teléfono
                      </label>
                    </div>
                    <div className="registros-field">
                      <Field
                        type="date"
                        id="signin-frm-fecnac"
                        name="signinfrmfecnac"
                        placeholder="Fecha de Nacimiento"
                        max={today}
                        required
                      />
                      <label htmlFor="signin-frm-fecnac" className="frm-label">
                        Fecha de Nacimiento
                      </label>
                    </div>
                    <div className="registros-field">
                      <Field
                        type={shown1 ? "text" : "password"}
                        id="signin-frm-password"
                        name="signinfrmpassword"
                        placeholder="Contraseña"
                        ref={passwordRef}
                        onChange={handlePasswordChange}
                        value={password}
                        required
                      />
                      <label
                        htmlFor="signin-frm-password"
                        className="frm-label"
                      >
                        Contraseña
                      </label>
                      <img
                        src={shown1 ? eyeOpenIcon : eyeClosedIcon}
                        onClick={switchShown1}
                        alt="Mostrar contraseña"
                        id="eye"
                        className="eye"
                      />
                      {!isValid && (
                        <span className="password-error">
                          La contraseña debe tener al menos 8 caracteres, una
                          letra mayúscula, una letra minúscula y un número
                        </span>
                      )}
                    </div>
                    <div className="registros-field">
                      <Field
                        type={shown2 ? "text" : "password"}
                        id="signin-frm-repassword"
                        name="signinfrmrepassword"
                        placeholder="Repetir Contraseña"
                        ref={password2Ref}
                        onChange={handlePassword2Change}
                        value={password2}
                        required
                      />
                      <label
                        htmlFor="signin-frm-repassword"
                        className="frm-label"
                      >
                        Repetir Contraseña
                      </label>
                      <img
                        src={shown2 ? eyeOpenIcon : eyeClosedIcon}
                        onClick={switchShown2}
                        alt="Mostrar contraseña"
                        id="eye2"
                        className="eye"
                      />
                    </div>
                  </div>
                </div>
                <Field
                  type="submit"
                  value="Registrarse"
                  className="button"
                  id="registros-button"
                  ref={signInButtonRef}
                  disabled={isFormValid ? false : true}
                />
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </>
  );
}

export default ModForm;
