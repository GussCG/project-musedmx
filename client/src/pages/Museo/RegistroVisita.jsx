import { useState, useEffect, useRef } from "react";
import Icons from "../../components/Other/IconProvider";
const { FaStar, FaTrash, IoIosCheckmarkCircle, LuImageUp, FaImage } = Icons;
import { Formik, Form, Field } from "formik";
import { format } from "date-fns";
import { es } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { motion } from "framer-motion";

// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const iconosServicios = {
  Tienda: Icons.tiendaIcon,
  WiFi: Icons.wifiIcon,
  Guardarropa: Icons.guardarropaIcon,
  Biblioteca: Icons.bilbiotecaIcon,
  Estacionamiento: Icons.estacionamientoIcon,
  VisitaGuiada: Icons.visitaGuiadaIcon,
  ServicioMédico: Icons.medicoIcon,
  WC: Icons.banioIcon,
  SilladeRuedas: Icons.sillaRuedasIcon,
  Cafeteria: Icons.cafeteriaIcon,
  Elevador: Icons.elevadorIcon,
  Braille: Icons.brailleIcon,
  LenguajedeSenas: Icons.lenguajeDeSenasIcon,
};

function RegistroVisita() {
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
      toast.error(`Máximo 5 fotos`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
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
      toast.error(`Máximo 5 fotos`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
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

  // Para la encuesta
  const handleEncuestaSubmit = (values) => {
    if (encuestaContestada) {
      // Actualizamos la encuesta
      console.log(values);
      toast.success(`Se actualizaron tus respuestas`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      // Guardamos la encuesta
      console.log(values);
      toast.success(`Se guardaron tus respuestas`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Variables para guardar las respuestas de la encuesta
  const [preguntas, setPreguntas] = useState({
    registrosfrmp1: "",
    registrosfrmp2: "",
    registrosfrmp3: "",
    registrosfrmp4: "",
    registrosfrmp5: "",
  });
  const [servicios, setServicios] = useState([]);

  // Variable que tomamos del backend para saber si la encuesta ya fue contestada o no
  const [encuestaContestada, setEncuestaContestada] = useState(false);
  const [respuestasGuardadas, setRespuestasGuardadas] = useState(null);

  // Hacemos una petición al backend para saber si la encuesta ya fue contestada
  useEffect(() => {
    // Hacemos la petición al backend con axios
    setEncuestaContestada(true);
    // axios.get("/encuestaContestada").then((res) => {
    //   setEncuestaContestada(res.data.encuestaContestada);
    // });
  }, []);

  // Si la encuesta ya fue contestada, traemos las respuestas guardadas
  useEffect(() => {
    if (encuestaContestada) {
      // Hacemos la petición al backend con axios
      setRespuestasGuardadas({
        registrosfrmp1: "5",
        registrosfrmp2: "1",
        registrosfrmp3: "1",
        registrosfrmp4: "4",
        registrosfrmp5: "2",
        registrosfrmservicios: [
          "Tienda",
          "WiFi",
          "Guardarropa",
          "Biblioteca",
          "Estacionamiento",
          "Braille",
        ],
      });
      // axios.get("/respuestasGuardadas").then((res) => {
      //   setRespuestasGuardadas(res.data.respuestasGuardadas);
      // });
    }
  }, [encuestaContestada]);

  useEffect(() => {
    if (respuestasGuardadas) {
      console.log(respuestasGuardadas);
      setPreguntas({
        registrosfrmp1: respuestasGuardadas?.registrosfrmp1 || "",
        registrosfrmp2: respuestasGuardadas?.registrosfrmp2 || "",
        registrosfrmp3: respuestasGuardadas?.registrosfrmp3 || "",
        registrosfrmp4: respuestasGuardadas?.registrosfrmp4 || "",
        registrosfrmp5: respuestasGuardadas?.registrosfrmp5 || "",
      });
      setServicios(respuestasGuardadas.registrosfrmservicios || []);
    }
  }, [respuestasGuardadas]);

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
              regresfrmrating: "",
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
                {/* <div className="registros-field">
              <Field
                type="date"
                id="regres-frm-fecVis"
                name="regresfrmfecVis"
                placeholder="Fecha de Visita"
                required
              />
              <label htmlFor="regres-frm-fecVis" className="frm-label">
                Fecha de Visita
              </label>
            </div> */}
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
          <h1>Encuesta</h1>
          <Formik
            initialValues={{
              registrosfrmp1: preguntas.registrosfrmp1 || "",
              registrosfrmp2: preguntas.registrosfrmp2 || "",
              registrosfrmp3: preguntas.registrosfrmp3 || "",
              registrosfrmp4: preguntas.registrosfrmp4 || "",
              registrosfrmp5: preguntas.registrosfrmp5 || "",
              registrosfrmservicios: servicios || [],
            }}
            enableReinitialize
            onSubmit={(values) => {
              handleEncuestaSubmit(values);
            }}
          >
            {({ setFieldValue, values }) => (
              <Form id="registros-encuesta-form">
                <p id="encuesta-contestada">
                  {encuestaContestada
                    ? "Ya has contestado la encuesta. Puedes hacer cambios en tus respuestas"
                    : "Responde la encuesta para ayudar a otros visitantes"}
                </p>
                <div className="registros-field">
                  <Field
                    as="select"
                    name="registrosfrmp1"
                    className="registros-frm-select"
                    value={values.registrosfrmp1}
                    onChange={(e) =>
                      setFieldValue("registrosfrmp1", e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      ¿Qué tan interesante es el museo?
                    </option>
                    <option value="5">Muy interesante</option>
                    <option value="4">Interesante</option>
                    <option value="3">Medio interesante</option>
                    <option value="2">Aburrido</option>
                    <option value="1">Muy aburrido</option>
                  </Field>
                </div>
                <div className="registros-field">
                  <Field
                    as="select"
                    name="registrosfrmp2"
                    className="registros-frm-select"
                    value={values.registrosfrmp2}
                    onChange={(e) =>
                      setFieldValue("registrosfrmp2", e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      ¿Cómo estaba el museo?
                    </option>
                    <option value="1">Limpio</option>
                    <option value="0">Sucio</option>
                  </Field>
                </div>
                <div className="registros-field">
                  <Field
                    as="select"
                    name="registrosfrmp3"
                    className="registros-frm-select"
                    value={values.registrosfrmp3}
                    onChange={(e) =>
                      setFieldValue("registrosfrmp3", e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      ¿Es fácil de entender el museo?
                    </option>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </Field>
                </div>
                <div className="registros-field">
                  <Field
                    as="select"
                    name="registrosfrmp4"
                    className="registros-frm-select"
                    value={values.registrosfrmp4}
                    onChange={(e) =>
                      setFieldValue("registrosfrmp4", e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      ¿Qué tan costosa fue la entrada al museo?
                    </option>
                    <option value="4">Muy costosa</option>
                    <option value="3">Costosa</option>
                    <option value="2">Barata</option>
                    <option value="1">Gratis</option>
                  </Field>
                </div>
                <div className="registros-field">
                  <Field
                    as="select"
                    name="registrosfrmp5"
                    className="registros-frm-select"
                    value={values.registrosfrmp5}
                    onChange={(e) =>
                      setFieldValue("registrosfrmp5", e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      ¿Para qué público está dirigido?
                    </option>
                    <option value="3">Niños</option>
                    <option value="2">Toda la familia</option>
                    <option value="1">Solo Adultos</option>
                  </Field>
                </div>
                <div className="registros-chks">
                  <fieldset>
                    <legend>
                      Selecciona los servicios con los que cuenta el museo
                    </legend>
                    <div id="servicios-chks">
                      {[
                        "Tienda",
                        "WiFi",
                        "Guardarropa",
                        "Biblioteca",
                        "Estacionamiento",
                        "VisitaGuiada",
                        "ServicioMédico",
                        "WC",
                        "SilladeRuedas",
                        "Cafeteria",
                        "Elevador",
                        "Braille",
                        "LenguajedeSenas",
                      ].map((servicio) => (
                        <label
                          title={servicio}
                          className="registros-chk-serv"
                          key={servicio}
                        >
                          <Field
                            type="checkbox"
                            name="registrosfrmservicios"
                            value={servicio}
                            checked={values.registrosfrmservicios.includes(
                              servicio
                            )}
                            onChange={(e) => {
                              const selectedServices = [
                                ...values.registrosfrmservicios,
                              ];
                              if (e.target.checked) {
                                selectedServices.push(servicio);
                              } else {
                                const index =
                                  selectedServices.indexOf(servicio);
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
                              src={iconosServicios[servicio]}
                              alt={servicio}
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
                    encuestaContestada
                      ? "Actualizar Encuesta"
                      : "Enviar Encuesta"
                  }
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
