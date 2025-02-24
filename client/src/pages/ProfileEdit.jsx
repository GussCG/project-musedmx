import React, { useRef, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useParams } from "react-router-dom";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

import { useAuth } from "../context/AuthProvider";

import userPlaceholder from "../assets/images/placeholders/user_placeholder.png";
import fotoPrueba from "../assets/images/others/museo-login-image.png";

function ProfileEdit() {
  // Obtenemos el id de los parametros de la URL para saber que usuario editar
  // Si no hay parametros se edita el usuario autenticado
  const { userId } = useParams();
  const { user } = useAuth();

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
    tipo_costo: "",
    rango_costo: 0,
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
      console.log("Editar usuario autenticado");
      setUsuario(user);
    }
  }, [userId, user]);

  // Estados
  const [tel, setTel] = useState();
  const [costo, setCosto] = useState("");
  const [valorRango, setValorRango] = useState(0);
  const [rangoHabilitado, setRangoHabilitado] = useState(false);
  const [imagePreview, setImagePreview] = useState(userPlaceholder);
  const [selectedTematicas, setSelectedTematicas] = useState([]);
  const signInButtonRef = useRef(null);
  const imageInputRef = useRef(null);

  // Fecha de nacimiento
  let today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  today = today.toISOString().split("T")[0];

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

  const handleRangoChange = (event) => {
    setValorRango(event.target.value);
  };

  // Funcion para editar al usuario
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
          theme: "dark",
          transition: Bounce,
        });
        return;
      }

      // Agregar los datos personales
      userData.append("nombre", values.signinfrmnombre);
      userData.append("apellido_paterno", values.signinfrmappaterno);
      userData.append("apellido_materno", values.signinfrmapmaterno);
      userData.append("email", values.signinfrmemail);
      userData.append("telefono", tel);
      userData.append("fecha_nacimiento", values.signinfrmfecnac);
      userData.append("tematicas", JSON.stringify(selectedTematicas));
      userData.append("tipo_costo", costo);
      userData.append("rango_costo", valorRango);

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

      // const response = await axios.post("/api/auth/register", userData);

      // // Manejar la respuesta del backend
      // if (response.status === 200) {
      //   console.log("Usuario registrado con éxito");
      //   // Redirigir al usuario a la página de inicio de sesión
      // } else {
      //   console.error("Error al registrar al usuario");
      // }

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
      setCosto(usuario.tipo_costo || "");
      setValorRango(usuario.rango_costo || 0);
      setTel(usuario.tel || "");
      // Se establece la imagen de vista previa y el archivo de imagen
      setImagePreview(usuario.foto || userPlaceholder);
    }
  }, [user, usuario]);

  // Desactivar el botón de registro si el formulario no es válido
  const isFormValid = true;

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
              signinfrmfecnac: usuario?.fecNac || "",
              // Solo para usuarios tipo 1 (Usuario normal)
              signinfrmtematica:
                user.tipoUsuario === 1 ? usuario?.tematicas || [] : [],
              signinfrmtipoCosto:
                user.tipoUsuario === 1 ? usuario?.tipo_costo || "" : "",
              signinfrmrangocosto:
                user.tipoUsuario === 1 ? usuario?.rango_costo : 0,
              signinfrmfoto: "",
            }}
            onSubmit={(values) => {
              handleEditar(values);
            }}
          >
            {({ setFieldValue, values }) => (
              <Form id="signin-form">
                <div className="registros-container">
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
                  className="button"
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
