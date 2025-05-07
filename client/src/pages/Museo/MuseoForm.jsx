import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { AnimatePresence, m, motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, Bounce } from "react-toastify";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import museoPlaceholder from "../../assets/images/others/museo-main-1.jpg";
import ErrorCampo from "../../components/ErrorCampo";

import { ThreeDot } from "react-loading-indicators";

// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";

import { format, set } from "date-fns";
import { es, se } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const validationSchema = Yup.object({
  museofrmnombre: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "El nombre solo puede contener letras y números"
    )
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres")
    .required("Campo requerido"),
  museofrmcalle: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "La calle solo puede contener letras y números"
    )
    .min(3, "La calle debe tener al menos 3 caracteres")
    .max(100, "La calle no puede exceder los 100 caracteres")
    .required("Campo requerido"),
  museofrmnumext: Yup.string()
    .matches(/^[0-9]+$/, "El número exterior solo puede contener números")
    .required("Campo requerido"),
  museofrmcolonia: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "La colonia solo puede contener letras y números"
    )
    .min(3, "La colonia debe tener al menos 3 caracteres")
    .max(100, "La colonia no puede exceder los 100 caracteres")
    .required("Campo requerido"),
  museofrmcp: Yup.string()
    .matches(
      /^[0-9]{5}$/,
      "El código postal debe tener 5 dígitos y solo números"
    )
    .max(5, "El código postal debe tener 5 dígitos")
    .required("Campo requerido"),
  museofrmalcaldia: Yup.string().required("Campo requerido"),
  museofrmtematicamuseo: Yup.string().required("Campo requerido"),
  museofrmdescripcion: Yup.string()
    .required("Campo requerido")
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  museofrmglatitud: Yup.number()
    .required("Campo requerido")
    .typeError("La latitud debe ser un número"),
  museofrmglongitud: Yup.number()
    .required("Campo requerido")
    .typeError("La longitud debe ser un número"),
  museofrmfoto: Yup.mixed()
    .test("fileSize", "El archivo es muy grande", (value) => {
      if (value && value.size) {
        return value.size <= 2000000;
      }
      return true;
    })
    .test("fileType", "Tipo de archivo no soportado", (value) => {
      if (value && value.type) {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        return allowedTypes.includes(value.type);
      }
      return true;
    }),
});

