import { useState, useEffect, useRef } from "react";
import Icons from "../../components/Other/IconProvider";
const { FaStar, FaTrash, IoIosCheckmarkCircle, LuImageUp, FaImage } = Icons;
import { Formik, Form, Field } from "formik";
import { format } from "date-fns";
import { es } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { motion } from "framer-motion";
import ToastMessage from "../../components/Other/ToastMessage";
import { SERVICIOS, PREGUNTAS_RESPUESTAS } from "../../constants/catalog";
import useServicio from "../../hooks/Encuesta/useServicio";
import usePreguntas from "../../hooks/Encuesta/usePreguntas";
import useEncuesta from "../../hooks/Encuesta/useEncuesta";
import { useParams } from "react-router";
import { useAuth } from "../../context/AuthProvider";

function RegistroVisita() {
  const { servicios, loading, error } = useServicio();
  const { museoId } = useParams();
  const { user } = useAuth();

  const {
    preguntas,
    loading: loadingPreguntas,
    error: errorPreguntas,
  } = usePreguntas({
    encuestaId: 1,
  });

  const { fetchEncuesta, registrarEncuesta, updateEncuesta } = useEncuesta();
  const [contestada, setContestada] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [loadingRespuestas, setLoadingRespuestas] = useState(true);
  const [respuestasAnteriores, setRespuestasAnteriores] = useState([]);
  const [serviciosAnteriores, setServiciosAnteriores] = useState([]);

  useEffect(() => {
    if (!user?.usr_correo || !preguntas?.length) return;

    const fetchData = async () => {
      try {
        setLoadingRespuestas(true);
        const response = await fetchEncuesta({
          encuestaId: 1,
          correo: user.usr_correo,
          museoId,
        });

        const data = response.data; // <-- Aquí extraes la data

        setContestada(data.contestada);

        const valoresIniciales = {};

        if (data.respuestas && data.respuestas.length > 0) {
          data.respuestas.forEach((respuesta) => {
            valoresIniciales[`registrosfrmp${respuesta.preg_id}`] =
              respuesta.res_id || "";
          });

          // Guardar respuestas originales
          const anteriores = data.respuestas.map((respuesta) => ({
            preguntaId: respuesta.preg_id,
            respuesta: respuesta.res_id,
          }));
          setRespuestasAnteriores(anteriores);
        } else {
          preguntas.forEach((pregunta) => {
            valoresIniciales[`registrosfrmp${pregunta.preg_id}`] = "";
          });
          setRespuestasAnteriores([]);
        }

        // Guardar servicios originales
        valoresIniciales["registrosfrmservicios"] = Array.isArray(
          data.servicios
        )
          ? data.servicios.map((servicio) => servicio.ser_id)
          : [];

        setServiciosAnteriores(valoresIniciales["registrosfrmservicios"]);

        setInitialValues(valoresIniciales);
      } catch (error) {
        console.error("Error fetching encuesta:", error);
      } finally {
        setLoadingRespuestas(false);
      }
    };

    fetchData();
  }, [user, museoId, preguntas]);

  // Para la encuesta
  const handleEncuestaSubmit = async (values) => {
    const respuestas = [];
    const servicios = values.registrosfrmservicios || [];

    // Extraer respuestas del formulario
    Object.entries(values).forEach(([key, value]) => {
      if (key.startsWith("registrosfrmp") && key !== "registrosfrmservicios") {
        const preguntaId = parseInt(key.replace("registrosfrmp", ""));
        respuestas.push({
          preguntaId,
          respuesta: parseInt(value),
        });
      }
    });

    // Si ya contestó, solo enviar lo que cambió
    if (contestada) {
      // Opcional: verificar si hay cambios reales para evitar llamada
      const respuestasIguales =
        respuestas.length === respuestasAnteriores.length &&
        respuestas.every((r) => {
          const original = respuestasAnteriores.find(
            (o) => o.preguntaId === r.preguntaId
          );
          return original && original.respuesta === r.respuesta;
        });

      const serviciosIguales =
        servicios.length === serviciosAnteriores.length &&
        servicios.every((id) => serviciosAnteriores.includes(id));

      if (respuestasIguales && serviciosIguales) {
        ToastMessage({
          tipo: "info",
          mensaje: "No se realizaron cambios en tus respuestas.",
          position: "top-right",
        });
        return;
      }

      try {
        await updateEncuesta({
          encuestaId: 1,
          correo: user.usr_correo,
          museoId,
          data: {
            respuestas, // envías todo
            servicios, // envías todo
          },
        });

        ToastMessage({
          tipo: "success",
          mensaje: "Se actualizaron tus respuestas",
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al actualizar encuesta:", error);
        ToastMessage({
          tipo: "error",
          mensaje: "Error al actualizar la encuesta",
        });
      }
    } else {
      // Primera vez: enviar todo igual
      try {
        await registrarEncuesta({
          encuestaId: 1,
          correo: user.usr_correo,
          museoId,
          data: {
            respuestas,
            servicios,
          },
        });

        ToastMessage({
          tipo: "success",
          mensaje: "Se guardaron tus respuestas",
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al enviar encuesta:", error);
        ToastMessage({
          tipo: "error",
          mensaje: "Error al enviar la encuesta",
        });
      }
    }
  };

  // Variables para la reseña
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");

  // Para la fecha de la visita
  const [diaSelected, setDiaSelected] = useState(new Date());
  const handleDayPickerSelect = (date) => {
    if (!date) {
      setDiaSelected(new Date());
    } else {
      setDiaSelected(date);
    }
  };

  // Fecha actual en UTC -6
  let today = new Date();
  today.setHours(today.getHours() - 6);

  // Para las imagenes de la reseña
  const fileInputRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Función para abrir el input de file
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // Función para subir las imagenes desde arrastrar y soltar
  const handleDrop = (e, setFieldValue, values) => {
    e.preventDefault();

    const currentFiles = values.regresfrmfotos || [];

    const files = e.dataTransfer.files;
    const uploadedFiles = Array.from(files);

    if (uploadedFiles.length + currentFiles.length > 5) {
      ToastMessage({
        tipo: "error",
        mensaje: `Máximo 5 fotos`,
        position: "top-right",
      });
      return;
    }

    setFieldValue("regresfrmfotos", [...currentFiles, ...uploadedFiles]);

    uploadedFiles.forEach((file) => {
      handleFileUpload(file);
    });
  };

  // Funcion para subir las imagenes
  const handleFileChange = ({ target }, setFieldValue) => {
    const file = target.files[0];
    if (file && uploadedFiles.length < 5) {
      handleFileUpload(file);

      // Agregar la nueva imagen a la lista de imagenes
      setFieldValue("regresfrmfotos", [...uploadedFiles, file]);
    } else {
      ToastMessage({
        tipo: "error",
        mensaje: `Máximo 5 fotos`,
        position: "top-right",
      });
    }
  };

  // Funcion para eliminar las imagenes
  const handleFileDelete = (name) => {
    const newFiles = uploadedFiles.filter((file) => file.name !== name);
    setUploadedFiles(newFiles);
  };

  // Función para el tamaño de la imagen
  const formatBytes = (bytes) => {
    if (bytes === 0) {
      return "0 Bytes";
    }

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = (file) => {
    setProgress({ name: file.name, percent: 0 });
    let uploadPercent = 0;
    const interval = setInterval(() => {
      uploadPercent += 10;
      setProgress({ name: file.name, percent: uploadPercent });
      if (uploadPercent >= 100) {
        clearInterval(interval);
        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          { name: file.name, size: formatBytes(file.size) },
        ]);
        setProgress(null);
      }
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="registros-encuesta-main">
        <div id="registros-encuesta-form">
          <h1>Reseña</h1>
          <Formik
            initialValues={{
              regresfrmfecVis: diaSelected,
              regresfrmcomentario: "",
              regresfrmrating: 0,
              regresfrmfotos: uploadedFiles.length ? uploadedFiles : [],
            }}
            onSubmit={async (values) => {
              const formValues = {
                ...values,
                regresfrmcomentario: comment || "Sin comentario",
                regresfrmfotos: uploadedFiles.length > 0 ? uploadedFiles : [],
              };
              console.log(formValues);
            }}
          >
            {({ setFieldValue, values }) => (
              <Form id="registros-encuesta-form">
                <div className="registros-field-calendar">
                  <label>Fecha de la visita</label>
                  <DayPicker
                    hideNavigation
                    animate
                    locale={es}
                    timeZone="UTC"
                    captionLayout="dropdown"
                    fixedWeeks
                    month={diaSelected}
                    onMonthChange={setDiaSelected}
                    autoFocus
                    mode="single"
                    selected={diaSelected}
                    onSelect={handleDayPickerSelect}
                    footer={
                      diaSelected
                        ? `Seleccionaste el ${format(
                            diaSelected,
                            "dd-MM-yyyy"
                          )}`
                        : "Selecciona una fecha"
                    }
                    modifiers={{
                      disabled: { after: today },
                    }}
                    className="registros-calendar"
                    classNames={{ chevron: "calendar-chevron" }}
                  />
                </div>
                <div className="registros-field">
                  <textarea
                    id="regres-frm-comentario"
                    name="regresfrmcomentario"
                    placeholder="Comentario"
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="registros-field-calif">
                  <h2>¿Cuántas estrellas le das a tu visita?</h2>
                  <div
                    className="registros-field-calif-body"
                    id="calificacion-menu"
                  >
                    <div className="stars-rate-container">
                      {[...Array(5)].map((star, index) => {
                        const currentRate = index + 1;
                        return (
                          <label className="stars-rate" key={currentRate}>
                            <Field
                              type="radio"
                              name="regresfrmrating"
                              value={currentRate}
                              onClick={() => setRating(currentRate)}
                            />
                            <FaStar
                              className="stars-checkbox-span"
                              size={50}
                              color={
                                currentRate <= (hover || rating)
                                  ? "#000"
                                  : "#d9d9d9"
                              }
                              onMouseEnter={() => setHover(currentRate)}
                              onMouseLeave={() => setHover(null)}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="registros-field-fotos">
                  <h2>Subir fotos</h2>
                  <div
                    id="registros-fotos-container"
                    onClick={handleFileClick}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, setFieldValue, values)}
                  >
                    <input
                      type="file"
                      id="file-input"
                      name="regresfrmfotos"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      hidden
                    />
                    <LuImageUp />
                    <label>
                      Sube aquí tus fotos
                      <br />
                      (Haz clic o arrastra la imagen)
                    </label>
                  </div>
                  {progress && (
                    <section className="progress-area">
                      <li className="row">
                        <FaImage />
                        <div className="content">
                          <div className="details">
                            <span className="name">
                              {progress.name} • Subiendo
                            </span>
                            <span className="percent-image">
                              {progress.percent} %
                            </span>
                          </div>
                          <div className="progress-bar-image">
                            <div
                              className="progress-image"
                              style={{
                                width: `${progress.percent}%`,
                                transition: "width 0.3s",
                              }}
                            ></div>
                          </div>
                        </div>
                      </li>
                    </section>
                  )}
                  <section className="uploaded-area">
                    {uploadedFiles.map((file, index) => (
                      <li className="row" key={index}>
                        <div className="content">
                          <FaImage />
                          <div className="details">
                            <span className="name">{file.name} • Subida</span>
                            <span className="size">{file.size}</span>
                          </div>
                        </div>
                        <div className="icons-file">
                          <IoIosCheckmarkCircle />
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleFileDelete(file.name)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </li>
                    ))}
                  </section>
                </div>
                <Field
                  className="button"
                  id="registros-button"
                  type="submit"
                  value="Subir Reseña"
                />
              </Form>
            )}
          </Formik>
        </div>
        <div id="registros-linea-encuesta"></div>
        <div id="registros-encuesta">
          {!loadingRespuestas && (
            <>
              <h1>Encuesta</h1>
              <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(values) => {
                  handleEncuestaSubmit(values);
                }}
              >
                {({ setFieldValue, values }) => (
                  <Form id="registros-encuesta-form">
                    <p id="encuesta-contestada">
                      {contestada
                        ? "Ya has contestado la encuesta. Puedes hacer cambios en tus respuestas"
                        : "Responde la encuesta para ayudar a otros visitantes"}
                    </p>
                    {preguntas.map((pregunta) => (
                      <div className="registros-field" key={pregunta.preg_id}>
                        <Field
                          as="select"
                          name={`registrosfrmp${pregunta.preg_id}`}
                          className="registros-frm-select"
                          value={values[`registrosfrmp${pregunta.preg_id}`]}
                          onChange={(e) =>
                            setFieldValue(
                              `registrosfrmp${pregunta.preg_id}`,
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="" disabled>
                            {pregunta.pregunta}
                          </option>
                          {PREGUNTAS_RESPUESTAS[
                            pregunta.preg_id
                          ]?.respuestas.map((respuesta) => (
                            <option
                              key={respuesta.respuesta}
                              value={respuesta.valor}
                            >
                              {respuesta.respuesta}
                            </option>
                          ))}
                        </Field>
                      </div>
                    ))}
                    <div className="registros-chks">
                      <fieldset>
                        <legend>
                          Selecciona los servicios con los que cuenta el museo
                        </legend>
                        <div id="servicios-chks">
                          {servicios.map((servicio) => (
                            <label
                              title={servicio.ser_nombre}
                              className="registros-chk-serv"
                              key={servicio.ser_id}
                            >
                              <Field
                                type="checkbox"
                                name="registrosfrmservicios"
                                value={servicio.ser_id}
                                checked={(
                                  values.registrosfrmservicios || []
                                ).includes(servicio.ser_id)}
                                onChange={(e) => {
                                  const selectedServices = [
                                    ...values.registrosfrmservicios,
                                  ];
                                  if (e.target.checked) {
                                    selectedServices.push(servicio.ser_id);
                                  } else {
                                    const index = selectedServices.indexOf(
                                      servicio.ser_id
                                    );
                                    if (index > -1) {
                                      selectedServices.splice(index, 1);
                                    }
                                  }
                                  setFieldValue(
                                    "registrosfrmservicios",
                                    selectedServices
                                  );
                                }}
                              />
                              <span>
                                <img
                                  src={SERVICIOS[servicio.ser_id].icon}
                                  alt={servicio.ser_nombre}
                                />
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                    <Field
                      className="button"
                      type="submit"
                      id="registros-button"
                      value={
                        contestada ? "Actualizar Encuesta" : "Enviar Encuesta"
                      }
                    />
                  </Form>
                )}
              </Formik>
            </>
          )}
        </div>
      </main>
    </motion.div>
  );
}

export default RegistroVisita;
