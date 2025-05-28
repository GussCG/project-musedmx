import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useUsuario from "../../hooks/Usuario/useUsuario";
import { useAuth } from "../../context/AuthProvider";
import { Formik, Form, Field } from "formik";
import { toast, Bounce } from "react-toastify";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { es } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import Icons from "../../components/Other/IconProvider";
const { LuEye, LuEyeClosed } = Icons;
import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";
import ValidPassword from "../../components/Forms/ValidPassword";
import ErrorCampo from "../../components/Forms/ErrorCampo";
import { userRegistroSchema } from "../../constants/validationSchemas";
import { formatearFechaBDDATE } from "../../utils/formatearFechas";
import { TIPOS_USUARIO, TEMATICAS } from "../../constants/catalog";
import ToastMessage from "../../components/Other/ToastMessage";
import UserImage from "../../components/User/UserImage";
import { formatFileName } from "../../utils/formatFileName";

function SignInForm() {
  // Estados
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isValidPass, setIsValidPass] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const navigate = useNavigate();
  const [selectedTematicas, setSelectedTematicas] = useState([]);
  const signInButtonRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const imageInputRef = useRef(null);

  const [fileLabel, setFileLabel] = useState("Seleccionar Archivo");
  const fileNameRef = useRef(null);

  // Fecha de nacimiento
  const [mes, setMes] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDayPickerSelect = (date) => {
    if (!date) {
      setSelectedDate(new Date());
    } else {
      setSelectedDate(date);
      setMes(date);
    }
  };

  // Fecha actual en UTC -6
  let today = new Date();
  today.setHours(today.getHours() - 6);

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
      if (fileNameRef.current) fileNameRef.current.innerHTML = file.name;
      setFileLabel(file.name);
    } else {
      setImagePreview(userPlaceholder);
      setFileLabel("Seleccionar Archivo");
    }
  };

  // Manejo de temáticas
  const handleTematicaChange = (event) => {
    const { value, checked } = event.target;
    if (selectedTematicas.length === 3 && checked) {
      ToastMessage({
        mensaje: "Solo puedes seleccionar 3 temáticas",
        tipo: "warning",
        position: "top-right",
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
    let valid = false;

    const isTelValid =
      typeof tel === "string" &&
      tel.trim() !== "" &&
      isPossiblePhoneNumber(tel);

    const isDateValid =
      selectedDate instanceof Date && !isNaN(selectedDate.getTime());

    valid =
      isValidPass &&
      isPasswordMatch &&
      isTelValid &&
      isDateValid &&
      selectedTematicas.length === 3;
    setIsFormValid(valid);
  }, [tel, password, password2, selectedDate, selectedTematicas]);

  const { registrarUsuario } = useUsuario();
  const { login } = useAuth();
  // Función para registrar al usuario
  const handleRegister = async (values) => {
    try {
      const userData = new FormData();

      if (!isPossiblePhoneNumber(tel)) {
        ToastMessage({
          mensaje: "Número de teléfono inválido",
          tipo: "error",
          position: "top-right",
        });
        return;
      }

      //formato de la fecha: YYYY-MM-DD
      const parsedDate = selectedDate.toISOString().split("T")[0];

      userData.append("usr_nombre", values.signinfrmnombre);
      userData.append("usr_ap_paterno", values.signinfrmappaterno);
      userData.append("usr_ap_materno", values.signinfrmapmaterno);
      userData.append("usr_correo", values.signinfrmemail);
      userData.append("usr_telefono", tel);
      userData.append("usr_fecha_nac", parsedDate);
      userData.append("usr_contrasenia", password);
      userData.append("usr_tematicas", JSON.stringify(selectedTematicas));
      userData.append("usr_tipo", 1);
      if (values.signinfrmfoto) {
        userData.append("usr_foto", values.signinfrmfoto);
      } else {
        userData.append("usr_foto", userPlaceholder);
      }

      // Lógica para enviar los datos al backend
      const response = await registrarUsuario(userData);

      if (response) {
        ToastMessage({
          mensaje: "Usuario registrado correctamente",
          tipo: "success",
          position: "top-right",
        });
        // Redirigir al perfil del usuario
        await login({
          usr_correo: values.signinfrmemail,
          usr_contrasenia: password,
        });
      } else {
        ToastMessage({
          mensaje: "Error al registrar el usuario",
          tipo: "error",
          position: "top-right",
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
              signinfrmfoto: "",
            }}
            validationSchema={userRegistroSchema}
            onSubmit={(values) => {
              handleRegister(values);
            }}
          >
            {({ errors, touched, setFieldValue }) => (
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
                        onChange={(value) => {
                          setTel(value);
                          setFieldValue("signinfrmtelefono", value);
                        }}
                        limitMaxLength={true}
                        required
                      />
                      <label
                        htmlFor="signin-frm-telefono"
                        className="frm-label"
                      >
                        Teléfono
                      </label>
                      {errors.signinfrmtelefono &&
                        touched.signinfrmtelefono && (
                          <ErrorCampo mensaje={errors.signinfrmtelefono} />
                        )}
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
                            ? `Seleccionaste el ${formatearFechaBDDATE(
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
                          {Object.values(TEMATICAS).map((tematica) => (
                            <div className="registros-chk" key={tematica.id}>
                              <Field
                                type="checkbox"
                                id={tematica.nombre}
                                name="signinfrmtematica"
                                value={tematica.nombre}
                                onChange={handleTematicaChange}
                                checked={selectedTematicas.includes(
                                  tematica.nombre
                                )}
                              />
                              <label htmlFor={tematica.nombre}>
                                {tematica.nombre}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                    <hr />
                    <div className="registros-field-foto">
                      <div className="registros-field-foto-input">
                        <h2>Foto de perfil</h2>
                        <div className="foto-input">
                          <button
                            className="file-btn"
                            type="button"
                            onClick={() =>
                              document
                                .getElementById("registros-frm-foto")
                                .click()
                            }
                            value="Seleccionar Archivo"
                          >
                            Seleccionar Archivo
                          </button>
                          <span id="file-name" ref={fileNameRef}>
                            {formatFileName(fileLabel)}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            name="signinfrmfoto"
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
                        <UserImage
                          src={imagePreview}
                          alt="Foto de Perfil"
                          className="user-image"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className={`button ` + (isFormValid ? "" : "disabled")}
                  id="registros-button"
                  name="signinfrmregistrar"
                  ref={signInButtonRef}
                  disabled={isFormValid ? false : true}
                >
                  Registrarse
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </motion.div>
  );
}

export default SignInForm;
