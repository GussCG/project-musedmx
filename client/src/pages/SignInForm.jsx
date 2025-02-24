import React, { useRef, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { toast, Bounce } from "react-toastify";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import userPlaceholder from "../assets/images/placeholders/user_placeholder.png";

import eyeOpenIcon from "../assets/icons/eye-opened-icon.png";
import eyeClosedIcon from "../assets/icons/eye-closed-icon.png";

function SignInForm() {
  // Estados
  const [tel, setTel] = useState();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [costo, setCosto] = useState("");
  const [valorRango, setValorRango] = useState(0);
  const [rangoHabilitado, setRangoHabilitado] = useState(false);
  const [imagePreview, setImagePreview] = useState(userPlaceholder);
  const [selectedTematicas, setSelectedTematicas] = useState([]);
  const signInButtonRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const imageInputRef = useRef(null);

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

  // Logica para habilitar el rango de costo dependiendo del tipo de costo
  const handleCostoChange = (event) => {
    const seleccion = event.target.value;
    setCosto(seleccion);
    setRangoHabilitado(
      seleccion === "Siempre con costo" || seleccion === "A veces gratis"
    );
    if (seleccion !== "Siempre con costo" && seleccion !== "A veces gratis") {
      setValorRango(0);
    }
  };

  // Lógica para el cambio de imagen de perfil
  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    setFieldValue("signinfrmfoto", file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Manejo de temáticas
  const handleTematicaChange = (event) => {
    const { value, checked } = event.target;
    if (selectedTematicas.length === 3 && checked) {
      toast.error("Solamente 3 temáticas", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    setSelectedTematicas((prev) =>
      checked ? [...prev, value] : prev.filter((tematica) => tematica !== value)
    );
  };

  // Desabilitar el boton de registro si algun campo es invalido
  const isFormValid =
    isValid && isPasswordMatch && tel && costo && selectedTematicas > 0;

  // Función para registrar al usuario
  const handleRegister = async (values) => {
    try {
      const userData = new FormData();

      if (!isPossiblePhoneNumber(tel)) {
        toast.error("Número de teléfono inválido", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        return;
      }

      userData.append("nombre", values.signinfrmnombre);
      userData.append("apPaterno", values.signinfrmappaterno);
      userData.append("apMaterno", values.signinfrmapmaterno);
      userData.append("email", values.signinfrmemail);
      userData.append("tel", tel);
      userData.append("fecNac", values.signinfrmfecnac);
      userData.append("password", password);
      userData.append("tematicas", JSON.stringify(selectedTematicas));
      userData.append("tipo_costo", costo);
      userData.append("rango_costo", valorRango);
      if (values.signinfrmfoto) userData.append("foto", values.signinfrmfoto);
      else userData.append("foto", userPlaceholder);

      console.log("Datos a enviar al backend:");
      userData.forEach((value, key) => {
        console.log(key, value);
      });
      // Lógica para enviar los datos al backend

      // Manejo de la respuesta del backend
    } catch (error) {
      console.error(error);
    }
  };

  // Para mostrar o no la contraseña
  const [shown1, setShown1] = useState(false);
  const [shown2, setShown2] = useState(false);

  const switchShown1 = () => {
    setShown1(!shown1);
  };

  const switchShown2 = () => {
    setShown2(!shown2);
  };

  const handleRangoChange = (event) => {
    setValorRango(event.target.value);
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
              signinfrmtematica: [],
              signinfrmtipoCosto: "",
              signinfrmrangocosto: 0,
              signinfrmfoto: "",
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
                    <h1>Datos Personales</h1>
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
                  <div id="registros-linea"></div>
                  <div id="registros-preferencias">
                    <h1>Preferencias</h1>
                    <div className="registros-chks">
                      <fieldset>
                        <legend>
                          Selecciona tus temáticas favoritas (3 máx)
                        </legend>
                        <div className="registros-chk-container">
                          <div className="registros-chk">
                            <Field
                              type="checkbox"
                              id="antropologia"
                              name="signinfrmtematica"
                              value="Antropología"
                              onChange={handleTematicaChange}
                              checked={selectedTematicas.includes(
                                "Antropología"
                              )}
                            />
                            <label htmlFor="antropologia">Antropología</label>
                          </div>
                          <div className="registros-chk">
                            <Field
                              type="checkbox"
                              id="arte"
                              name="signinfrmtematica"
                              value="Arte"
                              onChange={handleTematicaChange}
                              checked={selectedTematicas.includes("Arte")}
                            />
                            <label htmlFor="arte">Arte</label>
                          </div>
                          <div className="registros-chk">
                            <Field
                              type="checkbox"
                              id="arte-alternativo"
                              name="signinfrmtematica"
                              value="Arte Alternativo"
                              onChange={handleTematicaChange}
                              checked={selectedTematicas.includes(
                                "Arte Alternativo"
                              )}
                            />
                            <label htmlFor="arte-alternativo">
                              Arte Alternativo
                            </label>
                          </div>
                          <div className="registros-chk">
                            <Field
                              type="checkbox"
                              id="arqueologia"
                              name="signinfrmtematica"
                              value="Arqueología"
                              onChange={handleTematicaChange}
                              checked={selectedTematicas.includes(
                                "Arqueología"
                              )}
                            />
                            <label htmlFor="arqueologia">Arqueología</label>
                          </div>
                          <div className="registros-chk">
                            <Field
                              type="checkbox"
                              id="ciencia-tecnologia"
                              name="signinfrmtematica"
                              value="Ciencia y Tecnología"
                              onChange={handleTematicaChange}
                              checked={selectedTematicas.includes(
                                "Ciencia y Tecnología"
                              )}
                            />
                            <label htmlFor="ciencia-tecnologia">
                              Ciencia y Tecnología
                            </label>
                          </div>
                          <div className="registros-chk">
                            <Field
                              type="checkbox"
                              id="especializado"
                              name="signinfrmtematica"
                              value="Especializado"
                              onChange={handleTematicaChange}
                              checked={selectedTematicas.includes(
                                "Especializado"
                              )}
                            />
                            <label htmlFor="especializado">Especializado</label>
                          </div>
                          <div className="registros-chk">
                            <Field
                              type="checkbox"
                              id="historia"
                              name="signinfrmtematica"
                              value="Historia"
                              onChange={handleTematicaChange}
                              checked={selectedTematicas.includes("Historia")}
                            />
                            <label htmlFor="historia">Historia</label>
                          </div>
                          <div className="registros-chk">
                            <Field
                              type="checkbox"
                              id="otro"
                              name="signinfrmtematica"
                              value="Otro"
                              onChange={handleTematicaChange}
                              checked={selectedTematicas.includes("Otro")}
                            />
                            <label htmlFor="otro">Otro</label>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <div className="registros-field">
                      <select
                        name="signinfrmtipoCosto"
                        className="registros-frm-select"
                        id="registros-frm-costo"
                        value={costo}
                        onChange={handleCostoChange}
                        required
                      >
                        <option value="" disabled>
                          Selecciona un tipo de costo
                        </option>
                        <option value="Siempre gratis">Siempre gratis</option>
                        <option value="A veces gratis">A veces gratis</option>
                        <option value="Siempre con costo">
                          Siempre con costo
                        </option>
                      </select>
                    </div>
                    <div className="registros-field-rango">
                      <label
                        htmlFor="registros-frm-rango-costo"
                        id="frm-costo-label"
                      >
                        Rango de Costo: $ <output>{valorRango}</output> MXN
                      </label>
                      <Field
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={valorRango}
                        id="registros-frm-rango-costo"
                        name="signinfrmrangocosto"
                        placeholder="Rango de Costo"
                        list="rango-costo"
                        onChange={handleRangoChange}
                        disabled={!rangoHabilitado}
                        required
                      />
                    </div>
                    <hr />
                    <div className="registros-field-foto">
                      <div className="registros-field-foto-input">
                        <h2>Foto de Perfil</h2>
                        <input
                          type="file"
                          id="registros-frm-foto"
                          name="signinfrmfoto"
                          accept="image/*"
                          ref={imageInputRef}
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                          required
                        />
                      </div>
                      <img
                        src={imagePreview}
                        alt="Foto de Perfil"
                        id="foto-preview"
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

export default SignInForm;
