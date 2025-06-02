import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import useServicio from "../../hooks/Encuesta/useServicio";
import usePreguntas from "../../hooks/Encuesta/usePreguntas";
import { useVisitas } from "../../hooks/Visitas/useVisitas";
import { useAuth } from "../../context/AuthProvider";
import useEncuesta from "../../hooks/Encuesta/useEncuesta";
import { PREGUNTAS_RESPUESTAS, SERVICIOS } from "../../constants/catalog";
import ToastMessage from "../../components/Other/ToastMessage";
import { Formik, Form, Field } from "formik";

function MuseoEncuesta() {
  const { fetchServicios } = useServicio();
  const { museoId } = useParams();
  const { user } = useAuth();
  const navigation = useNavigate();

  const { fetchPreguntas } = usePreguntas();
  const { yaVisitoMuseo } = useVisitas();
  const { fetchEncuesta, registrarEncuesta, updateEncuesta } = useEncuesta();

  const [servicios, setServicios] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [respuestasAnteriores, setRespuestasAnteriores] = useState([]);
  const [serviciosAnteriores, setServiciosAnteriores] = useState([]);
  const [contestada, setContestada] = useState(false);
  const [yaVisito, setYaVisito] = useState(false);

  useEffect(() => {
    fetchServicios().then((data) => setServicios(data.servicios || []));
  }, []);

  useEffect(() => {
    if (!user || !museoId) return;
    yaVisitoMuseo(user.usr_correo, museoId).then((res) => {
      if (res.usuarioVisitoMuseo !== yaVisito) {
        setYaVisito(res.usuarioVisitoMuseo);
      }
    });
  }, [user, museoId]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const preguntasData = await fetchPreguntas({ encuestaId: 1 });
        const response = await fetchEncuesta({
          encuestaId: 1,
          correo: user.usr_correo,
          museoId,
        });

        if (!isMounted) return;

        setPreguntas(preguntasData);
        const data = response.data;

        setContestada(data.contestada);
        const valoresIniciales = {};

        if (data.respuestas?.length) {
          const anteriores = data.respuestas.map((r) => ({
            preguntaId: r.preg_id,
            respuesta: r.res_respuesta || "",
          }));
          setRespuestasAnteriores(anteriores);
          data.respuestas.forEach((r) => {
            valoresIniciales[`registrosfrmp${r.preg_id}`] =
              r.res_respuesta || "";
          });
        } else {
          preguntasData.forEach((p) => {
            valoresIniciales[`registrosfrmp${p.preg_id}`] = "";
          });
        }

        const serviciosSeleccionados =
          data.servicios?.map((s) => s.ser_id) || [];
        valoresIniciales["registrosfrmservicios"] = serviciosSeleccionados;
        setServiciosAnteriores(serviciosSeleccionados);
        setInitialValues(valoresIniciales);
      } catch (error) {
        console.error("Error fetching encuesta:", error);
        ToastMessage({
          tipo: "error",
          mensaje: "Error al cargar la encuesta",
        });
      }
    };

    if (user?.usr_correo && museoId) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [user, museoId]);

  const handleEncuestaSubmit = async (values, { setSubmitting }) => {
    try {
      if (!yaVisito) {
        ToastMessage({
          tipo: "error",
          mensaje: "Debes visitar el museo antes de responder la encuesta",
          position: "top-right",
        });
        return;
      }

      // Validación de datos antes de enviar
      const respuestasValidas = Object.entries(values)
        .filter(
          ([key]) =>
            key.startsWith("registrosfrmp") && key !== "registrosfrmservicios"
        )
        .map(([key, value]) => ({
          preguntaId: parseInt(key.replace("registrosfrmp", ""), 10),
          respuesta: parseInt(value, 10),
        }))
        .filter((item) => !isNaN(item.preguntaId) && !isNaN(item.respuesta));

      const serviciosValidos = (values.registrosfrmservicios || [])
        .map(Number)
        .filter((id) => !isNaN(id) && servicios.some((s) => s.ser_id === id));

      if (respuestasValidas.length !== preguntas.length) {
        ToastMessage({
          tipo: "error",
          mensaje: "Debes responder todas las preguntas",
          position: "top-right",
        });
        return;
      }

      const encuestaData = {
        respuestas: respuestasValidas,
        servicios: serviciosValidos,
      };

      const operation = contestada ? updateEncuesta : registrarEncuesta;
      const successMessage = contestada
        ? "Encuesta actualizada correctamente"
        : "Encuesta registrada exitosamente";

      await operation(1, user.usr_correo, museoId, encuestaData);

      ToastMessage({
        tipo: "success",
        mensaje: successMessage,
      });

      navigation(`/Museos/${museoId}`);
    } catch (error) {
      console.error("Error al enviar encuesta:", error);
      ToastMessage({
        tipo: "error",
        mensaje: "Error al procesar la encuesta. Por favor intente nuevamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      setInitialValues({});
      setRespuestasAnteriores([]);
      setServiciosAnteriores([]);
      setContestada(false);
      setPreguntas([]);
    };
  }, [museoId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="registros-encuesta-main">
        <div id="registros-encuesta">
          {Object.keys(initialValues).length > 0 && (
            <>
              <h1>Encuesta</h1>
              <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleEncuestaSubmit}
              >
                {({ setFieldValue, values }) => (
                  <Form id="registros-encuesta-form">
                    <p id="encuesta-contestada">
                      {contestada
                        ? "Ya has contestado la encuesta. Puedes hacer cambios en tus respuestas"
                        : "Responde la encuesta para ayudar a otros visitantes"}
                    </p>
                    {preguntas.map((p) => (
                      <div className="registros-field" key={p.preg_id}>
                        <Field
                          as="select"
                          name={`registrosfrmp${p.preg_id}`}
                          className="registros-frm-select"
                          required
                        >
                          <option value="" disabled>
                            {p.pregunta}
                          </option>
                          {PREGUNTAS_RESPUESTAS[p.preg_id]?.respuestas.map(
                            (r) => (
                              <option key={r.valor} value={r.valor}>
                                {r.respuesta}
                              </option>
                            )
                          )}
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
                              key={servicio.ser_id}
                              className="registros-chk-serv"
                              title={servicio.ser_nombre}
                            >
                              <Field
                                type="checkbox"
                                name="registrosfrmservicios"
                                value={servicio.ser_id}
                                checked={(
                                  values.registrosfrmservicios || []
                                ).includes(servicio.ser_id)}
                                onChange={(e) => {
                                  const current = [
                                    ...values.registrosfrmservicios,
                                  ];
                                  const updated = e.target.checked
                                    ? [...current, servicio.ser_id]
                                    : current.filter(
                                        (id) => id !== servicio.ser_id
                                      );
                                  setFieldValue(
                                    "registrosfrmservicios",
                                    updated
                                  );
                                }}
                              />
                              <span>
                                <img
                                  src={SERVICIOS[servicio.ser_id]?.icon}
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

export default MuseoEncuesta;
