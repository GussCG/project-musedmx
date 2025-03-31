import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";

import { format } from "date-fns";
import { es, se } from "react-day-picker/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

// Iconos
import Icons from "../../components/IconProvider";
const { FaStar, FaTrash, IoIosCheckmarkCircle, LuImageUp, FaImage } = Icons;

function ProfileHistoryDetail() {
  // Agarrar el id de la reseña a editar de la URL
  const { id } = useParams();

  // Obtenemos la reseña a editar con el id del backend
  useEffect(() => {
    // Aquí se hace la petición al backend para obtener la reseña a editar con axios y el id
    // axios.get(`/resena/${id}`)
    //   .then((res) => {
    //     const resena = res.data;
    // }).catch((err) => {
    //     console.log(err);
    // });
  }, [id]);

  // Datos de la reseña de prueba
  const resena = {
    fechaVisita: "2021-09-01",
    calificacion: 4,
    comentario: "Excelente lugar, muy recomendado",
    fotos: [
      { name: "foto1.jpg", size: "1.2 MB" },
      { name: "foto2.jpg", size: "1.5 MB" },
    ],
  };

  // Validación del formulario
  const validationSchema = Yup.object({
    regresFrmFecVis: Yup.date().required("La fecha de visita es requerida"),
    regresFrmCalif: Yup.number()
      .min(1, "La calificación mínima es 1")
      .max(5, "La calificación máxima es 5")
      .required("La calificación es requerida"),
    regresFrmComentario: Yup.string().required("El comentario es requerido"),
    // Máximo de 5 fotos
    regresFrmFotos: Yup.array().max(5, "Máximo de 5 fotos").nullable(),
  });

  // Para la fecha de visita
  const [fechaVisita, setFechaVisita] = useState(new Date());
  const handleDayPickerSelect = (date) => {
    if (!date) {
      setFechaVisita(new Date());
    } else {
      setFechaVisita(date);
    }
  };

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
    const files = e.dataTransfer.files;
    const uploadedFiles = Array.from(files);

    if (uploadedFiles.length + values.regresFrmFotos.length > 5) {
      toast.error(`Máximo 5 fotos`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    setFieldValue("regresFrmFotos", [
      ...values.regresFrmFotos,
      ...uploadedFiles,
    ]);

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
      setFieldValue("regresFrmFotos", [...uploadedFiles, file]);
    } else {
      toast.error(`Máximo 5 fotos`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  // Funcion para eliminar las imagenes
  const handleFileDelete = (name, setFieldValue, values) => {
    const updatedFiles = values.regresFrmFotos.filter(
      (file) => file.name !== name
    );
    const updatedUploadedFiles = uploadedFiles.filter(
      (file) => file.name !== name
    );
    setFieldValue("regresFrmFotos", updatedFiles);
    setUploadedFiles(updatedUploadedFiles);
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

  // Para editar la reseña
  const handleEditarResena = (values) => {
    try {
      // Preparar los datos para enviarlos al backend
      const resenaData = new FormData();

      // Pasar la calificación a int
      values.regresFrmCalif = parseInt(values.regresFrmCalif);

      // Agregar los datos de la reseña
      resenaData.append("fechaVisita", fechaVisita);
      resenaData.append("calificacion", values.regresFrmCalif);
      resenaData.append("comentario", values.regresFrmComentario);

      // Agregar las fotos
      values.regresFrmFotos.forEach((file) => {
        resenaData.append("fotos", file);
      });

      // Aquí se hace la petición al backend para editar la reseña con axios y el id
      // axios.put(`/resena/${id}`, resenaData)
      //   .then((res) => {
      //     console.log(res.data);
      // }).catch((err) => {
      //     console.log(err);
      // });

      resenaData.forEach((value, key) => {
        console.log(key, value);
      });

      toast.success(`Se han registrado sus cambios correctamente`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      toast.warn(`Un moderador revisará los cambios`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Para llenar los campos con la información de la reseña
  useEffect(() => {
    // Llenar los campos con la información de la reseña
    if (resena) {
      setFechaVisita(resena.fechaVisita);
      setRating(resena.calificacion);
      setComentario(resena.comentario);
      setUploadedFiles(resena.fotos);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {" "}
      <main id="editar-res-main">
        <h1>Editar Reseña</h1>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            regresFrmFecVis: resena?.fechaVisita || "",
            regresFrmCalif: resena?.calificacion || "",
            regresFrmComentario: resena?.comentario || "",
            regresFrmFotos: resena?.fotos || [],
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
                    onSelect={handleDayPickerSelect}
                    footer={
                      fechaVisita
                        ? `Seleccionaste el ${format(
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
                            onClick={() =>
                              handleFileDelete(file.name, setFieldValue, values)
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
                className="button"
                id="registros-button"
                type="submit"
                value="Guardar los cambios"
              />
            </Form>
          )}
        </Formik>
      </main>
    </motion.div>
  );
}

export default ProfileHistoryDetail;