function MuseoForm({ mode }) {
  const { museoId } = useParams();
  const [museoEdit, setMuseoEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileNameRef = useRef(null);

  // Logica para editar museo
  useEffect(() => {
    if (mode === "edit") {
      setLoading(true);
      // Aquí puedes hacer la lógica para cargar los datos del museo a editar
      // Por ejemplo, hacer una llamada a la API para obtener los datos del museo
      // y luego establecer esos datos en el formulario.
      setTimeout(() => {
        setMuseoEdit({
          mus_nombre: "Museo de Ejemplo",
          mus_foto: museoPlaceholder,
          mus_fec_ap: "2023-01-01",
          mus_tematica: "Arte",
          mus_g_latitud: 19.4326,
          mus_g_longitud: -99.1332,
          mus_calle: "Calle Ejemplo",
          mus_num_ext: "123",
          mus_colonia: "Colonia Ejemplo",
          mus_cp: "12345",
          mus_alcaldia: "Cuauhtémoc",
          mus_descripcion: "Descripción del museo xd",
        });
        setLoading(false);
      }, 2000); // Simulación de carga
    }
  }, [mode, museoId]);

  // Para la imagen inicial
  useEffect(() => {
    if (mode === "edit" && museoEdit?.mus_foto) {
      setImagePreview(museoEdit.mus_foto);
      if (fileNameRef.current) {
        fileNameRef.current.textContent = museoEdit.mus_foto.split("/").pop();
      }
    } else {
      setImagePreview(museoPlaceholder);
      if (fileNameRef.current) {
        fileNameRef.current.textContent = "Seleccionar Archivo";
      }
    }
  }, [mode, museoEdit]);

  // Para fecha de apertura
  useEffect(() => {
    if (museoEdit?.mus_fec_ap) {
      const fecha = new Date(museoEdit.mus_fec_ap);
      setMes(fecha);
      setSelectedDate(fecha);
    }
  }, [museoEdit]);

  const TEMATICAS = [
    {
      id: 1,
      tematica: "Antropología",
    },
    { id: 2, tematica: "Arte" },
    { id: 3, tematica: "Arte Alternativo" },
    { id: 4, tematica: "Arqueología" },
    { id: 5, tematica: "Ciencia y Tecnología" },
    { id: 6, tematica: "Especializado" },
    { id: 7, tematica: "Historia" },
    { id: 8, tematica: "Otro" },
  ];

  const ALCALDIAS = ["Cuauhtémoc", "Benito Juárez", "Miguel Hidalgo"];

  // TextArea
  const [comment, setComment] = useState("");

  // Lógica para el cambio de imagen de perfil
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(museoPlaceholder);
  const imageInputRef = useRef(null);
  const [openCropper, setOpenCropper] = useState(false);
  const [imageOriginal, setImageOriginal] = useState(null);

  // Sin ImageCropper
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];

    if (file) {
      setFieldValue("museofrmfoto", file);
      setImagePreview(URL.createObjectURL(file));
      if (fileNameRef.current) {
        fileNameRef.current.textContent = file.name;
      }
    } else {
      setImagePreview(
        mode === "edit" && museoEdit?.mus_foto
          ? museoEdit.mus_foto
          : museoPlaceholder
      );
      if (fileNameRef.current) {
        fileNameRef.current.textContent =
          mode === "edit" ? "Cambiar Archivo" : "Seleccionar Archivo";
      }
    }
  };

  // Fecha de apertura
  const [mes, setMes] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDayPickerSelect = (date, setFieldValue) => {
    const selectedDate = date || new Date();
    setSelectedDate(selectedDate);
    setFieldValue("museofrmfecapertura", format(selectedDate, "yyyy-MM-dd"));
  };

  // Fecha actual en UTC -6
  let today = new Date();
  today.setHours(today.getHours() - 6);

  const handleRegistroMuseo = async (values) => {
    console.log(values);
  };

  return (
    <>
      <main id="registros-main">
        {loading ? (
          <div className="loading-indicator">
            <ThreeDot color={["#004879", "#0067ac", "#0085df", "#13a0ff"]} />
          </div>
        ) : (
          <motion.div
            id="registros-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="registros-form-container"
            key={"museo-form"}
          >
            <h1>{mode === "edit" ? "Editar Museo" : "Registrar Museo"}</h1>
            <Formik
              enableReinitialize={true}
              initialValues={{
                museofrmnombre: museoEdit?.mus_nombre || "",
                museofrmcalle: museoEdit?.mus_calle || "",
                museofrmnumext: museoEdit?.mus_num_ext || "",
                museofrmcolonia: museoEdit?.mus_colonia || "",
                museofrmcp: museoEdit?.mus_cp || "",
                museofrmalcaldia: museoEdit?.mus_alcaldia || "",
                museofrmfecapertura: museoEdit?.mus_fec_ap || "",
                museofrmdescripcion: museoEdit?.mus_descripcion || "",
                museofrmtematicamuseo: museoEdit?.mus_tematica || "",
                museofrmglatitud: museoEdit?.mus_g_latitud || "",
                museofrmglongitud: museoEdit?.mus_g_longitud || "",
                museofrmfoto: museoEdit?.mus_foto || null,
              }}
              validationSchema={validationSchema}
              validateOnMount={true}
              onSubmit={(values) => {
                // Aquí puedes manejar el envío del formulario
                handleRegistroMuseo(values);
              }}
            >
              {({ values, setFieldValue, errors, touched, isValid, dirty }) => (
                <Form id="museo-frm">
                  <div className="registros-container">
                    <div className="registros-data-container">
                      <div className="registros-field">
                        <Field
                          type="text"
                          id="museo-frm-nombre"
                          name="museofrmnombre"
                          placeholder="Nombre de Museo"
                          maxLength="100"
                          minLength="3"
                          required
                        />
                        <label htmlFor="museo-frm-nombre" className="frm-label">
                          Nombre de Museo
                        </label>
                        {errors.museofrmnombre && touched.museofrmnombre && (
                          <ErrorCampo mensaje={errors.museofrmnombre} />
                        )}
                      </div>
                      <div className="registros-field">
                        <Field
                          type="text"
                          id="museo-frm-calle"
                          name="museofrmcalle"
                          placeholder="Calle"
                          maxLength="100"
                          minLength="3"
                          required
                        />
                        <label htmlFor="museo-frm-calle" className="frm-label">
                          Calle
                        </label>
                        {errors.museofrmcalle && touched.museofrmcalle && (
                          <ErrorCampo mensaje={errors.museofrmcalle} />
                        )}
                      </div>
                      <div className="registros-field">
                        <Field
                          type="text"
                          id="museo-frm-num-ext"
                          name="museofrmnumext"
                          placeholder="Número Exterior"
                          required
                        />
                        <label
                          htmlFor="museo-frm-num-ext"
                          className="frm-label"
                        >
                          Número Exterior
                        </label>
                        {errors.museofrmnumext && touched.museofrmnumext && (
                          <ErrorCampo mensaje={errors.museofrmnumext} />
                        )}
                      </div>
                      <div className="registros-field">
                        <Field
                          type="text"
                          id="museo-frm-colonia"
                          name="museofrmcolonia"
                          placeholder="Colonia"
                          required
                        />
                        <label
                          htmlFor="museo-frm-colonia"
                          className="frm-label"
                        >
                          Colonia
                        </label>
                        {errors.museofrmcolonia && touched.museofrmcolonia && (
                          <ErrorCampo mensaje={errors.museofrmcolonia} />
                        )}
                      </div>
                      <div className="registros-field">
                        <Field
                          type="text"
                          id="museo-frm-cp"
                          name="museofrmcp"
                          placeholder="Código Postal"
                          maxLength="5"
                          required
                        />
                        <label htmlFor="museo-frm-cp" className="frm-label">
                          Código Postal
                        </label>
                        {errors.museofrmcp && touched.museofrmcp && (
                          <ErrorCampo mensaje={errors.museofrmcp} />
                        )}
                      </div>
                      <div className="registros-field">
                        <Field
                          as="select"
                          name="museofrmalcaldia"
                          className="registros-frm-select"
                          value={values.museofrmalcaldia}
                          onChange={(e) => {
                            setFieldValue("museofrmalcaldia", e.target.value);
                          }}
                          required
                        >
                          <option value="" disabled>
                            Selecciona la Alcaldía
                          </option>
                          {ALCALDIAS.map((alcaldia) => (
                            <option key={alcaldia} value={alcaldia}>
                              {alcaldia}
                            </option>
                          ))}
                        </Field>
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
                          onSelect={(date) =>
                            handleDayPickerSelect(date, setFieldValue)
                          }
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
                    </div>
                    <div id="registros-linea"></div>
                    <div className="registros-data-container">
                      <div className="registros-field-container">
                        <div className="registros-field">
                          <Field
                            as="textarea"
                            id="museo-frm-descripcion"
                            name="museofrmdescripcion"
                            placeholder="Descripción del Museo"
                            maxLength={500}
                            minLength={3}
                            required
                          />
                          {errors.museofrmdescripcion &&
                            touched.museofrmdescripcion && (
                              <ErrorCampo
                                mensaje={errors.museofrmdescripcion}
                              />
                            )}
                        </div>
                        <div className="registros-field">
                          <Field
                            as="select"
                            name="museofrmtematicamuseo"
                            className="registros-frm-select"
                            value={values.museofrmtematicamuseo}
                            onChange={(e) => {
                              setFieldValue(
                                "museofrmtematicamuseo",
                                e.target.value
                              );
                            }}
                            required
                          >
                            <option value="" disabled>
                              Selecciona la temática del museo
                            </option>
                            {TEMATICAS.map((tematica) => (
                              <option
                                key={tematica.id}
                                value={tematica.tematica}
                              >
                                {tematica.tematica}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <div className="registros-field">
                          <Field
                            type="number"
                            id="museo-frm-g-latitud"
                            name="museofrmglatitud"
                            placeholder="Google Maps Latitud"
                            required
                          />
                          <label
                            htmlFor="museo-frm-g-latitud"
                            className="frm-label"
                          >
                            Google Maps Latitud
                          </label>
                          {errors.museofrmglatitud &&
                            touched.museofrmglatitud && (
                              <ErrorCampo mensaje={errors.museofrmglatitud} />
                            )}
                        </div>
                        <div className="registros-field">
                          <Field
                            type="number"
                            id="museo-frm-g-longitud"
                            name="museofrmglongitud"
                            placeholder="Google Maps Longitud"
                            required
                          />
                          <label
                            htmlFor="museo-frm-g-longitud"
                            className="frm-label"
                          >
                            Google Maps Longitud
                          </label>
                          {errors.museofrmglongitud &&
                            touched.museofrmglongitud && (
                              <ErrorCampo mensaje={errors.museofrmglongitud} />
                            )}
                        </div>
                      </div>
                      <hr />
                      <div className="registros-field-foto">
                        <div className="registros-field-foto-input">
                          <h2>Foto principal del Museo</h2>
                          <div className="foto-input">
                            <Field
                              className="file-btn"
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById("museo-frm-foto")
                                  .click()
                              }
                              value="Seleccionar Archivo"
                            />
                            <span id="file-name" ref={fileNameRef}>
                              {mode === "edit"
                                ? "Cambiar Archivo"
                                : "Seleccionar Archivo"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              ref={imageInputRef}
                              id="museo-frm-foto"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                handleImageChange(e, setFieldValue);
                              }}
                            />
                          </div>
                        </div>
                        {imagePreview && (
                          <div className="foto-preview">
                            {errors.museofrmfoto && touched.museofrmfoto ? (
                              <ErrorCampo mensaje={errors.museofrmfoto} />
                            ) : (
                              <img
                                src={imagePreview}
                                alt="Foto de Perfil"
                                id="foto-preview"
                              />
                            )}
                          </div>
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
                    value={
                      mode === "edit" ? "Actualizar Museo" : "Registrar Museo"
                    }
                    className={`button ${isValid && dirty ? "" : "disabled"}`}
                    id="registros-button"
                    disabled={isValid && dirty ? false : true}
                  />
                </Form>
              )}
            </Formik>
          </motion.div>
        )}
      </main>
    </>
  );
}

export default MuseoForm;
