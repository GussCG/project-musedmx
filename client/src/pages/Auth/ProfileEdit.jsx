import { useRef, useEffect, useState } from "react";
import useUsuario from "../../hooks/Usuario/useUsuario";
import { Formik, Form, Field } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast, Bounce } from "react-toastify";
import "rc-slider/assets/index.css";
import { motion } from "framer-motion";
import { es } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useAuth } from "../../context/AuthProvider";
import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";
import ErrorCampo from "../../components/Forms/ErrorCampo";
import { userSchema } from "../../constants/validationSchemas";
import { TEMATICAS } from "../../constants/catalog";
import { formatearFechaBDDATE } from "../../utils/formatearFechas";
import { TIPOS_USUARIO } from "../../constants/catalog";
import UserImage from "../../components/User/UserImage";

function ProfileEdit() {
  const { user, tipoUsuario, setUser } = useAuth();
  const [nuevaFoto, setNuevaFoto] = useState(false);
  const navigate = useNavigate();

  // Estados
  const [tel, setTel] = useState(user?.usr_telefono || "");
  const [imagePreview, setImagePreview] = useState(
    user?.usr_foto || userPlaceholder
  );
  const [selectedTematicas, setSelectedTematicas] = useState(
    user?.usr_tematicas || []
  );
  const [selectedDate, setSelectedDate] = useState(() => {
    const f = new Date(user?.usr_fecha_nac);
    return isNaN(f.getTime()) ? new Date() : f;
  });
  const [mes, setMes] = useState(new Date());
  const today = new Date();

  useEffect(() => {
    if (selectedDate) {
      setMes(selectedDate);
    }
  }, [selectedDate]);

  const fileNameRef = useRef(null);

  useEffect(() => {
    // Actualizar estado si cambia user
    setTel(user?.usr_telefono || "");
    setSelectedTematicas(user?.usr_tematicas || []);
    const f = new Date(user?.usr_fecha_nac);
    setSelectedDate(isNaN(f.getTime()) ? new Date() : f);
    setImagePreview(user?.usr_foto || userPlaceholder);

    if (fileNameRef.current) {
      fileNameRef.current.innerHTML = user?.usr_foto
        ? "Cambiar Archivo"
        : "Seleccionar Archivo";
    }
  }, [user]);

  // Lógica para el cambio de imagen de perfil
  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("signinfrmfoto", file);
      setImagePreview(URL.createObjectURL(file));
      setNuevaFoto(true);
      if (fileNameRef.current) fileNameRef.current.innerHTML = file.name;
    } else {
      setImagePreview(user?.usr_foto);
      if (fileNameRef.current)
        fileNameRef.current.innerHTML = user?.usr_foto
          ? "Cambiar Archivo"
          : "Seleccionar Archivo";
    }
    event.target.value = null;
  };

  // Manejo de temáticas
  const handleTematicaChange = (event) => {
    const { value, checked } = event.target;
    if (selectedTematicas.length === 3 && checked) {
      toast.error("Solamente 3 temáticas", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }
    setSelectedTematicas((prev) =>
      checked ? [...prev, value] : prev.filter((t) => t !== value)
    );
  };

  // Funcion para editar al usuario
  const { editarUsuario, obtenerUsuarioByCorreo } = useUsuario();
  const handleEditar = async (values) => {
    try {
      const userData = new FormData();
      let algoCambio = false;

      if (!isPossiblePhoneNumber(tel)) {
        toast.error("Número de teléfono inválido", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
        toast.error("Fecha de nacimiento inválida", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }
      const parsedDate = selectedDate.toISOString().split("T")[0];

      if (values.signinfrmnombre !== user.usr_nombre) {
        userData.append("usr_nombre", values.signinfrmnombre);
        algoCambio = true;
      }
      if (values.signinfrmappaterno !== user.usr_ap_paterno) {
        userData.append("usr_ap_paterno", values.signinfrmappaterno);
        algoCambio = true;
      }
      if (values.signinfrmapmaterno !== user.usr_ap_materno) {
        userData.append("usr_ap_materno", values.signinfrmapmaterno);
        algoCambio = true;
      }
      if (tel !== user.usr_telefono) {
        userData.append("usr_telefono", tel);
        algoCambio = true;
      }
      const fechaActualUsuario = new Date(user.usr_fecha_nac)
        .toISOString()
        .split("T")[0];
      if (parsedDate !== fechaActualUsuario) {
        userData.append("usr_fecha_nac", parsedDate);
        algoCambio = true;
      }
      const temActuales = [...(user.usr_tematicas || [])].sort();
      const temSeleccionadas = [...selectedTematicas].sort();

      if (
        selectedTematicas.length > 0 &&
        JSON.stringify(temActuales) !== JSON.stringify(temSeleccionadas)
      ) {
        userData.append("usr_tematicas", JSON.stringify(selectedTematicas));
        algoCambio = true;
      }

      if (nuevaFoto && values.signinfrmfoto instanceof File) {
        userData.append("usr_foto", values.signinfrmfoto);
        algoCambio = true;
      }

      if (!algoCambio) {
        toast.info("No hiciste cambios", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      userData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await editarUsuario(userData, user.usr_correo);
      console.log("Respuesta de editarUsuario:", response);

      if (response) {
        const datosActualizados = await obtenerUsuarioByCorreo(user.usr_correo);
        const datos = datosActualizados.usuario;
        setUser(datos);
        toast.success("Usuario editado correctamente", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        navigate(TIPOS_USUARIO[user.usr_tipo].redirectPath);
      } else {
        toast.error("Error al editar el usuario", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Desactivar el botón de registro si el formulario no es válido
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    let valid = false;

    if (user.usr_tipo === 1) {
      valid =
        tel.trim() !== "" &&
        selectedDate instanceof Date &&
        !isNaN(selectedDate.getTime()) &&
        selectedTematicas.length === 3;
    } else {
      valid =
        tel && selectedDate instanceof Date && !isNaN(selectedDate.getTime());
    }

    setIsFormValid(valid);
  }, [tel, selectedDate, selectedTematicas, user.usr_tipo]);

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
            enableReinitialize
            initialValues={{
              signinfrmnombre: user?.usr_nombre || "",
              signinfrmappaterno: user?.usr_ap_paterno || "",
              signinfrmapmaterno: user?.usr_ap_materno || "",
              signinfrmnacimiento: user?.usr_fecha_nac || "",
              signinfrmtelefono: user?.usr_telefono || "",
              signinfrmfoto: "",
            }}
            validationSchema={userSchema}
            onSubmit={handleEditar}
          >
            {({ setFieldValue, errors, touched }) => {
              return (
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
                        <label
                          htmlFor="signin-frm-nombre"
                          className="frm-label"
                        >
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
                          hideNavigation={false}
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
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setFieldValue(
                              "signinfrmnacimiento",
                              date?.toISOString()
                            );
                          }}
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
                          className="registros-calendar"
                        />
                      </div>
                    </div>
                    {user.usr_tipo === 1 ? (
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
                                {Object.values(TEMATICAS).map((tematica) => (
                                  <div
                                    className="registros-chk"
                                    key={tematica.id}
                                  >
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
                                <span id="file-name" ref={fileNameRef}>
                                  {user?.usr_foto
                                    ? "Cambiar Archivo"
                                    : "Seleccionar Archivo"}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  name="signinfrmfoto"
                                  id="registros-frm-foto"
                                  style={{ display: "none" }}
                                  onChange={(event) =>
                                    handleImageChange(event, setFieldValue)
                                  }
                                />
                              </div>
                            </div>
                            {imagePreview && (
                              <UserImage
                                src={imagePreview}
                                alt="Foto de Perfil"
                                id="foto-preview"
                              />
                            )}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className={`button ` + (isFormValid ? "" : "disabled")}
                    value="Guardar cambios"
                    id="registros-button"
                    disabled={isFormValid ? false : true}
                  >
                    Guardar Cambios
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </main>
    </motion.div>
  );
}

export default ProfileEdit;
