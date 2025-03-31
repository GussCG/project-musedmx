import React, { useRef, useEffect, useState } from "react";

import useUsuario from "../../hooks/Usuario/useUsuario";
import ValidPassword from "../../components/ValidPassword";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, Bounce } from "react-toastify";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { format } from "date-fns";
import { es, is } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { motion } from "framer-motion";

import Icons from "../../components/IconProvider";
const { eyeClosedIcon, eyeOpenIcon } = Icons;

import modPlaceholder from "../../assets/images/placeholders/mod-placeholder.png";
import ErrorCampo from "../../components/ErrorCampo";

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
    .email("Correo electrónico inválido")
    .required("Campo requerido"),
});

function ModForm() {
  // Estados
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isValidPass, setIsValidPass] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const signInButtonRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);

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

  // Desabilitar el boton de registro si algun campo es invalido y todos los campos son requeridos
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    console.log(isFormValid);
    setIsFormValid(
      isValidPass &&
        isPasswordMatch &&
        isPossiblePhoneNumber(String(tel)) &&
        selectedDate !== null
    );
  }, [isValidPass, isPasswordMatch, tel, selectedDate]);

  // Registrar moderador
  const { registrarModerador } = useUsuario();
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

      // Convertir de FormData a objeto
      const modObj = {};
      modData.forEach((value, key) => {
        modObj[key] = value;
      });

      // Lógica para enviar los datos al backend
      const response = registrarModerador(modObj);

      if (response) {
        toast.success("Moderador registrado", {
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
        // Redirigir a VerModeradores
        // navigate("/moderadores");
      } else {
        toast.error("Error al registrar moderador", {
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
      }
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
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              // console.log(values);
              handleRegister(values);
            }}
          >
            {({ errors, touched, isValid }) => (
              <Form id="signin-form">
                <div className="registros-container admod">
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
                      <img
                        src={shown1 ? eyeOpenIcon : eyeClosedIcon}
                        onClick={switchShown1}
                        alt="Mostrar contraseña"
                        id="eye"
                        className="eye"
                      />
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
                        style={
                          isPasswordMatch
                            ? { borderColor: "green", borderWidth: "2px" }
                            : { borderColor: "red", borderWidth: "2px" }
                        }
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
                  value="Registrar Moderador"
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

export default ModForm;
