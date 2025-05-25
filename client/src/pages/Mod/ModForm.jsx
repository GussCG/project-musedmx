import { useRef, useEffect, useState } from "react";
import ValidPassword from "../../components/Forms/ValidPassword";
import { Formik, Form, Field } from "formik";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { es } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { motion } from "framer-motion";
import Icons from "../../components/Other/IconProvider";
const { LuEye, LuEyeClosed } = Icons;
import ErrorCampo from "../../components/Forms/ErrorCampo";
import { modSchema } from "../../constants/validationSchemas";
import useModeradores from "../../hooks/Usuario/useModeradores";
import { useAuth } from "../../context/AuthProvider";
import ToastMessage from "../../components/Other/ToastMessage";
import { useNavigate, useParams } from "react-router-dom";
import { TIPOS_USUARIO } from "../../constants/catalog";
import { formatearFechaBDDATE } from "../../utils/formatearFechas";
import { parseFecha } from "../../utils/parsearFecha";
import LoadingIndicator from "../../components/Other/LoadingIndicator";

function ModForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userId } = useParams();
  const { registrarModerador, editarModerador, obtenerModByCorreo } =
    useModeradores();
  // Estados
  const [moderadorEditar, setModeradorEditar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
  const today = new Date();

  const handleDayPickerSelect = (date) => {
    if (!date) {
      setSelectedDate(new Date());
    } else {
      setSelectedDate(date);
      setMes(date);
    }
  };

  function resetForm(mod) {
    setTel(mod?.usr_telefono || "");
    const fecha = parseFecha(mod?.usr_fecha_nac);
    setSelectedDate(fecha);
    setMes(fecha);
  }

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
    let valid = false;

    const isValidTel =
      typeof tel === "string" &&
      tel.trim() !== "" &&
      isPossiblePhoneNumber(tel);

    const isDateValid =
      selectedDate instanceof Date && !isNaN(selectedDate.getTime());

    if (moderadorEditar) {
      valid = isValidTel && isDateValid;
    } else {
      valid = isValidPass && isPasswordMatch && isValidTel && isDateValid;
    }

    setIsFormValid(valid);
  }, [isValidPass, isPasswordMatch, tel, selectedDate]);

  const handleSubmit = async (values) => {
    try {
      const modData = new FormData();
      let algoCambio = false;

      if (!isPossiblePhoneNumber(tel)) {
        ToastMessage({
          tipo: "error",
          mensaje: "Teléfono inválido",
          position: "top-right",
        });
        return;
      }

      if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
        ToastMessage({
          tipo: "error",
          mensaje: "Fecha inválida",
          position: "top-right",
        });
        return;
      }
      const parsedDate = selectedDate.toISOString().split("T")[0];

      let response;
      let msg;

      if (moderadorEditar) {
        // Obtener los datos del moderador a editar comparando con el moderador a editar
        if (moderadorEditar.usr_nombre !== values.signinfrmnombre) {
          modData.append("usr_nombre", values.signinfrmnombre);
          algoCambio = true;
        }
        if (moderadorEditar.usr_ap_paterno !== values.signinfrmappaterno) {
          modData.append("usr_ap_paterno", values.signinfrmappaterno);
          algoCambio = true;
        }
        if (moderadorEditar.usr_ap_materno !== values.signinfrmapmaterno) {
          modData.append("usr_ap_materno", values.signinfrmapmaterno);
          algoCambio = true;
        }
        const fechaActualMod = new Date(moderadorEditar.usr_fecha_nac)
          .toISOString()
          .split("T")[0];
        if (fechaActualMod !== parsedDate) {
          modData.append("usr_fecha_nac", parsedDate);
          algoCambio = true;
        }
        if (moderadorEditar.usr_telefono !== tel) {
          modData.append("usr_telefono", tel);
          algoCambio = true;
        }

        if (!algoCambio) {
          ToastMessage({
            tipo: "info",
            mensaje: "No se han realizado cambios",
            position: "top-right",
          });
          return;
        }

        modData.forEach((value, key) => {
          console.log(key, value);
        });

        response = await editarModerador(moderadorEditar.usr_correo, modData);
        msg = "Moderador editado correctamente";
      } else {
        // Si no hay moderador a editar, agregar todos los datos
        modData.append("usr_nombre", values.signinfrmnombre);
        modData.append("usr_ap_paterno", values.signinfrmappaterno);
        modData.append("usr_ap_materno", values.signinfrmapmaterno);
        modData.append("usr_correo", values.signinfrmemail);
        modData.append("usr_fecha_nac", values.signinfrmfecnac);
        modData.append("usr_telefono", tel);
        modData.append("usr_contrasenia", password);
        modData.append("usr_tipo", 3);

        modData.forEach((value, key) => {
          console.log(key, value);
        });

        response = await registrarModerador(modData);
        msg = "Moderador registrado correctamente";
      }

      if (response.success) {
        ToastMessage({
          tipo: "success",
          mensaje: msg,
          position: "top-right",
        });
        // Si usr_tipo es 3, redirigir a su pagina de perfil
        if (user.usr_tipo === 3) {
          navigate(`${TIPOS_USUARIO[user.usr_tipo].redirectPath}`);
        } else if (user.usr_tipo === 2) {
          navigate(`/${TIPOS_USUARIO[user.usr_tipo].nombre}/VerMods`);
        }
      } else {
        ToastMessage({
          tipo: "error",
          mensaje: response.message || "Error al registrar moderador",
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error al registrar/editar moderador:", error);
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

  // Cargar datos del moderador para edición
  useEffect(() => {
    const loadModerador = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await obtenerModByCorreo(userId);
        if (response) {
          setModeradorEditar(response);
          resetForm(response);
        }
      } catch (err) {
        console.error("Error loading moderator:", err);
        setError("Error al cargar datos del moderador");
      } finally {
        setLoading(false);
      }
    };

    loadModerador();
  }, [userId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="registros-main">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <div id="registros-form">
            <Formik
              enableReinitialize
              initialValues={{
                signinfrmnombre: moderadorEditar?.usr_nombre || "",
                signinfrmappaterno: moderadorEditar?.usr_ap_paterno || "",
                signinfrmapmaterno: moderadorEditar?.usr_ap_materno || "",
                signinfrmemail: "",
                signinfrmfecnac: moderadorEditar?.usr_fecha_nac || "",
                signinfrmpassword: "",
                signinfrmrepassword: "",
              }}
              validationSchema={modSchema}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({ errors, touched, setFieldValue, isValid }) => {
                console.log(errors);
                return (
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
                          <label
                            htmlFor="signin-frm-nombre"
                            className="frm-label"
                          >
                            Nombre
                          </label>
                          {errors.signinfrmnombre &&
                            touched.signinfrmnombre && (
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
                        {!moderadorEditar && (
                          <div className="registros-field">
                            <Field
                              type="email"
                              id="signin-frm-email"
                              name="signinfrmemail"
                              placeholder="Correo Electrónico"
                              required
                            />
                            <label
                              htmlFor="signin-frm-email"
                              className="frm-label"
                            >
                              Correo Electrónico
                            </label>
                            {errors.signinfrmemail &&
                              touched.signinfrmemail && (
                                <ErrorCampo mensaje={errors.signinfrmemail} />
                              )}
                          </div>
                        )}

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
                                    selectedDate
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
                        {!moderadorEditar && (
                          <>
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
                                style={
                                  isPasswordMatch
                                    ? {
                                        borderColor: "green",
                                        borderWidth: "2px",
                                      }
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
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className={
                        `button ` + (isFormValid && isValid ? "" : "disabled")
                      }
                      id="registros-button"
                      ref={signInButtonRef}
                      disabled={isFormValid && isValid ? false : true}
                    >
                      {moderadorEditar
                        ? "Editar Moderador"
                        : "Registrar Moderador"}
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        )}
      </main>
    </motion.div>
  );
}

export default ModForm;
