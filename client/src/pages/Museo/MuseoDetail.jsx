import { useEffect, useState, createElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";
import HeaderMuseoButtons from "../../components/Museo/HeaderMuseoButtons";
import "../../styles/pages/MuseoDetails.scss";
import Icons from "../../components/Other/IconProvider";
const { FaFilter, estrellaIcon, FaStar } = Icons;
import museoPlaceholder from "../../assets/images/others/museo-main-1.jpg";
// Placeholder usuario
import placeholderUserImage from "../../assets/images/placeholders/user_placeholder.png";
import MenuFiltroResena from "../../components/Resena/MenuFiltroResena";
import MapMuseoDetail from "../../components/Maps/MapMuseoDetail";
import MuseoSlider from "../../components/Museo/MuseoSlider";
import ImagenesSlider from "../../components/Resena/ImagenesSlider";
import MuseoGallery from "../../components/Museo/MuseoGallery";
import { buildImage } from "../../utils/buildImage";
import { TEMATICAS, REDES_SOCIALES, SERVICIOS } from "../../constants/catalog";
import { procesarCalificaciones } from "../../utils/calificacionesEncuesta";
import { formatearFechaTitulo } from "../../utils/formatearFechas";
import { formatearDireccion } from "../../utils/formatearDireccionVista";
import FavoritoButton from "../../components/Museo/FavoritoButton";
import { useMuseo } from "../../hooks/Museo/useMuseo";
// BACKEND_URL
import useMuseoGaleria from "../../hooks/Museo/useMuseoGaleria";
import useMuseoHorarios from "../../hooks/Museo/useMuseoHorarios";
import useMuseoRedesSociales from "../../hooks/Museo/useMuseoRedesSociales";
import HorarioSlider from "../../components/Museo/HorarioSlider";
import { ThreeDot } from "react-loading-indicators";

function MuseoDetail() {
  // Obtenemos el usuario para saber su tipo
  const { user, tipoUsuario, setIsLogginPopupOpen } = useAuth();
  const { isDarkMode } = useTheme();

  const navigate = useNavigate();
  const [contentLoaded, setContentLoaded] = useState(false);

  // Estado para controlar la visibilidad del menu de filtro
  const [menuVisible, setMenuVisible] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const abrirMenu = () => {
    setMenuVisible(true);
  };

  // FETCH DE MUSEO
  const { museoId } = useParams();
  const museoIdNumber = parseInt(museoId, 10);
  const {
    museo: museoInfo,
    loading: isLoading,
    error,
  } = useMuseo(museoIdNumber);
  // Para obtener la galeria de imagenees del museo
  const {
    galeria: galeria,
    loading: galeriaLoading,
    error: galeriaError,
  } = useMuseoGaleria(museoIdNumber);
  const {
    horarios: horarios,
    loading: horariosLoading,
    error: horariosError,
  } = useMuseoHorarios(museoIdNumber);
  const {
    redesSociales: redesSociales,
    loading: redesSocialesLoading,
    error: redesSocialesError,
  } = useMuseoRedesSociales(museoIdNumber);

  const calificaciones = procesarCalificaciones({
    edad: 3,
    interesante: 2,
    limpio: 1,
    entendible: 1,
    costo: 1,
  });

  // Estado para los checkbox de favoritos

  const handleFavoriteChange = () => {
    // if (!user) {
    //     navigate('/Auth/Iniciar')
    //     return
    // }

    // Lógica para agregar o quitar de favoritos en el backend
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const handleBackNavigation = () => {
      setIsExisting(true);
      setTimeout(() => navigate(-1), 300); // Coincide con la duración de tu animación
    };

    window.addEventListener("popstate", handleBackNavigation);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [navigate]);

  const tema = TEMATICAS[museoInfo.tematica];

  useEffect(() => {
    const htmlElement = document.documentElement;

    if (tema && !isDarkMode) {
      // Aplicar los nuevos colores del gradiente
      htmlElement.style.setProperty(
        "--bg-grad-color-1",
        tema.museoCardColors.backgroundImage
      );
      htmlElement.style.setProperty(
        "--bg-grad-color-2",
        tema.museoCardColors.background
      );
    }

    return () => {
      // Restaurar los valores originales al desmontar el componente
      htmlElement.style.removeProperty("--bg-grad-color-1");
      htmlElement.style.removeProperty("--bg-grad-color-2");
    };
  }, [tema, isDarkMode]);

  const redCorreo = redesSociales.find(
    (redSocial) => redSocial.mhrs_cve_rs === 2
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {!isExisting && (
          <motion.div
            className="museo-detail"
            key={`museo-detail-${museoInfo.mus_id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut", type: "tween" }}
          >
            <>
              <MenuFiltroResena
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
              />
              <main id="museo-main">
                <section id="museo-section-1" className="museo-detail-item">
                  <div className="museo-section-1-image">
                    {isLoading ? (
                      <div className="loading-indicator-img">
                        <ThreeDot
                          width={50}
                          height={50}
                          color="#000"
                          count={3}
                        />
                      </div>
                    ) : (
                      <img
                        src={buildImage(museoInfo)}
                        alt={museoInfo.nombre}
                        className="museo-image"
                      />
                    )}
                    <FavoritoButton />
                  </div>
                  <div
                    className={
                      user && (user.tipoUsuario === 2 || user.tipoUsuario === 3)
                        ? "museo-section-1-container-botones"
                        : "museo-section-1-container"
                    }
                  >
                    <div className="museo-section-1-info">
                      <label className="museo-section-1-info-title">
                        <h1>{museoInfo.nombre}</h1>
                      </label>
                      <div className="museo-section-1-info-fundacion">
                        <p>
                          <b>Fecha de Apertura:</b>{" "}
                          {formatearFechaTitulo(museoInfo.fecha_apertura)}{" "}
                        </p>
                      </div>
                      {redCorreo && (
                        <div className="museo-section-1-info-correo">
                          {createElement(
                            REDES_SOCIALES[redCorreo.mhrs_cve_rs]?.icon
                          )}
                          <p>{redCorreo.mhrs_link}</p>
                        </div>
                      )}
                      <div className="museo-section-1-info-tematica">
                        {tema && (
                          <>
                            <h1>{tema.nombre}</h1>
                          </>
                        )}
                      </div>
                    </div>
                    {user &&
                    (user.tipoUsuario === 2 || user.tipoUsuario === 3) ? (
                      <HeaderMuseoButtons museoId={museoId} />
                    ) : (
                      <div className="museo-section-1-csm">
                        <div className="museo-section-1-csm-calificacion">
                          <p>4.5</p>
                          <img
                            src={estrellaIcon}
                            alt="Estrella"
                            style={
                              isDarkMode
                                ? { filter: "invert(1)" }
                                : { filter: "invert(0)" }
                            }
                          />
                        </div>
                        <div className="museo-section-1-csm-social-media">
                          {!redesSocialesLoading &&
                            redesSociales.map((redSocial) => {
                              if (redSocial.mhrs_cve_rs === 2) return null; // No mostrar si es email
                              return (
                                <a
                                  key={redSocial.mhrs_id}
                                  href={redSocial.mhrs_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="museo-section-1-csm-icon"
                                  title={
                                    REDES_SOCIALES[redSocial.mhrs_cve_rs]
                                      ?.nombre
                                  }
                                >
                                  {createElement(
                                    REDES_SOCIALES[redSocial.mhrs_cve_rs]?.icon
                                  )}
                                </a>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="museo-section-1-tematica-image">
                    {tema && (
                      <img
                        src={tema.icon}
                        alt={tema.nombre}
                        className="museo-section-1-info-tematica-icon"
                        style={
                          isDarkMode
                            ? { filter: "invert(1)" }
                            : { filter: "invert(0)" }
                        }
                      />
                    )}
                  </div>
                </section>
                <HorarioSlider
                  horarios={horarios}
                  loading={horariosLoading}
                  error={horariosError}
                />
                <motion.div className="museo-detail-sections">
                  <section id="museo-section-2">
                    <div className="museo-section-2-calificaciones museo-detail-item">
                      <h1 className="h1-section">Calificaciones</h1>
                      <div className="museo-section-2-calificaciones-container">
                        {Object.keys(calificaciones).map((calificacion) => (
                          <div
                            className="calificacion-container"
                            key={calificacion}
                          >
                            <div className="calificacion-title">
                              <h2>{calificacion}</h2>
                            </div>
                            <div className="calificacion-icon">
                              {calificaciones[calificacion].icono && (
                                <img
                                  src={calificaciones[calificacion].icono}
                                  alt={calificacion}
                                  style={
                                    isDarkMode
                                      ? { filter: "invert(1)" }
                                      : { filter: "invert(0)" }
                                  }
                                />
                              )}
                            </div>
                            <div
                              className="calificacion-graph-bar"
                              title={`${calificaciones[calificacion].width}%`}
                            >
                              <div
                                className="calificacion-graph-bar-fill"
                                style={{
                                  width: `${calificaciones[calificacion].width}%`,
                                }}
                              ></div>
                            </div>
                            <p>{calificaciones[calificacion].titulo}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="museo-section-2-servicios museo-detail-item">
                      <h1>Servicios</h1>
                      <div className="servicios-container">
                        {Object.values(SERVICIOS).map((servicio) => (
                          <div className="servicio-icon" key={servicio.id}>
                            <img
                              src={servicio.icon}
                              alt={servicio.nombre}
                              title={servicio.nombre}
                              style={
                                isDarkMode
                                  ? { filter: "invert(1)" }
                                  : { filter: "invert(0)" }
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="museo-section-2-descripcion">
                      <h1>Descripción</h1>
                      <p>{museoInfo.mus_descripcion}</p>
                    </div>
                    <div className="museo-section-2-ubicacion museo-detail-item">
                      <div className="museo-section-2-direccion">
                        <h1>Dirección:</h1>
                        <p>{formatearDireccion(museoInfo)}</p>
                      </div>
                      <MapMuseoDetail museo={museoInfo} />
                    </div>
                  </section>
                  <MuseoGallery images={galeria} />
                  <section id="museo-section-4" className="museo-detail-item">
                    <h1 className="h1-section">
                      A otros usuarios también les gusto
                    </h1>
                    <MuseoSlider listaMuseos={null} sliderType="Similares" />
                  </section>
                  <section id="museo-section-5" className="museo-detail-item">
                    <div className="museo-section-5-header">
                      <h1 className="h1-section">Reseñas y Comentarios</h1>
                      <button
                        type="button"
                        className="museos-header-section-right-button"
                        onClick={abrirMenu}
                        title="Filtrar"
                      >
                        <p>Filtrar</p>
                        <FaFilter />
                      </button>
                    </div>
                    <div className="museo-section-5-crv">
                      <div className="museo-section-5-calificacion">
                        <h2>Calificación</h2>
                        <div className="museo-calificaciones">
                          <div className="museo-calif-prom">
                            <p>4.5</p>
                            <img
                              src={estrellaIcon}
                              alt="Estrella"
                              style={
                                isDarkMode
                                  ? { filter: "invert(1)" }
                                  : { filter: "invert(0)" }
                              }
                            />
                          </div>
                          <div className="museo-calif-linea"></div>
                          <div className="museo-calif-grafica">
                            <div className="museo-calif-grafica-row">
                              <p>5</p>
                              <img
                                src={estrellaIcon}
                                alt="Estrella"
                                style={
                                  isDarkMode
                                    ? { filter: "invert(1)" }
                                    : { filter: "invert(0)" }
                                }
                              />
                              <div
                                className="museo-calif-grafica-estrellas-fill"
                                id="museo-calif-grafica-5-estrellas-fill"
                              ></div>
                            </div>
                            <div className="museo-calif-grafica-row">
                              <p>4</p>
                              <img
                                src={estrellaIcon}
                                alt="Estrella"
                                style={
                                  isDarkMode
                                    ? { filter: "invert(1)" }
                                    : { filter: "invert(0)" }
                                }
                              />
                              <div
                                className="museo-calif-grafica-estrellas-fill"
                                id="museo-calif-grafica-4-estrellas-fill"
                              ></div>
                            </div>
                            <div className="museo-calif-grafica-row">
                              <p>3</p>
                              <img
                                src={estrellaIcon}
                                alt="Estrella"
                                style={
                                  isDarkMode
                                    ? { filter: "invert(1)" }
                                    : { filter: "invert(0)" }
                                }
                              />
                              <div
                                className="museo-calif-grafica-estrellas-fill"
                                id="museo-calif-grafica-3-estrellas-fill"
                                style={{
                                  width: `10%`,
                                }}
                              ></div>
                            </div>
                            <div className="museo-calif-grafica-row">
                              <p>2</p>
                              <img
                                src={estrellaIcon}
                                alt="Estrella"
                                style={
                                  isDarkMode
                                    ? { filter: "invert(1)" }
                                    : { filter: "invert(0)" }
                                }
                              />
                              <div
                                className="museo-calif-grafica-estrellas-fill"
                                id="museo-calif-grafica-2-estrellas-fill"
                                style={{
                                  width: `1%`,
                                }}
                              ></div>
                            </div>
                            <div className="museo-calif-grafica-row">
                              <p>1</p>
                              <img
                                src={estrellaIcon}
                                alt="Estrella"
                                style={
                                  isDarkMode
                                    ? { filter: "invert(1)" }
                                    : { filter: "invert(0)" }
                                }
                              />
                              <div
                                className="museo-calif-grafica-estrellas-fill"
                                id="museo-calif-grafica-1-estrellas-fill"
                                style={{
                                  width: `1%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {user?.tipoUsuario !== 2 && user?.tipoUsuario !== 3 ? (
                        <div className="museo-section-5-registrar">
                          <h2>¿Fuiste al museo?</h2>
                          <Link
                            to={`/Museos/${museoId}/RegistrarVisita`}
                            className="button-reg-resena"
                            onClick={(e) => {
                              if (!user) {
                                e.preventDefault();
                                localStorage.setItem(
                                  "redirectPath",
                                  `/Museos/${museoId}/RegistrarVisita`
                                );
                                setIsLogginPopupOpen(true);
                              }
                            }}
                          >
                            Registra tu visita aquí
                          </Link>
                        </div>
                      ) : null}

                      {user && user?.tipoUsuario === 3 ? (
                        <div className="museo-section-5-registrar">
                          <Link
                            to={`/${tipoUsuario}/VerResenas/${museoId}`}
                            // id="museo-section-5-registrar-button"
                            className="button-link"
                          >
                            Ver las reseñas de este museo
                          </Link>
                        </div>
                      ) : null}
                    </div>
                    <div className="museo-section-5-resenas">
                      <div className="museo-section-5-resena">
                        <div className="resena-foto-container">
                          <img src={placeholderUserImage} alt="Usuario" />
                        </div>
                        <div className="resena-comentario-container">
                          <div className="resena-comentario-header">
                            <p id="nombre-user">Juan Pérez</p>
                            <p id="fecha-resena">17-09-2024</p>
                            <div className="resena-calificacion">
                              <p>4</p>
                              <FaStar />
                            </div>
                          </div>
                          <div className="resena-comentario-body">
                            <p>
                              El Museo Nacional de Antropología es una visita
                              imperdible en la Ciudad de México. Con
                              impresionantes piezas como la Piedra del Sol y
                              exposiciones interactivas, ofrece un recorrido
                              fascinante por las culturas prehispánicas. Ideal
                              para toda la familia y perfecto para quienes
                              quieren conocer la historia de México de forma
                              amena y visual.
                            </p>
                            {/* Slider de imagenes */}
                            <ImagenesSlider listaImagenes={galeria} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.div>
              </main>
            </>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MuseoDetail;
