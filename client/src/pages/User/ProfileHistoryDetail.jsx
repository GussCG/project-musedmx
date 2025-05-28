import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { es } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import Icons from "../../components/Other/IconProvider";
const { FaStar, FaTrash, IoIosCheckmarkCircle, LuImageUp, FaImage } = Icons;
import { useResena } from "../../hooks/Resena/useResena";
import { resenaEditSchema } from "../../constants/validationSchemas";
import ToastMessage from "../../components/Other/ToastMessage";
import { formatearFechaBDDATE } from "../../utils/formatearFechas";
import useResenaUsuario from "../../hooks/Resena/useResenaUsuario";

function ProfileHistoryDetail() {
  // Agarrar el id de la reseña a editar de la URL
  const { id } = useParams();
  const { fetchResenaByIdResena } = useResena();
  const [resena, setResena] = useState(null);
  const { editarResena } = useResenaUsuario();
  const navigate = useNavigate();

  // Obtenemos la reseña a editar con el id del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resenaData = await fetchResenaByIdResena(id);
        setResena(resenaData);
      } catch (error) {
        console.error("Error fetching resena:", error);
      }
    };
    fetchData();
  }, [id]);

  // Para la fecha de visita
  const [fechaVisita, setFechaVisita] = useState(new Date());

  // Para el comentario
  const [comentario, setComentario] = useState("");
  // Para las estrellas
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
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

    const droppedFiles = Array.from(e.dataTransfer.files);

    if (droppedFiles.length + values.regresFrmFotos.length > 5) {
      ToastMessage({
        tipo: "error",
        mensaje: "Máximo 5 fotos permitidas",
        position: "top-right",
      });
      return;
    }

    const filesWithPreview = addFilesWithPreview(droppedFiles);

    // Agregamos los nuevos archivos con preview al estado global
    setUploadedFiles((prev) => [...prev, ...filesWithPreview]);

    // Actualizamos el formulario con solo los archivos reales (sin la propiedad preview)
    setFieldValue("regresFrmFotos", [
      ...values.regresFrmFotos,
      ...droppedFiles,
    ]);

    droppedFiles.forEach((file) => {
      handleFileUpload(file);
    });
  };

  // Funcion para subir las imagenes
  const handleFileChange = ({ target }, setFieldValue, currentFiles = []) => {
    const files = Array.from(target.files);

    if (files.length + uploadedFiles.length > 5) {
      ToastMessage({
        tipo: "error",
        mensaje: "Máximo 5 fotos permitidas",
        position: "top-right",
      });
      return;
    }

    const filesWithPreview = addFilesWithPreview(files);

    setUploadedFiles((prev) => [...prev, ...filesWithPreview]);

    // Aquí actualizas el valor del formulario con los archivos actuales + nuevos
    setFieldValue("regresFrmFotos", [...currentFiles, ...files]);
  };

  // Funcion para eliminar las imagenes sean subidas o URLs del backend
  const handleFileDelete = (fileObj, setFieldValue, values) => {
    if (fileObj.file instanceof File) {
      // Es un archivo local (objeto con .file)
      // Liberar preview para evitar fugas de memoria
      URL.revokeObjectURL(fileObj.preview);

      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => file.name !== fileObj.name)
      );

      setFieldValue(
        "regresFrmFotos",
        values.regresFrmFotos.filter((file) => file.name !== fileObj.name)
      );
    } else if (fileObj.url) {
      // Es un archivo remoto (objeto con .url)
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => file.url !== fileObj.url)
      );

      setFieldValue(
        "regresFrmFotos",
        values.regresFrmFotos.filter((file) => file !== fileObj.url)
      );
    }
  };

  console.log(uploadedFiles);

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

  const addFilesWithPreview = (files) => {
    return files.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }));
  };

  // Para editar la reseña
  const handleEditarResena = async (values) => {
    try {
      const resenaData = new FormData();
      values.regresFrmCalif = parseInt(values.regresFrmCalif);

      let algoCambio = false;

      if (!(fechaVisita instanceof Date) || isNaN(fechaVisita)) {
        ToastMessage({
          tipo: "error",
          mensaje: "Fecha de visita inválida",
          position: "top-right",
        });
        return;
      }

      const parsedDate = fechaVisita.toISOString().split("T")[0];
      const fechaActualResena = new Date(resena.visitas_vi_fechahora)
        .toISOString()
        .split("T")[0];

      if (values.regresFrmCalif !== resena.res_calif_estrellas) {
        resenaData.append("res_calif_estrellas", values.regresFrmCalif);
        algoCambio = true;
      }
      if (values.regresFrmComentario !== resena.res_comentario) {
        resenaData.append("res_comentario", values.regresFrmComentario);
        algoCambio = true;
      }
      if (parsedDate !== fechaActualResena) {
        resenaData.append("visitas_vi_fechahora", parsedDate);
        algoCambio = true;
      }

      // Para las fotos mandamos todas las fotos que esten subidas
      const fotosSubidas = values.regresFrmFotos.filter(
        (file) => file instanceof File || typeof file === "string"
      );

      fotosSubidas.forEach((file) => {
        if (file instanceof File) {
          resenaData.append("fotos", file);
        } else {
          resenaData.append("fotos", file.trim());
        }
      });

      resenaData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      // resenaData.append("mus_id", resena.visitas_vi_mus_id);

      // const response = await editarResena(resena.res_id_res, resenaData);

      // if (response) {
      //   ToastMessage({
      //     tipo: "success",
      //     mensaje: "Reseña editada correctamente.",
      //     position: "top-right",
      //   });
      //   navigate("/Usuario/Historial", {
      //     state: { updated: true },
      //   });
      // } else {
      //   ToastMessage({
      //     tipo: "error",
      //     mensaje: "Error al editar la reseña.",
      //     position: "top-right",
      //   });
      // }
    } catch (error) {
      console.error("Error al editar la reseña:", error);
      ToastMessage({
        tipo: "error",
        mensaje: "Error al editar la reseña.",
        position: "top-right",
      });
    }
  };

  // Para llenar los campos con la información de la reseña
  useEffect(() => {
    if (!resena) return; // Si no hay reseña, salimos rápido

    // Validar la fecha para evitar errores
    const fecha = resena.visitas_vi_fechahora
      ? new Date(resena.visitas_vi_fechahora)
      : null;
    setFechaVisita(fecha);

    setRating(resena.res_calif_estrellas || 0);
    setComentario(resena.res_comentario || "");

    if (resena.fotos) {
      const fotosArray = Array.isArray(resena.fotos)
        ? resena.fotos
        : resena.fotos.split(",");

      const fotosConPreview = fotosArray.map((url, index) => ({
        name: `foto-${index}`,
        preview: url.trim(),
        url: url.trim(),
      }));

      setUploadedFiles(fotosConPreview);

      if (typeof setFieldValue === "function") {
        setFieldValue("regresFrmFotos", fotosArray);
      }
    } else {
      setUploadedFiles([]);
      if (typeof setFieldValue === "function") {
        setFieldValue("regresFrmFotos", []);
      }
    }
  }, [resena]);

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    let valid = true;

    if (!resena) return;

    const isDateValid =
      fechaVisita instanceof Date && !isNaN(fechaVisita.getTime());

    const isRatingValid = rating !== null && rating >= 1 && rating <= 5;

    valid = isDateValid && isRatingValid;
    setIsFormValid(valid);
  }, [fechaVisita, rating, resena]);

  useEffect(() => {
    // Limpia URLs temporales
    return () => {
      uploadedFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [uploadedFiles]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main id="editar-res-main">
        <h1>Editar Reseña</h1>
        <Formik
          enableReinitialize
          validationSchema={resenaEditSchema}
          initialValues={{
            regresFrmFecVis: resena?.visitas_vi_fechahora || "",
            regresFrmCalif: resena?.res_calif_estrellas || "",
            regresFrmComentario: resena?.res_comentario || "",
            regresFrmFotos: resena?.fotos
              ? Array.isArray(resena.fotos)
                ? resena.fotos
                : resena.fotos.split(",")
              : [],
          }}
          onSubmit={(values) => {
            handleEditarResena(values);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="editar-res-p2">
                <h2>Comentario</h2>
                <div className="registros-field">
                  <textarea
                    id="regres-frm-comentario"
                    name="regresFrmComentario"
                    value={values.regresFrmComentario}
                    onChange={(e) =>
                      setFieldValue("regresFrmComentario", e.target.value)
                    }
                    required
                  ></textarea>
                  <ErrorMessage name="regresFrmComentario" component="div" />
                </div>
              </div>
              <div className="editar-res-p1">
                <div className="registros-field-calendar">
                  <label>Fecha de la visita</label>
                  <DayPicker
                    hideNavigation
                    animate
                    locale={es}
                    timeZone="UTC"
                    captionLayout="dropdown"
                    fixedWeeks
                    month={fechaVisita}
                    onMonthChange={setFechaVisita}
                    autoFocus
                    mode="single"
                    selected={fechaVisita}
                    onSelect={(date) => {
                      setFechaVisita(date);
                      setFieldValue("regresFrmFecVis", date?.toISOString());
                    }}
                    footer={
                      fechaVisita
                        ? `Seleccionaste el ${formatearFechaBDDATE(
                            fechaVisita,
                            "dd-MM-yyyy"
                          )}`
                        : "Selecciona una fecha"
                    }
                    className="registros-calendar"
                    classNames={{ chevron: "calendar-chevron" }}
                  />
                </div>
                <div className="registros-field-calif">
                  <h2>Calificación</h2>
                  <div id="calificacion-menu">
                    <div className="stars-rate-container">
                      {[...Array(5)].map((star, index) => {
                        const currentRate = index + 1;
                        return (
                          <label className="stars-rate" key={currentRate}>
                            <Field
                              type="radio"
                              name="regresFrmCalif"
                              value={currentRate}
                              onClick={() => {
                                setRating(currentRate);
                                setFieldValue("regresFrmCalif", currentRate);
                              }}
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
                <ErrorMessage name="regresFrmCalif" component="div" />
              </div>

              <div className="editar-res-p3">
                <div className="registros-field-fotos">
                  <h2>Fotos de la Visita</h2>
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
                      name="regresFrmFotos"
                      ref={fileInputRef}
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          setFieldValue,
                          values.regresFrmFotos
                        )
                      }
                      hidden
                      accept="image/*"
                      multiple
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
                          </div>
                        </div>
                        <div className="icons-file">
                          <IoIosCheckmarkCircle />
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleFileDelete(file, setFieldValue, values)
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </li>
                    ))}
                  </section>
                  <ErrorMessage name="regresFrmFotos" component="div" />
                </div>
              </div>
              <Field
                className={`button ` + (isFormValid ? "" : "disabled")}
                id="registros-button"
                type="submit"
                value="Guardar los cambios"
                disabled={isFormValid ? false : true}
              />
            </Form>
          )}
        </Formik>
      </main>
    </motion.div>
  );
}

export default ProfileHistoryDetail;
