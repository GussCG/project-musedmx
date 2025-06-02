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
import { useVisitas } from "../../hooks/Visitas/useVisitas";
import { formatearFechaBDDATE } from "../../utils/formatearFechas";
import ImageUploader from "../../components/Other/ImageUploader";

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

  const { yaVisitoMuseo } = useVisitas();

  const { fetchEncuesta, registrarEncuesta, updateEncuesta } = useEncuesta();
  const [contestada, setContestada] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [loadingRespuestas, setLoadingRespuestas] = useState(true);
  const [respuestasAnteriores, setRespuestasAnteriores] = useState([]);
  const [serviciosAnteriores, setServiciosAnteriores] = useState([]);
  const [formikKey, setFormikKey] = useState(0);

  const fetchData = async () => {
    try {
      setLoadingRespuestas(true);
      const response = await fetchEncuesta({
        encuestaId: 1,
        correo: user.usr_correo,
        museoId,
      });

      const data = response.data;
      setContestada(data.contestada);

      const valoresIniciales = {};

      if (data.respuestas && data.respuestas.length > 0) {
        data.respuestas.forEach((respuesta) => {
          valoresIniciales[`registrosfrmp${respuesta.preg_id}`] =
            respuesta.res_respuesta || "";
        });

        const anteriores = data.respuestas.map((respuesta) => ({
          preguntaId: respuesta.preg_id,
          respuesta: respuesta.res_respuesta || "",
        }));
        setRespuestasAnteriores(anteriores);
      } else {
        preguntas.forEach((pregunta) => {
          valoresIniciales[`registrosfrmp${pregunta.preg_id}`] = "";
        });
        setRespuestasAnteriores([]);
      }

      valoresIniciales["registrosfrmservicios"] = Array.isArray(data.servicios)
        ? data.servicios.map((servicio) => servicio.ser_id)
        : [];

      setServiciosAnteriores(valoresIniciales["registrosfrmservicios"]);
      setInitialValues({ ...valoresIniciales }); // Fuerza nueva referencia
    } catch (error) {
      console.error("Error fetching encuesta:", error);
    } finally {
      setLoadingRespuestas(false);
    }
  };

  useEffect(() => {
    if (!user?.usr_correo || !preguntas?.length) return;

    fetchData();
    setFormikKey((prevKey) => prevKey + 1); // Forzar re-render del Formik
  }, [user, museoId, preguntas]);

  const [yaVisito, setYaVisito] = useState(false);

  useEffect(() => {
    if (!user?.usr_correo || !museoId) return;

    const checkVisita = async () => {
      const visitado = await yaVisitoMuseo(user.usr_correo, museoId);
      setYaVisito(visitado.usuarioVisitoMuseo);
    };

    checkVisita();
  }, [user, museoId]);

  // Para la encuesta
  const handleEncuestaSubmit = async (values) => {
    if (!yaVisito) {
      ToastMessage({
        tipo: "error",
        mensaje: "No has visitado el museo",
        position: "top-right",
      });
      return;
    }

    const RESPUESTA_PREFIX = "registrosfrmp";
    const respuestas = [];
    const servicios = (values.registrosfrmservicios || [])
      .map((s) => parseInt(s, 10))
      .filter(Number.isInteger);

    // Extraer respuestas del formulario
    Object.entries(values).forEach(([key, value]) => {
      if (key.startsWith(RESPUESTA_PREFIX) && key !== "registrosfrmservicios") {
        const preguntaId = parseInt(key.replace(RESPUESTA_PREFIX, ""), 10);
        const respuesta = parseInt(value, 10);

        if (Number.isInteger(preguntaId) && Number.isInteger(respuesta)) {
          respuestas.push({ preguntaId, respuesta });
        }
      }
    });

    // Filtrar cambios en respuestas (solo respuestas diferentes a las anteriores)
    const respuestasCambiadas = respuestas.filter((r) => {
      const original = respuestasAnteriores.find(
        (o) => o.preguntaId === r.preguntaId
      );
      return !original || original.respuesta !== r.respuesta;
    });

    // Comparar servicios ignorando el orden
    const serviciosAnterioresOrdenados = [...serviciosAnteriores].sort(
      (a, b) => a - b
    );
    const serviciosActualesOrdenados = [...servicios].sort((a, b) => a - b);
    const serviciosIguales =
      serviciosAnterioresOrdenados.length ===
        serviciosActualesOrdenados.length &&
      serviciosAnterioresOrdenados.every(
        (val, idx) => val === serviciosActualesOrdenados[idx]
      );

    // Si ya contestó, solo enviar lo que cambió
    if (contestada) {
      if (respuestasCambiadas.length === 0 && serviciosIguales) {
        ToastMessage({
          tipo: "info",
          mensaje: "No se realizaron cambios",
          position: "top-right",
        });
        return;
      }

      const encuestaData = new FormData();
      encuestaData.append("respuestas", JSON.stringify(respuestasCambiadas));
      if (!serviciosIguales) {
        encuestaData.append("servicios", JSON.stringify(servicios));
      }

      try {
        await updateEncuesta(1, user.usr_correo, museoId, encuestaData);
        ToastMessage({
          tipo: "success",
          mensaje: "Se actualizaron tus respuestas",
          position: "top-right",
        });
        await fetchData(); // Refrescar datos después de actualizar
      } catch (error) {
        console.error("Error al actualizar encuesta:", error);
        ToastMessage({
          tipo: "error",
          mensaje: "Error al actualizar la encuesta",
        });
      }
    } else {
      // Primera vez: enviar todo
      const encuestaData = new FormData();
      encuestaData.append("respuestas", JSON.stringify(respuestas));
      encuestaData.append("servicios", JSON.stringify(servicios));

      try {
        await registrarEncuesta(1, user.usr_correo, museoId, encuestaData);
        ToastMessage({
          tipo: "success",
          mensaje: "Se guardaron tus respuestas",
          position: "top-right",
        });
        await fetchData(); // Refrescar datos después de registrar
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
  const [mes, setMes] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDayPickerSelect = (day) => {
    if (!day) {
      setSelectedDate(new Date());
    } else {
      setSelectedDate(day);
      setMes(day);
    }
  };
  // Fecha actual en UTC -6
  let today = new Date();
  today.setHours(today.getHours() - 6);

  const handleResenaSubmit = async (values) => {
    try {
      const resenaData = new FormData();

      const parsedDate = selectedDate.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      ToastMessage({
        tipo: "error",
        mensaje: "Error al enviar la reseña",
      });
    }
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
              regresfrmfecVis: "",
              regresfrmcomentario: "",
              regresfrmrating: 0,
              regresfrmfotos: [],
            }}
            onSubmit={async (values) => {
              handleResenaSubmit(values);
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
                <div className="registros-field-entrada">
                  <h2>Subir entrada/boleto</h2>
                  <ImageUploader
                    initialImages={values.regresfrmfotos || []}
                    onDelete={null}
                    name="entradaBoleto"
                    setFieldValue={setFieldValue}
                    label="Sube tu entrada o boleto"
                    maxFiles={1}
                  />
                </div>
                <div className="registros-field-fotos">
                  <h2>Subir fotos</h2>
                  <ImageUploader
                    initialImages={values.regresfrmfotos || []}
                    onDelete={null}
                    name="fotos"
                    setFieldValue={setFieldValue}
                    label="Sube tus fotos del museo"
                    maxFiles={5}
                  />
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
                key={formikKey}
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
                          Selecciona los servicios que viste que ofrece el museo
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
