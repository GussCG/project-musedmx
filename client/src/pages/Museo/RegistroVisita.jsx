import { useState, useEffect, useRef } from "react";
import Icons from "../../components/Other/IconProvider";
const { FaStar } = Icons;
import { Formik, Form, Field } from "formik";
import { es } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { motion } from "framer-motion";
import ToastMessage from "../../components/Other/ToastMessage";
import { formatearFechaBDDATE } from "../../utils/formatearFechas";
import ImageUploader from "../../components/Other/ImageUploader";
import useResenaUsuario from "../../hooks/Resena/useResenaUsuario";
import { useParams, useNavigate } from "react-router";

function RegistroVisita() {
  const { museoId } = useParams();
  // Variables para la reseña
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const navigate = useNavigate();

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

  const { registrarResena } = useResenaUsuario();

  const handleResenaSubmit = async (values) => {
    try {
      const resenaData = new FormData();

      const parsedDate = selectedDate.toISOString().split("T")[0];

      resenaData.append("regresfrmfecVis", parsedDate);
      resenaData.append("regresfrmcomentario", values.regresfrmcomentario);
      resenaData.append("regresfrmrating", values.regresfrmrating || 0);

      const entrada = values.entradaBoleto
        .filter((file) => file?.fileObject instanceof File)
        .map((file) => file.fileObject);

      entrada.forEach((file) => resenaData.append("entradaBoleto", file));

      const fotos = values.fotos
        .filter((file) => file?.fileObject instanceof File)
        .map((file) => file.fileObject);

      fotos.forEach((file) => resenaData.append("fotos", file));

      resenaData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const response = await registrarResena(museoId, resenaData);

      if (response.success) {
        ToastMessage({
          tipo: "success",
          mensaje: "Reseña enviada correctamente y en espera de aprobación",
          position: "top-right",
        });
        ToastMessage({
          tipo: "info",
          mensaje: "Ahora puedes responder la encuesta si no lo has hecho",
          position: "top-right",
        });
        navigate("/Usuario/Historial");
      } else {
        ToastMessage({
          tipo: "error",
          mensaje: response.message || "Error al enviar la reseña",
          position: "top-right",
        });
      }
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
              fotos: [],
              entradaBoleto: [],
            }}
            onSubmit={async (values) => {
              console.log("Valores del formulario:", values);
              handleResenaSubmit(values);
            }}
          >
            {({ setFieldValue, values }) => (
              <Form id="registros-resena-form">
                <div className="registros-resena">
                  <div className="registros-resena-1">
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
                    <div className="registros-field">
                      <h2>Escribe un comentario sobre tu visita</h2>
                      <Field
                        as="textarea"
                        id="regres-frm-comentario"
                        name="regresfrmcomentario"
                        placeholder="Aquí puedes escribir un comentario sobre tu visita"
                        required
                      ></Field>
                    </div>
                    <div className="registros-field-calendar">
                      <h2>Fecha de la visita</h2>
                      <DayPicker
                        animate
                        hideNavigation
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
                  </div>

                  <div id="registros-linea-encuesta" />

                  <div className="registros-resena-2">
                    <div className="registros-field-fotos">
                      <h2>Subir entrada/boleto</h2>
                      <ImageUploader
                        initialImages={values.entradaBoleto || []}
                        onDelete={null}
                        name="entradaBoleto"
                        setFieldValue={(name, value) => {
                          if (
                            JSON.stringify(values[name]) !==
                            JSON.stringify(value)
                          ) {
                            setFieldValue(name, value);
                          }
                        }}
                        label="Sube tu entrada o boleto"
                        maxFiles={1}
                      />
                    </div>
                    <div className="registros-field-fotos">
                      <h2>Subir fotos</h2>
                      <ImageUploader
                        initialImages={values.fotos || []}
                        onDelete={null}
                        name="fotos"
                        setFieldValue={(name, value) => {
                          if (
                            JSON.stringify(values[name]) !==
                            JSON.stringify(value)
                          ) {
                            setFieldValue(name, value);
                          }
                        }}
                        label="Sube tus fotos del museo"
                        maxFiles={5}
                      />
                    </div>
                  </div>
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
      </main>
    </motion.div>
  );
}

export default RegistroVisita;
