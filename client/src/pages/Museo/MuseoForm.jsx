import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import { toast, Bounce } from "react-toastify";
import "react-phone-number-input/style.css";
import museoPlaceholder from "../../assets/images/others/museo-main-1.jpg";
import ErrorCampo from "../../components/Forms/ErrorCampo";
import { ThreeDot } from "react-loading-indicators";
import { format } from "date-fns";
import { es } from "react-day-picker/locale";
import { DayPicker, Nav } from "react-day-picker";
import "react-day-picker/style.css";
import { ALCALDIAS, TEMATICAS, REDES_SOCIALES } from "../../constants/catalog";
import { useMuseo } from "../../hooks/Museo/useMuseo";
import useMuseoRedesSociales from "../../hooks/Museo/useMuseoRedesSociales";
import { buildImage } from "../../utils/buildImage";
import { museoSchema } from "../../constants/validationSchemas";
import axios from "axios";
import { BACKEND_URL } from "../../constants/api";
import Icons from "../../components/Other/IconProvider";
import LoadingIndicator from "../../components/Other/LoadingIndicator";

const { FaPlus, CgClose, MdEdit, MdCheck } = Icons;

function MuseoForm({ mode }) {
  const { museoId } = useParams();
  const fileNameRef = useRef(null);

  const {
    museo: museoEdit,
    loading,
    error,
  } = useMuseo(mode === "edit" ? museoId : null);

  // Para la imagen inicial
  useEffect(() => {
    if (mode === "edit" && museoEdit?.img) {
      const image = buildImage(museoEdit);
      setImagePreview(image);
      if (fileNameRef.current) {
        fileNameRef.current.textContent = museoEdit.img.name;
      }
    } else {
      setImagePreview(museoPlaceholder);
      if (fileNameRef.current) {
        fileNameRef.current.textContent = "Seleccionar Archivo";
      }

      // Convertir el placeholder a archivo y guardarlo
      fetch(museoPlaceholder)
        .then((res) => res.blob())
        .then((blob) => {
          const placeholderFile = new File([blob], "placeholder.jpg", {
            type: blob.type,
          });
          setImage(placeholderFile); // puedes usar esto o actualizar Formik directamente en setFieldValue
        });
    }
  }, [mode, museoEdit]);

  // Para fecha de apertura
  useEffect(() => {
    if (museoEdit?.fecha_apertura) {
      const fecha = new Date(museoEdit.fecha_apertura);
      setMes(fecha);
      setSelectedDate(fecha);
    }
  }, [museoEdit]);

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
      setFieldValue("museofrmfoto", null);
      setImagePreview(
        mode === "edit" && museoEdit?.img ? museoEdit.img : museoPlaceholder
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

  // Redes sociales
  const {
    redesSociales,
    loading: loadingRedes,
    error: errorRedes,
  } = useMuseoRedesSociales(museoId);
  const [redesLocales, setRedesLocales] = useState([]);
  const [redSeleccionada, setRedSeleccionada] = useState("");
  const [redesTemporal, setRedesTemporal] = useState([]);
  const [redesTemporalEditando, setRedesTemporalEditando] = useState([]);
  const [redesEditando, setRedesEditando] = useState([]);

  // Cuando cambian redesSociales, copiamos en el estado local editable
  useEffect(() => {
    if (redesSociales) {
      setRedesLocales(redesSociales);
    }
  }, [redesSociales]);

  // Al editar una red existente
  const handleCambiarLinkRedExistente = (id, nuevoLink) => {
    setRedesLocales((prev) =>
      prev.map((r) => (r.mhrs_id === id ? { ...r, mhrs_link: nuevoLink } : r))
    );
  };

  // Al eliminar red existente
  const handleEliminarRedExistente = (id) => {
    setRedesLocales((prev) => prev.filter((r) => r.mhrs_id !== id));
  };

  const handleAgregarRedTemporal = () => {
    if (!redSeleccionada) return;

    const id = parseInt(redSeleccionada);
    const yaExiste = redesTemporal.some((r) => r.id === id);
    if (yaExiste) return;

    const red = REDES_SOCIALES[id];
    setRedesTemporal([
      ...redesTemporal,
      { id: red.id, nombre: red.nombre, link: "" },
    ]);

    // Añade el id a redesTemporalEditando para que se active el input automáticamente
    setRedesTemporalEditando([...redesTemporalEditando, id]);

    setRedSeleccionada("");
  };

  // Al enviar todo:
  const handleActualizarTodo = async () => {
    const datosParaEnviar = [
      ...redesLocales.map((r) => ({
        id: r.mhrs_cve_rs,
        nombre: REDES_SOCIALES[r.mhrs_cve_rs].nombre,
        link: r.mhrs_link,
        tipo: "existente",
      })),
      ...redesTemporal.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        link: r.link,
        tipo: "nuevo",
      })),
    ];

    // Aquí llamas a la API con datosParaEnviar
    console.log(datosParaEnviar);
  };

  const handleRegistroMuseo = async (values) => {
    const formData = new FormData();

    let response;
    if (mode === "edit") {
      if (values.museofrmnombre !== museoEdit?.nombre) {
        formData.append("nombre", values.museofrmnombre);
      }
      if (values.museofrmcalle !== museoEdit?.calle) {
        formData.append("calle", values.museofrmcalle);
      }
      if (values.museofrmnumext !== museoEdit?.num_ext) {
        formData.append("num_ext", values.museofrmnumext);
      }
      if (values.museofrmcolonia !== museoEdit?.colonia) {
        formData.append("colonia", values.museofrmcolonia);
      }
      if (values.museofrmcp !== museoEdit?.cp) {
        formData.append("cp", values.museofrmcp);
      }
      if (values.museofrmalcaldia !== museoEdit?.alcaldia) {
        formData.append("alcaldia", values.museofrmalcaldia);
      }
      if (values.museofrmfecapertura !== museoEdit?.fecha_apertura) {
        formData.append("fecha_apertura", values.museofrmfecapertura);
      }
      if (values.museofrmdescripcion !== museoEdit?.descripcion) {
        formData.append("descripcion", values.museofrmdescripcion);
      }
      if (values.museofrmtematicamuseo !== museoEdit?.tematica) {
        formData.append("tematica", values.museofrmtematicamuseo);
      }
      if (values.museofrmglatitud !== museoEdit?.g_latitud) {
        formData.append("g_latitud", values.museofrmglatitud);
      }
      if (values.museofrmglongitud !== museoEdit?.g_longitud) {
        formData.append("g_longitud", values.museofrmglongitud);
      }
      // Verifica si la imagen es un archivo File y no un Blob
      if (values.museofrmfoto && values.museofrmfoto instanceof File) {
        formData.append("img", values.museofrmfoto);
      }

      // Enviar al backend
      const endpoint = `${BACKEND_URL}/api/museos/${museoId}`;
      response = await axios.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else if (mode === "create") {
      formData.append("nombre", values.museofrmnombre);
      formData.append("calle", values.museofrmcalle);
      formData.append("num_ext", values.museofrmnumext);
      formData.append("colonia", values.museofrmcolonia);
      formData.append("cp", values.museofrmcp);
      formData.append("alcaldia", values.museofrmalcaldia);
      formData.append("fecha_apertura", values.museofrmfecapertura);
      formData.append("descripcion", values.museofrmdescripcion);
      formData.append("tematica", values.museofrmtematicamuseo);
      formData.append("g_latitud", values.museofrmglatitud);
      formData.append("g_longitud", values.museofrmglongitud);
      // Asegúrate de que la imagen se añade si es nueva en el caso de creación
      if (!values.museofrmfoto && image instanceof File) {
        formData.append("img", image); // 'image' contiene el placeholder convertido
      } else if (values.museofrmfoto) {
        formData.append("img", values.museofrmfoto);
      }

      // Enviar al backend
      const endpoint = `${BACKEND_URL}/api/museos`;
      response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    if (response.status === 200) {
      // Actualizar la página
      try {
        await handleActualizarTodo();
      } catch (error) {
        console.error("Error al actualizar las redes sociales:", error);
      }

      if (mode === "edit") {
        window.location.reload();
      } else {
        // A editar los horarios
        Navigate(`/museos/${response.data.museoId}/horarios`);
      }
    } else {
      toast.error("Error al actualizar el museo", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <main id="registros-main">
        {loading ? (
          <LoadingIndicator />
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
                museofrmnombre: museoEdit?.nombre || "",
                museofrmcalle: museoEdit?.calle || "",
                museofrmnumext: museoEdit?.num_ext || "",
                museofrmcolonia: museoEdit?.colonia || "",
                museofrmcp: museoEdit?.cp || "",
                museofrmalcaldia: museoEdit?.alcaldia || "",
                museofrmfecapertura: museoEdit?.fecha_apertura || "",
                museofrmdescripcion: museoEdit?.descripcion || "",
                museofrmtematicamuseo: museoEdit?.tematica || "",
                museofrmglatitud: museoEdit?.g_latitud || "",
                museofrmglongitud: museoEdit?.g_longitud || "",
                museofrmfoto: museoPlaceholder || null,
              }}
              validationSchema={museoSchema}
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
                          maxLength="10"
                          minLength="1"
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
                      <hr />
                      <div className="registros-redes-container">
                        <h2>Redes Sociales</h2>
                        <div className="registros-redes-select">
                          <select
                            className="registros-frm-select"
                            value={redSeleccionada}
                            onChange={(e) => setRedSeleccionada(e.target.value)}
                          >
                            <option value="" disabled>
                              Selecciona la red social
                            </option>
                            {Object.values(REDES_SOCIALES).map((red) => (
                              <option key={red.id} value={red.id}>
                                {red.nombre}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={handleAgregarRedTemporal}
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div className="registros-redes-list">
                          {loadingRedes ? (
                            <LoadingIndicator />
                          ) : (
                            <>
                              {redesLocales.map((red) => {
                                const redCatalogo =
                                  REDES_SOCIALES[red.mhrs_cve_rs];
                                const estaEditando = redesEditando.includes(
                                  red.mhrs_id
                                );

                                return (
                                  <div
                                    className="registros-redes-item"
                                    key={`bd-${red.mhrs_id}`}
                                  >
                                    <div className="registros-redes-item-info">
                                      <h3>
                                        {redCatalogo?.nombre || "Desconocido"}
                                      </h3>
                                      {estaEditando ? (
                                        <input
                                          type="text"
                                          value={red.mhrs_link}
                                          onChange={(e) =>
                                            handleCambiarLinkRedExistente(
                                              red.mhrs_id,
                                              e.target.value
                                            )
                                          }
                                        />
                                      ) : (
                                        <span>{red.mhrs_link}</span>
                                      )}
                                    </div>

                                    {estaEditando ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setRedesEditando(
                                            redesEditando.filter(
                                              (id) => id !== red.mhrs_id
                                            )
                                          )
                                        }
                                      >
                                        <MdCheck />
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setRedesEditando([
                                            ...redesEditando,
                                            red.mhrs_id,
                                          ])
                                        }
                                      >
                                        <MdEdit />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEliminarRedExistente(red.mhrs_id)
                                      }
                                    >
                                      <CgClose />
                                    </button>
                                  </div>
                                );
                              })}

                              {redesTemporal.map((red) => {
                                const estaEditando =
                                  redesTemporalEditando.includes(red.id);

                                return (
                                  <div
                                    className="registros-redes-item"
                                    key={`tmp-${red.id}`}
                                  >
                                    <div className="registros-redes-item-info">
                                      <h3>{red.nombre}</h3>
                                      {estaEditando ? (
                                        <input
                                          type="text"
                                          placeholder="Ingresa el link"
                                          value={red.link}
                                          onChange={(e) => {
                                            const nuevasRedes =
                                              redesTemporal.map((r) =>
                                                r.id === red.id
                                                  ? {
                                                      ...r,
                                                      link: e.target.value,
                                                    }
                                                  : r
                                              );
                                            setRedesTemporal(nuevasRedes);
                                          }}
                                        />
                                      ) : (
                                        <span>{red.link || "Sin link"}</span>
                                      )}
                                    </div>

                                    {estaEditando ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setRedesTemporalEditando(
                                            redesTemporalEditando.filter(
                                              (id) => id !== red.id
                                            )
                                          )
                                        }
                                      >
                                        <MdCheck />
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setRedesTemporalEditando([
                                            ...redesTemporalEditando,
                                            red.id,
                                          ])
                                        }
                                      >
                                        <MdEdit />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setRedesTemporal(
                                          redesTemporal.filter(
                                            (r) => r.id !== red.id
                                          )
                                        )
                                      }
                                    >
                                      <CgClose />
                                    </button>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
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
                            {Object.values(TEMATICAS).map((tematica) => (
                              <option key={tematica.id} value={tematica.id}>
                                {tematica.nombre}
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
                            <button
                              className="file-btn"
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById("museo-frm-foto")
                                  .click()
                              }
                              name="museofrmfoto"
                              id="museo-frm-foto-btn"
                            >
                              Seleccionar Archivo
                            </button>
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
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`button ${isValid ? "" : "disabled"}`}
                    id="registros-button"
                    disabled={!isValid}
                  >
                    {mode === "edit" ? "Actualizar Museo" : "Registrar Museo"}
                  </button>
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
