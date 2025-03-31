import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

import useUsuario from "../../hooks/Usuario/useUsuario";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, Bounce } from "react-toastify";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";

import { format } from "date-fns";
import { es } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import Icons from "../../components/IconProvider";
const { LuEye, LuEyeClosed } = Icons;

import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";
import ValidPassword from "../../components/ValidPassword";
import ErrorCampo from "../../components/ErrorCampo";
import ImageCropper from "../../components/ImageCropper";

const validationSchema = Yup.object({
  signinfrmnombre: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras"
    )
    .required("Campo requerido"),
  signinfrmappaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El apellido paterno solo puede contener letras"
    )
    .required("Campo requerido"),
  signinfrmapmaterno: Yup.string()
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El apellido materno solo puede contener letras"
    )
    .required("Campo requerido"),
  signinfrmemail: Yup.string()
    .email("Correo inválido")
    .required("Campo requerido"),
});

function SignInForm() {
  // Estados
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isValidPass, setIsValidPass] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  // const [costo, setCosto] = useState("");
  // const [valorRango, setValorRango] = useState([0, 100]);
  // const [rangoHabilitado, setRangoHabilitado] = useState(false);

  const [selectedTematicas, setSelectedTematicas] = useState([]);
  const signInButtonRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const imageInputRef = useRef(null);

  // Fecha de nacimiento
  const [mes, setMes] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDayPickerSelect = (date) => {
    if (!date) {
      setSelectedDate(new Date());
    } else {
      setSelectedDate(date);
    }
  };

  // Fecha actual en UTC -6
  let today = new Date();
  today.setHours(today.getHours() - 6);

  // // Logica para habilitar el rango de costo dependiendo del tipo de costo
  // const handleCostoChange = (event) => {
  //   const seleccion = event.target.value;
  //   setCosto(seleccion);
  //   setRangoHabilitado(
  //     seleccion === "Siempre con costo" || seleccion === "A veces gratis"
  //   );
  //   if (seleccion !== "Siempre con costo" && seleccion !== "A veces gratis") {
  //     setValorRango(0);
  //   }
  // };

  // const handleRangeChange = (value) => {
  //   setValorRango(value);
  // };

  // Lógica para el cambio de imagen de perfil
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(userPlaceholder);
  const [openCropper, setOpenCropper] = useState(false);
  const [imageOriginal, setImageOriginal] = useState(null);

  // Sin ImageCropper
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];

    if (file) {
      setFieldValue("signinfrmfoto", file);
      setImagePreview(URL.createObjectURL(file));
      document.getElementById("file-name").textContent = file.name;
    } else {
      setImagePreview(userPlaceholder);
      document.getElementById("file-name").textContent =
        "Ningún archivo seleccionado";
    }
  };

  // ImageCropper
  // const handleImageChange = (event, setFieldValue) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const objectURL = URL.createObjectURL(file);
  //     setImage(objectURL);
  //     setImageOriginal(file);
  //     setOpenCropper(true);
  //   }
  // };

  // const handleCroppedImage = (croppedImage, setFieldValue) => {
  //   setImagePreview(croppedImage);
  //   setFieldValue("signinfrmfoto", imageOriginal);
  //   setOpenCropper(false);
  // };

  // useEffect(() => {
  //   return () => {
  //     if (image) {
  //       URL.revokeObjectURL(image);
  //     }
  //   };
  // }, [image]);

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
        theme: "colored",
        transition: Bounce,
      });
      return;
    }
    setSelectedTematicas((prev) =>
      checked ? [...prev, value] : prev.filter((tematica) => tematica !== value)
    );
  };

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

  // Desabilitar el boton de registro si algun campo es invalido
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    setIsFormValid(
      isValidPass &&
        isPasswordMatch &&
        isPossiblePhoneNumber(tel) &&
        selectedTematicas.length === 3 &&
        selectedDate !== null
    );
  }, [isValidPass, isPasswordMatch, tel, selectedTematicas, selectedDate]);

  const { registrarUsuario } = useUsuario();
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
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      const parsedDate = selectedDate.toISOString();

      userData.append("nombre", values.signinfrmnombre);
      userData.append("apPaterno", values.signinfrmappaterno);
      userData.append("apMaterno", values.signinfrmapmaterno);
      userData.append("email", values.signinfrmemail);
      userData.append("tel", tel);
      userData.append("fecNac", parsedDate);
      userData.append("password", password);
      userData.append("tematicas", JSON.stringify(selectedTematicas));
      // userData.append("tipo_costo", costo);
      // userData.append("rango_costo", valorRango);
      if (values.signinfrmfoto) userData.append("foto", values.signinfrmfoto);
      else userData.append("foto", userPlaceholder);

      // Convertir a un objeto
      let userObject = {};
      userData.forEach((value, key) => {
        userObject[key] = value;
      });

      // Lógica para enviar los datos al backend
      const response = await registrarUsuario(userObject);

      if (response) {
        toast.success("Usuario registrado correctamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        // Redirigir al perfil del usuario
        history.push("/perfil");
      } else {
        toast.error("Error al registrar el usuario", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }

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

  // const handleRangoChange = (event) => {
  //   setValorRango(event.target.value);
  // };

  // // Logica para validar las contraseñas
  // useEffect(() => {
  //   let password = passwordRef.current;
  //   let password2 = password2Ref.current;
  //   let signInButton = signInButtonRef.current;

  //   // Validamos las contraseña y la confirmacion de la contraseña
  //   // Si son iguales se pinta de verde y se activa el boton de registro
  //   if (signInButton) {
  //     signInButton.disabled = true;
  //   }

  //   const validatePasswords = () => {
  //     if (password2.value == "") {
  //       password2.style.borderColor = "black";
  //       password2.style.borderWidth = "1px";
  //       password2.setCustomValidity("");
  //       signInButton.disabled = true;
  //       return;
  //     }

  //     if (password.value !== password2.value) {
  //       password2.setCustomValidity("Las contraseñas no coinciden");
  //       password2.style.borderColor = "red";
  //       password2.style.borderWidth = "2px";
  //       signInButton.disabled = true;
  //     } else {
  //       password2.setCustomValidity("");
  //       password2.style.borderColor = "green";
  //       password2.style.borderWidth = "2px";
  //       signInButton.disabled = false;
  //     }
  //   };

  //   password?.addEventListener("input", validatePasswords);
  //   password2?.addEventListener("input", validatePasswords);

  //   return () => {
  //     password?.removeEventListener("input", validatePasswords);
  //     password2?.removeEventListener("input", validatePasswords);
  //   };
  // }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
              // signinfrmtipoCosto: "",
              // signinfrmrangocosto: 0,
              signinfrmfoto: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              // console.log(values);
              handleRegister(values);
            }}
          >
            {({ errors, touched, setFieldValue, isValid }) => (
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
                      {errors.signinfrmnombre && touched.signinfrmnombre && (
                        <ErrorCampo mensaje={errors.signinfrmnombre} />
                      )}
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
                      {errors.signinfrmappaterno &&
                        touched.signinfrmappaterno && (
                          <ErrorCampo mensaje={errors.signinfrmappaterno} />
                        )}
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
                      {errors.signinfrmapmaterno &&
                        touched.signinfrmapmaterno && (
                          <ErrorCampo mensaje={errors.signinfrmapmaterno} />
                        )}
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
                      {errors.signinfrmemail && touched.signinfrmemail && (
                        <ErrorCampo mensaje={errors.signinfrmemail} />
                      )}
                    </div>
                    <div
                      className={`registros-field-telefonos ${
                        tel ? "has-value" : ""
                      }`}
                    >
                      <PhoneInput
                        defaultCountry="MX"
                        countries={["MX"]}
                        placeholder="Teléfono"
                        name="signinfrmtelefono"
                        id="signin-frm-telefono"
                        value={tel}
                        onChange={setTel}
                        limitMaxLength={true}
                        required
                      />
                      <label
                        htmlFor="signin-frm-telefono"
                        className="frm-label"
                      >
                        Teléfono
                      </label>
                    </div>
                    <div className="registros-field-calendar">
                      <label>Fecha de Nacimiento</label>
                      <DayPicker
                        hideNavigation
                        animate
                        locale={es}
                        timeZone="UTC"
                        captionLayout="dropdown"
                        fixedWeeks
                        month={mes}
                        onMonthChange={setMes}
                        autoFocus
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDayPickerSelect}
                        footer={
                          selectedDate
                            ? `Seleccionaste el ${format(
                                selectedDate,
                                "dd-MM-yyyy"
                              )}`
                            : "Selecciona una fecha"
                        }
                        modifiers={{
                          disabled: { after: today },
                        }}
                        classNames={{
                          chevron: "calendar-chevron",
                        }}
                        className="registros-calendar"
                      />
                    </div>
                    <div className="registros-field">
                      <Field
                        type={shown1 ? "text" : "password"}
                        id="signin-frm-password"
                        name="signinfrmpassword"
                        placeholder="Contraseña"
                        ref={passwordRef}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                      />
                      <label
                        htmlFor="signin-frm-password"
                        className="frm-label"
                      >
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
                        id="signin-frm-repassword"
                        name="signinfrmrepassword"
                        placeholder="Repetir Contraseña"
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
                      <label
                        htmlFor="signin-frm-repassword"
                        className="frm-label"
                      >
                        Repetir Contraseña
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
                  </div>
                  <div id="registros-linea"></div>
                  <div id="registros-preferencias">
                    <h1>Preferencias</h1>
                    <div className="registros-chks">
                      <fieldset>
                        <legend>
                          Dale click a tus temáticas favoritas (3 máx)
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
                    {/* <div className="registros-field">
                      <div className="registros-field-header">
                        <h2>Tipo de Costo</h2>
                      </div>
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
                    <div
                      className={`registros-field-rango ${
                        costo === "Siempre con costo" ||
                        costo === "A veces gratis"
                          ? "rango-visible"
                          : ""
                      }`}
                    >
                      <label
                        htmlFor="registros-frm-rango-costo"
                        id="frm-costo-label"
                      >
                        Rango de Costo (MXN) $ {valorRango[0]} - ${" "}
                        {valorRango[1]}
                      </label>
                      <div className="slider-precio-container">
                        <Slider
                          range
                          min={0}
                          max={100}
                          step={5}
                          value={valorRango}
                          onChange={handleRangeChange}
                          id="registros-frm-rango-costo"
                          name="signinfrmrangocosto"
                          handleStyle={[
                            { backgroundColor: "#000", borderColor: "#000" },
                            { backgroundColor: "#000", borderColor: "#000" },
                          ]}
                          trackStyle={[{ backgroundColor: "#000" }]}
                          railStyle={{ backgroundColor: "#d9d9d9" }}
                        />
                      </div>
                    </div> */}
                    <hr />
                    <div className="registros-field-foto">
                      <div className="registros-field-foto-input">
                        <h2>Foto de perfil</h2>
                        <div className="foto-input">
                          <Field
                            className="file-btn"
                            type="button"
                            onClick={() =>
                              document
                                .getElementById("registros-frm-foto")
                                .click()
                            }
                            value="Seleccionar Archivo"
                          />
                          <span id="file-name">Seleccionar Archivo</span>
                          <input
                            type="file"
                            accept="image/*"
                            ref={imageInputRef}
                            id="registros-frm-foto"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              handleImageChange(e, setFieldValue);
                            }}
                          />
                        </div>
                      </div>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Foto de Perfil"
                          id="foto-preview"
                        />
                      )}
                      {/* {openCropper && (
                        <ImageCropper
                          image={image}
                          onCropComplete={(croppedImage) =>
                            handleCroppedImage(croppedImage, setFieldValue)
                          }
                        />
                      )} */}
                    </div>
                  </div>
                </div>
                <Field
                  type="submit"
                  value="Registrarse"
                  className={
                    `button ` + (isFormValid && isValid ? "" : "disabled")
                  }
                  id="registros-button"
                  ref={signInButtonRef}
                  disabled={isFormValid && isValid ? false : true}
                />
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </motion.div>
  );
}

export default SignInForm;
