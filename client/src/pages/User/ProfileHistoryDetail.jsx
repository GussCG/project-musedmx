import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import Icons from "../../components/Other/IconProvider";
import { useResena } from "../../hooks/Resena/useResena";
import { resenaEditSchema } from "../../constants/validationSchemas";
import ToastMessage from "../../components/Other/ToastMessage";
import useResenaUsuario from "../../hooks/Resena/useResenaUsuario";
import ImageUploader from "../../components/Other/ImageUploader";

const { FaStar } = Icons;

function ProfileHistoryDetail() {
  const { id } = useParams();
  const { fetchResenaByIdResena } = useResena();
  const [resena, setResena] = useState(null);
  const { editarResena, eliminarFotoResena } = useResenaUsuario();
  const navigate = useNavigate();

  // Estados para calificación
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [imagenEliminada, setImagenEliminada] = useState(false);

  // Obtener reseña al cargar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resenaData = await fetchResenaByIdResena(id);
        setResena(resenaData);
        setRating(resenaData?.res_calif_estrellas || null);
      } catch (error) {
        console.error("Error fetching resena:", error);
      }
    };
    fetchData();
  }, [id]);

  // Validar formulario
  useEffect(() => {
    setIsFormValid(rating !== null && rating >= 1 && rating <= 5);
  }, [rating]);

  const getFormattedImages = useCallback(() => {
    return (
      resena?.fotos?.map((foto) => ({
        id: foto.id,
        name: foto.foto,
        size: foto.size || "",
        url: foto.foto,
        fileObject: null,
      })) || []
    );
  }, [resena]);

  const initialImages = useMemo(
    () => getFormattedImages(),
    [getFormattedImages]
  );

  const initialFormikValues = useMemo(() => {
    if (!resena)
      return {
        regresFrmCalif: "",
        regresFrmComentario: "",
        regresFrmFotos: [],
      };

    return {
      regresFrmCalif: resena.res_calif_estrellas || "",
      regresFrmComentario: resena.res_comentario || "",
      regresFrmFotos: getFormattedImages(),
    };
  }, [resena, getFormattedImages]);

  // Función para editar reseña
  const handleEditarResena = async (values) => {
    try {
      const resenaData = new FormData();
      let algoCambio = false;

      // Verificar cambios en calificación
      if (parseInt(values.regresFrmCalif) !== resena.res_calif_estrellas) {
        resenaData.append("res_calif_estrellas", values.regresFrmCalif);
        algoCambio = true;
      }

      // Verificar cambios en comentario
      if (values.regresFrmComentario !== resena.res_comentario) {
        resenaData.append("res_comentario", values.regresFrmComentario);
        algoCambio = true;
      }

      const archivosNuevos = values.regresFrmFotos
        .filter((file) => file?.fileObject instanceof File)
        .map((file) => file.fileObject);

      archivosNuevos.forEach((file) => resenaData.append("fotos", file));
      resenaData.append("mus_id", resena.visitas_vi_mus_id);

      if (algoCambio || archivosNuevos.length > 0) {
        const response = await editarResena(resena.res_id_res, resenaData);
        if (response.success) {
          ToastMessage({
            tipo: "success",
            mensaje: "Reseña editada correctamente",
            position: "top-right",
          });
          navigate("/Usuario/Historial");
        }
      } else {
        ToastMessage({
          tipo: "info",
          mensaje: "No se detectaron cambios para guardar",
          position: "top-right",
        });
      }
    } catch (error) {
      ToastMessage({
        tipo: "error",
        mensaje: "Error al editar la reseña",
        position: "top-right",
      });
    } finally {
      setImagenEliminada(false);
    }
  };

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
          initialValues={initialFormikValues}
          onSubmit={handleEditarResena}
        >
          {({ setFieldValue, values }) => (
            <Form>
              {/* Sección Calificación */}
              <div className="editar-res-p1">
                <div className="registros-field-calif">
                  <h2>Calificación</h2>
                  <div className="stars-rate-container">
                    {[...Array(5)].map((_, index) => {
                      const currentRate = index + 1;
                      return (
                        <label key={currentRate} className="stars-rate">
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
                            size={30}
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
                  <ErrorMessage name="regresFrmCalif" component="div" />
                </div>
              </div>

              {/* Sección Comentario */}
              <div className="editar-res-p2">
                <h2>Comentario</h2>
                <div className="registros-field">
                  <Field
                    as="textarea"
                    id="regres-frm-comentario"
                    name="regresFrmComentario"
                    required
                  />
                  <ErrorMessage name="regresFrmComentario" component="div" />
                </div>
              </div>

              {/* Sección Imágenes con ImageUploader */}
              <div className="editar-res-p3">
                <div className="registros-field-fotos">
                  <h2>Fotos de la Visita</h2>
                  <ImageUploader
                    initialImages={initialImages}
                    onUpload={(formData) =>
                      editarResena(resena.res_id_res, formData)
                    }
                    onDelete={async (galFotoId) => {
                      setImagenEliminada(true);
                      return await eliminarFotoResena(
                        resena.res_id_res,
                        galFotoId
                      );
                    }}
                    maxFiles={5}
                    navigate={navigate}
                    setFieldValue={(name, value) => {
                      if (
                        JSON.stringify(values[name]) !== JSON.stringify(value)
                      ) {
                        setFieldValue(name, value);
                      }
                    }}
                    name="regresFrmFotos"
                  />
                  <ErrorMessage name="regresFrmFotos" component="div" />
                </div>
              </div>

              {/* Botón de enviar */}
              <button
                type="submit"
                className={`button ${isFormValid ? "" : "disabled"}`}
                disabled={!isFormValid}
              >
                Guardar los cambios
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </motion.div>
  );
}

export default ProfileHistoryDetail;
