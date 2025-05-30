import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { formatearFechaBDDATE } from "../../utils/formatearFechas";
import { parseFecha } from "../../utils/parsearFecha";
import ToastMessage from "../../components/Other/ToastMessage";

const { FaPlus, CgClose, MdEdit, MdCheck } = Icons;

function MuseoForm({ mode }) {
  const { museoId } = useParams();
  const fileNameRef = useRef(null);
  const navigate = useNavigate();

  const {
    museo: museoEdit,
    loading,
    error,
    registrarMuseo,
    updateMuseo,
  } = useMuseo(mode === "edit" ? museoId : null);

  // TextArea
  const [comment, setComment] = useState("");

  // Lógica para el cambio de imagen de perfil
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

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
  const today = new Date();

  const handleDayPickerSelect = (date) => {
    if (!date) {
      setSelectedDate(new Date());
    } else {
      const fecha = parseFecha(date);
      setSelectedDate(fecha);
      setMes(fecha);
    }
  };

  useEffect(() => {
    if (mode === "edit" && museoEdit?.fecha_apertura) {
      const fecha = parseFecha(museoEdit.fecha_apertura);
      setSelectedDate(fecha);
      setMes(fecha);
    }
  }, [museoEdit, mode]);

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

  const handleRegistroMuseo = async (values) => {
    const formData = new FormData();
    let algoCambio = false;

    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
      ToastMessage({
        tipo: "error",
        mensaje: "Fecha inválida",
        position: "top-right",
      });
      return;
    }
    const parsedDate = selectedDate.toISOString().split("T")[0];

    let response;
    if (mode === "edit") {
      if (values.museofrmnombre !== museoEdit?.nombre) {
        formData.append("mus_nombre", values.museofrmnombre);
        algoCambio = true;
      }
      if (values.museofrmcalle !== museoEdit?.calle) {
        formData.append("mus_calle", values.museofrmcalle);
        algoCambio = true;
      }
      if (values.museofrmnumext !== museoEdit?.num_ext) {
        formData.append("mus_num_ext", values.museofrmnumext);
        algoCambio = true;
      }
      if (values.museofrmcolonia !== museoEdit?.colonia) {
        formData.append("mus_colonia", values.museofrmcolonia);
        algoCambio = true;
      }
      if (values.museofrmcp !== museoEdit?.cp) {
        formData.append("mus_cp", values.museofrmcp);
        algoCambio = true;
      }
      if (values.museofrmalcaldia !== museoEdit?.alcaldia) {
        formData.append("mus_alcaldia", values.museofrmalcaldia);
        algoCambio = true;
      }
      const fechaApActual = new Date(museoEdit?.fecha_apertura);
      if (fechaApActual !== parsedDate) {
        formData.append("mus_fec_ap", parsedDate);
        algoCambio = true;
      }
      if (values.museofrmdescripcion !== museoEdit?.descripcion) {
        formData.append("mus_descripcion", values.museofrmdescripcion);
        algoCambio = true;
      }
      if (values.museofrmtematicamuseo !== museoEdit?.tematica) {
        formData.append("mus_tematica", values.museofrmtematicamuseo);
        algoCambio = true;
      }
      if (values.museofrmglatitud !== museoEdit?.g_latitud) {
        formData.append("mus_g_latitud", values.museofrmglatitud);
        algoCambio = true;
      }
      if (values.museofrmglongitud !== museoEdit?.g_longitud) {
        formData.append("mus_g_longitud", values.museofrmglongitud);
        algoCambio = true;
      }
      // Verifica si la imagen es un archivo File y no un Blob
      if (values.museofrmfoto) {
        if (values.museofrmfoto instanceof File) {
          formData.append("mus_foto", values.museofrmfoto);
          algoCambio = true;
        } else {
          // formData.append("mus_foto", values.museofrmfoto);
        }
      }

      const redesFinales = [
        ...redesLocales.map((r) => ({
          id: r.mhrs_cve_rs || r.id,
          link: r.mhrs_link || r.link,
        })),
        ...redesTemporal.map((r) => ({
          id: r.id,
          link: r.link,
        })),
      ];

      // Opcional: filtrar duplicados por id o link, por si acaso
      const redesUnicas = redesFinales.filter(
        (red, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.id === red.id &&
              t.link.trim().toLowerCase() === red.link.trim().toLowerCase()
          )
      );

      formData.append(
        "redes_sociales",
        JSON.stringify(
          redesUnicas.map((red) => ({
            id: red.id,
            link: red.link.trim(),
          }))
        )
      );

      formData.forEach((value, key) => {
        console.log(key, value);
      });

      try {
        response = await updateMuseo(museoId, formData);
        ToastMessage({
          tipo: "success",
          mensaje: "Museo actualizado correctamente",
          position: "top-right",
        });

        navigate(`/Museos/${response.museo.mus_id}`);
        setTimeout(() => {
          window.location.reload();
        }, 750); // espera medio segundo para recargar
      } catch (error) {
        console.error(error);
        toast.error("Error al actualizar museo", { transition: Bounce });
      }
    } else if (mode === "create") {
      formData.append("mus_nombre", values.museofrmnombre);
      formData.append("mus_calle", values.museofrmcalle);
      formData.append("mus_num_ext", values.museofrmnumext);
      formData.append("mus_colonia", values.museofrmcolonia);
      formData.append("mus_cp", values.museofrmcp);
      formData.append("mus_alcaldia", values.museofrmalcaldia);
      formData.append("mus_fec_ap", parsedDate);
      formData.append("mus_descripcion", values.museofrmdescripcion);
      formData.append("mus_tematica", values.museofrmtematicamuseo);
      formData.append("mus_g_latitud", values.museofrmglatitud);
      formData.append("mus_g_longitud", values.museofrmglongitud);
      // Asegúrate de que la imagen se añade si es nueva en el caso de creación
      if (!values.museofrmfoto && image instanceof File) {
        formData.append("mus_foto", image); // 'image' contiene el placeholder convertido
      } else if (values.museofrmfoto) {
        formData.append("mus_foto", values.museofrmfoto);
      }
      // Horarios
      formData.append("horarios_precios", JSON.stringify([]));
      // Galería
      formData.append("galeria", JSON.stringify([]));

      // Redes sociales (mismo filtro)
      const redesFiltradas = redesTemporal.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.id === item.id ||
              t.link.trim().toLowerCase() === item.link.trim().toLowerCase()
          )
      );

      // Agrega redes filtradas al formData
      formData.append(
        "redes_sociales",
        JSON.stringify(
          redesFiltradas.map((red) => ({
            id: red.id,
            link: red.link.trim(),
          }))
        )
      );

      try {
        response = await registrarMuseo(formData);
        ToastMessage({
          tipo: "success",
          mensaje: "Museo registrado correctamente",
          position: "top-right",
        });
        navigate("/museos");
      } catch (error) {
        console.error(error);
        ToastMessage({
          tipo: "error",
          mensaje: "Error al registrar museo",
          position: "top-right",
        });
      }
    }

    console.log("Response:", response);

    if (response.museo.success) {
      if (mode === "edit") {
        navigate(`/Museos/${response.museo.mus_id}`);
      } else {
        // A editar los horarios
        navigate(`/Admin/Museo/EditarHorario/${response.museo.mus_id}/`);
      }
    } else {
      ToastMessage({
        tipo: "error",
        mensaje: "Error al registrar museo",
        position: "top-right",
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
                museofrmfechapertura: museoEdit?.fecha_apertura || "",
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
                console.log("Valores del formulario:", values);
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
                        <label>Fecha de Apertura</label>
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
                                  selectedDate
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
                                        <>
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
                                          {redCatalogo?.validador &&
                                            red.link &&
                                            !redCatalogo.validador(
                                              red.link
                                            ) && (
                                              <ErrorCampo
                                                mensaje={`Link inválido para ${red.nombre}`}
                                              />
                                            )}
                                        </>
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
                                const redCatalogo = REDES_SOCIALES[red.id];
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
                                        <>
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
                                          {redCatalogo?.validador &&
                                            red.link &&
                                            !redCatalogo.validador(
                                              red.link
                                            ) && (
                                              <ErrorCampo
                                                mensaje={`Link inválido para ${red.nombre}`}
                                              />
                                            )}
                                        </>
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
                        {imagePreview ? (
                          <div className="foto-preview">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              id="foto-preview"
                            />
                          </div>
                        ) : (
                          <div className="foto-preview">
                            <p>No se ha seleccionado ninguna imagen</p>
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
