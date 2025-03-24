import React, { useRef, useEffect, useState } from "react";

import useUsuario from "../../hooks/Usuario/useUsuario";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast, Bounce } from "react-toastify";
import "rc-slider/assets/index.css";

import { format } from "date-fns";
import { es, se } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { useAuth } from "../../context/AuthProvider";

import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";
import fotoPrueba from "../../assets/images/others/museo-login-image.png";
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
    .email("Correo inválido")
    .required("Campo requerido"),
  signinfrmtelefono: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido")
    .required("Campo requerido"),
});

function ProfileEdit() {
  // Obtenemos el id de los parametros de la URL para saber que usuario editar
  // Si no hay parametros se edita el usuario autenticado
  const { userId } = useParams();
  const { user, tipoUsuario } = useAuth();

  // Datos de prueba para el formulario
  const testUser = {
    id: 1,
    nombre: "Georgina",
    apPaterno: "Casillas",
    apMaterno: "Mejia",
    email: "geocame30@mail.com",
    tel: "5512345678",
    fecNac: "2002-04-30",
    password: "123456",
    password2: "123456",
    tematicas: [],
    tipo_costo: "A veces gratis",
    rango_costo: [0, 100],
    foto: fotoPrueba,
  };

  const usuarioInicial = userId ? testUser : user;
  const [usuario, setUsuario] = useState(usuarioInicial);

  useEffect(() => {
    if (userId && userId !== "undefined") {
      console.log("Editar usuario con id: ", userId);
      // Buscamos al usuario con el id en la base de datos
      // axios.get(`/api/usuarios/${id}`).then((response) => {
      //   setUsuario(response.data);
      // });
      setUsuario(testUser);
    } else {
      console.log(user);
      setUsuario(user);
    }
  }, [userId, user]);

  // Estados
  const [tel, setTel] = useState();
  // const [costo, setCosto] = useState("");
  // const [valorRango, setValorRango] = useState([0, 100]);
  // const [rangoHabilitado, setRangoHabilitado] = useState(false);
  const [imagePreview, setImagePreview] = useState(userPlaceholder);
  const [selectedTematicas, setSelectedTematicas] = useState([]);
  const signInButtonRef = useRef(null);
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

  const today = new Date();
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
        theme: "colored",
        transition: Bounce,
      });
      return;
    }
    setSelectedTematicas((prev) =>
      checked ? [...prev, value] : prev.filter((tematica) => tematica !== value)
    );
  };

  const handleRangoChange = (event) => {
    setValorRango(event.target.value);
  };

  // Funcion para editar al usuario
  const { editarUsuario } = useUsuario();
  const handleEditar = async (values) => {
    try {
      // Preparar los datos para enviar al backend
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

      // Convertir la fecha de nacimiento
      const parsedDate = selectedDate.toISOString();

      // Agregar los datos personales
      userData.append("nombre", values.signinfrmnombre);
      userData.append("apellido_paterno", values.signinfrmappaterno);
      userData.append("apellido_materno", values.signinfrmapmaterno);
      userData.append("email", values.signinfrmemail);
      userData.append("telefono", tel);
      userData.append("fecha_nacimiento", parsedDate);
      userData.append("tematicas", JSON.stringify(selectedTematicas));
      // userData.append("tipo_costo", costo);
      // userData.append("rango_costo", valorRango);

      // Si el usuario no selecciono una imagen de perfil no se cambia la imagen
      if (values.signinfrmfoto) {
        userData.append("foto", values.signinfrmfoto);
      } else {
        userData.append("foto", user.foto);
      }

      // Si se selecciono una imagen de perfil se agrega al FormData
      // if (imageInputRef.current.files[0]) {
      //   userData.append("foto", imageInputRef.current.files[0]);
      // } else {
      //   userData.append("foto", userPlaceholder);
      // }

      // Convertir el FormData a un objeto
      const userObject = {};
      userData.forEach((value, key) => {
        userObject[key] = value;
      });

      // Enviar los datos al backend
      const response = await editarUsuario(userObject);

      if (response) {
        toast.success("Usuario editado correctamente", {
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
        // Recargar la página con los nuevos datos
        window.location.reload();
      } else {
        toast.error("Error al editar el usuario", {
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

      userData.forEach((value, key) => {
        console.log(key, value);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Cargar los datos del usuario en el formulario
  useEffect(() => {
    if (user) {
      setSelectedTematicas(usuario.tematicas || []);
      // setCosto(usuario.tipo_costo || "");
      // setValorRango(usuario.rango_costo || [0, 100]);
      setTel(usuario.tel || "");
      setSelectedDate(new Date(usuario.fecNac) || new Date());
      setMes(selectedDate || new Date());
      // Se establece la imagen de vista previa y el archivo de imagen
      setImagePreview(usuario.foto || userPlaceholder);
    }
  }, [user, usuario]);

  // Desactivar el botón de registro si el formulario no es válido
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (tipoUsuario === "Usuario") {
      setIsFormValid(tel && selectedDate && selectedTematicas.length === 3);
    } else {
      setIsFormValid(tel && selectedDate);
    }
  }, [tel, selectedDate, selectedTematicas, tipoUsuario]);

  return (
    <>
      <main id="registros-main">
        <div id="registros-form">
          <Formik
            initialValues={{
              signinfrmnombre: usuario?.nombre || "",
              signinfrmappaterno: usuario?.apPaterno || "",
              signinfrmapmaterno: usuario?.apMaterno || "",
              signinfrmemail: usuario?.email || "",
              signinfrmtelefono: usuario?.tel || "",
              // Solo para usuarios tipo 1 (Usuario normal)
              signinfrmtematica:
                user.tipoUsuario === 1 ? usuario?.tematicas || [] : [],
              // signinfrmtipoCosto:
              //   user.tipoUsuario === 1 ? usuario?.tipo_costo || "" : "",
              // signinfrmrangocosto:
              //   user.tipoUsuario === 1 ? usuario?.rango_costo : 0,
              signinfrmfoto: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              handleEditar(values);
            }}
          >
            {({ setFieldValue, errors, touched, isValid }) => (
              <Form id="signin-form">
                <div
                  className={`registros-container ${
                    tipoUsuario === "Usuario" ? "" : "admod"
                  }`}
                >
                  <div className="registros-datos">
                    <h1>Editar Datos Personales</h1>
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
                        timeZone="America/Mexico_City"
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
                  </div>
                  {user.tipoUsuario === 1 ? (
                    <>
                      <div id="registros-linea"></div>
                      <div id="registros-preferencias">
                        <h1>Editar Preferencias</h1>
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
                                <label htmlFor="antropologia">
                                  Antropología
                                </label>
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
                                <label htmlFor="especializado">
                                  Especializado
                                </label>
                              </div>
                              <div className="registros-chk">
                                <Field
                                  type="checkbox"
                                  id="historia"
                                  name="signinfrmtematica"
                                  value="Historia"
                                  onChange={handleTematicaChange}
                                  checked={selectedTematicas.includes(
                                    "Historia"
                                  )}
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
                            <option value="Siempre gratis">
                              Siempre gratis
                            </option>
                            <option value="A veces gratis">
                              A veces gratis
                            </option>
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
                                {
                                  backgroundColor: "#000",
                                  borderColor: "#000",
                                },
                                {
                                  backgroundColor: "#000",
                                  borderColor: "#000",
                                },
                              ]}
                              trackStyle={[{ backgroundColor: "#000" }]}
                              railStyle={{ backgroundColor: "#d9d9d9" }}
                            />
                          </div>
                        </div> */}
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
                              onChange={(e) =>
                                handleImageChange(e, setFieldValue)
                              }
                            />
                          </div>
                          <img
                            src={imagePreview}
                            alt="Foto de Perfil"
                            id="foto-preview"
                          />
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <Field
                  type="submit"
                  className={
                    `button ` + (isFormValid && isValid ? "" : "disabled")
                  }
                  value="Guardar cambios"
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

export default ProfileEdit;
