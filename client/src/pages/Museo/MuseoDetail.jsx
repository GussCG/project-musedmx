import { useEffect, useState, createElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";
import HeaderMuseoButtons from "../../components/Museo/HeaderMuseoButtons";
import "../../styles/pages/MuseoDetails.scss";
import Icons from "../../components/Other/IconProvider";
const { FaFilter, estrellaIcon, FaHeart, IoIosArrowBack, IoIosArrowForward } =
  Icons;
import museoPlaceholder from "../../assets/images/others/museo-main-1.jpg";
import MenuFiltroResena from "../../components/Resena/MenuFiltroResena";
import MuseoSlider from "../../components/Museo/MuseoSlider";
import MuseoGallery from "../../components/Museo/MuseoGallery";
import {
  TEMATICAS,
  REDES_SOCIALES,
  SERVICIOS,
  TIPOS_USUARIO,
} from "../../constants/catalog";
import {
  procesarCalificaciones,
  procesarServicios,
} from "../../utils/calificacionesEncuesta";
import { formatearFechaTitulo } from "../../utils/formatearFechas";
import { formatearDireccion } from "../../utils/formatearDireccionVista";
import FavoritoButton from "../../components/Museo/FavoritoButton";
import { useMuseo } from "../../hooks/Museo/useMuseo";
import useMuseoGaleria from "../../hooks/Museo/useMuseoGaleria";
import useMuseoHorarios from "../../hooks/Museo/useMuseoHorarios";
import useMuseoRedesSociales from "../../hooks/Museo/useMuseoRedesSociales";
import HorarioSlider from "../../components/Museo/HorarioSlider";
import LoadingIndicator from "../../components/Other/LoadingIndicator";
import ResenaCard from "../../components/Resena/ResenaCard";
import useRespuestasTotales from "../../hooks/Encuesta/useRespuestasTotales";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import { useMuseosSimilares } from "../../hooks/Museo/useMuseosSimilares";
import { useMuseosCercanos } from "../../hooks/Museo/useMuseosCercanos";
import { useMuseosAsociados } from "../../hooks/Museo/useMuseosAsociados";
import useResenaMuseo from "../../hooks/Resena/useResenaMuseo";
import { useMemo } from "react";
import ReactPaginate from "react-paginate";
import MuseosMapView from "./MuseosMapView";

function MuseoDetail() {
  // Obtenemos el usuario para saber su tipo
  const { user, tipoUsuario, setIsLogginPopupOpen } = useAuth();
  const { isDarkMode } = useTheme();

  const navigate = useNavigate();

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
  const {
    galeria: galeria,
    loading: galeriaLoading,
    error: galeriaError,
  } = useMuseoGaleria(museoIdNumber, 10);
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
  const {
    respuestas: respuestasTotales,
    servicios: serviciosTotales,
    loading: respuestasLoading,
    error: respuestasError,
  } = useRespuestasTotales({
    encuestaId: 1,
    museoId: museoIdNumber,
  });
  const [favoritoCount, setFavoritoCount] = useState(0);
  const { getFavoritosCountByMuseoId } = useFavorito({
    museoId: museoIdNumber,
  });
  useEffect(() => {
    const fetchFavorito = async () => {
      const count = await getFavoritosCountByMuseoId(museoIdNumber);
      setFavoritoCount(count);
    };
    fetchFavorito();
  }, [museoIdNumber, getFavoritosCountByMuseoId]);

  const {
    museos: museosSimilares,
    loading: museosSimilaresLoading,
    error: museosSimilaresError,
  } = useMuseosSimilares({
    museoId: museoIdNumber,
    top_n: 10,
  });
  const {
    museos: museosCercanos,
    loading: museosCercanosLoading,
    error: museosCercanosError,
  } = useMuseosCercanos({
    museoId: museoIdNumber,
    top_n: 10,
  });
  const {
    museos: museosAsociados,
    loading: museosAsociadosLoading,
    error: museosAsociadosError,
  } = useMuseosAsociados({
    museoId: museoIdNumber,
    top_n: 10,
  });

  const [calificaciones, setCalificaciones] = useState({});
  const [serviciosOpacidad, setServiciosOpacidad] = useState({});

  useEffect(() => {
    if (!respuestasLoading && respuestasTotales && serviciosTotales) {
      const califs = procesarCalificaciones(respuestasTotales);
      const serv = procesarServicios(serviciosTotales);

      setCalificaciones(califs);
      setServiciosOpacidad(serv);
    }
  }, [respuestasLoading, respuestasTotales, serviciosTotales]);

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

    if (tema) {
      if (isDarkMode) {
        htmlElement.style.setProperty(
          "--bg-grad-color-1",
          tema.museoDetailBGColorsDM.background_1
        );
        htmlElement.style.setProperty(
          "--bg-grad-color-2",
          tema.museoDetailBGColorsDM.background_2
        );
      } else {
        htmlElement.style.setProperty(
          "--bg-grad-color-1",
          tema.museoDetailBGColors.background_1
        );
        htmlElement.style.setProperty(
          "--bg-grad-color-2",
          tema.museoDetailBGColors.background_2
        );
      }
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

  const [filtrosResena, setFiltrosResena] = useState({
    rating: null,
    tieneFotos: null,
    fecha: null,
  });

  const filtrosMemo = useMemo(() => {
    return {
      rating: filtrosResena.rating || null,
      tieneFotos: filtrosResena.tieneFotos || null,
      ordenFecha: filtrosResena.fecha || null,
    };
  }, [filtrosResena.rating, filtrosResena.tieneFotos, filtrosResena.fecha]);

  const [paginaResenas, setPaginaResenas] = useState(1);

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1; // React Paginate usa 0-indexed
    setPaginaResenas(selectedPage);
  };

  const {
    resenas,
    calificacionPromedio,
    calificacionesDistribucion,
    total,
    totalPaginas,
    currentPage,
    loading: resenasLoading,
  } = useResenaMuseo({
    museoId: museoIdNumber,
    filtros: filtrosMemo,
    pagina: paginaResenas,
    porPagina: 5,
  });

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
                setFiltros={setFiltrosResena}
                setPagina={setPaginaResenas}
              />
              <main id="museo-main">
                <section id="museo-section-1" className="museo-detail-item">
                  <div className="museo-section-1-image">
                    {isLoading ? (
                      <Skeleton width={550} height={250} />
                    ) : (
                      <img
                        src={museoInfo.img || museoPlaceholder}
                        alt={museoInfo.nombre}
                        className="museo-image"
                      />
                    )}
                    <FavoritoButton
                      museoId={museoInfo.id}
                      isFavorite={isFavorite}
                      setIsFavorite={setIsFavorite}
                      onFavoritoChange={async () => {
                        const count = await getFavoritosCountByMuseoId(
                          museoInfo.id
                        );
                        setFavoritoCount(count);
                      }}
                    />
                  </div>
                  <div
                    className={
                      user && (user.usr_tipo === 2 || user.usr_tipo === 3)
                        ? "museo-section-1-container-botones"
                        : "museo-section-1-container"
                    }
                  >
                    <div className="museo-section-1-info">
                      <label className="museo-section-1-info-title">
                        <h1>
                          {isLoading ? (
                            <Skeleton width={500} />
                          ) : (
                            <>{museoInfo.nombre}</>
                          )}
                        </h1>
                      </label>
                      <div className="museo-section-1-info-fundacion">
                        {isLoading ? (
                          <Skeleton width={300} />
                        ) : (
                          <>
                            <p>
                              <b>Fecha de Apertura:</b>{" "}
                              {formatearFechaTitulo(museoInfo.fecha_apertura)}
                            </p>
                          </>
                        )}
                      </div>
                      {redCorreo && (
                        <div className="museo-section-1-info-correo">
                          {createElement(
                            REDES_SOCIALES[redCorreo.mhrs_cve_rs]?.icon
                          )}
                          {isLoading ? (
                            <Skeleton width={300} />
                          ) : (
                            <p>{redCorreo.mhrs_link}</p>
                          )}
                        </div>
                      )}
                      <div className="museo-section-1-info-tematica">
                        {tema &&
                          (isLoading ? (
                            <Skeleton width={200} />
                          ) : (
                            <h1>{tema.nombre}</h1>
                          ))}
                      </div>
                    </div>
                    {user && (user.usr_tipo === 2 || user.usr_tipo === 3) ? (
                      <HeaderMuseoButtons museoId={museoId} />
                    ) : (
                      <div className="museo-section-1-csm">
                        <div className="museo-section-1-right">
                          <div className="museo-section-1-csm-calificacion">
                            {isLoading ? (
                              <Skeleton width={50} />
                            ) : (
                              <p>{calificacionPromedio.toFixed(2)}</p>
                            )}

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
                          <div className="museo-section-likes">
                            <p>{favoritoCount}</p>
                            <FaHeart />
                          </div>
                        </div>
                        <div className="museo-section-1-csm-social-media">
                          {redesSocialesLoading ? (
                            <Skeleton width={100} />
                          ) : (
                            redesSociales?.map((redSocial) => {
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
                            })
                          )}
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
                      <div className="museo-section-header">
                        <h1 className="h1-section">Calificaciones</h1>
                        <p>De acuerdo con los usuarios el museo es</p>
                      </div>
                      {Object.values(calificaciones).length === 0 ? (
                        <div className="no-results" style={{ width: "90%" }}>
                          <h2>No hay calificaciones aun</h2>
                        </div>
                      ) : (
                        <div className="museo-section-2-calificaciones-container">
                          {Object.values(calificaciones).map((calificacion) => (
                            <div
                              className="calificacion-container"
                              key={calificacion.titulo}
                            >
                              <div className="calificacion-icon">
                                {calificacion.icono && (
                                  <img
                                    src={calificacion.icono}
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
                                title={`${calificacion.width}%`}
                              >
                                <div
                                  className="calificacion-graph-bar-fill"
                                  style={{
                                    width: `${calificacion.width}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="calificacion-title">
                                <h2>{calificacion.titulo}</h2>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="museo-section-2-servicios museo-detail-item">
                      <div className="museo-section-header">
                        <h1>Servicios</h1>
                        <p>De acuerdo con los usuarios el museo cuenta con</p>
                      </div>

                      {serviciosTotales.length === 0 ? (
                        <div className="no-results" style={{ width: "90%" }}>
                          <h2>No se han calificado los servicios</h2>
                        </div>
                      ) : (
                        <div className="servicios-container">
                          {Object.values(SERVICIOS)
                            .sort((a, b) => {
                              const opacidadA =
                                serviciosOpacidad[a.id]?.opacidad || 0;
                              const opacidadB =
                                serviciosOpacidad[b.id]?.opacidad || 0;
                              return opacidadB - opacidadA; // Orden descendente (mayor a menor)
                            })
                            .map((servicio) => (
                              <div className="servicio-icon" key={servicio.id}>
                                <img
                                  src={servicio.icon}
                                  alt={servicio.nombre}
                                  title={servicio.nombre}
                                  style={{
                                    opacity:
                                      serviciosOpacidad[servicio.id]
                                        ?.opacidad || 0,
                                    filter: isDarkMode
                                      ? "invert(1)"
                                      : "invert(0)",
                                  }}
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="museo-section-2-descripcion">
                      <h1>Descripción</h1>
                      <p>
                        {isLoading ? (
                          <Skeleton count={5} width={950} />
                        ) : (
                          museoInfo.descripcion
                        )}
                      </p>
                    </div>
                    <div className="museo-section-2-ubicacion museo-detail-item">
                      <div className="museo-section-2-direccion">
                        <h1>Dirección</h1>
                        {isLoading ? (
                          <Skeleton width={300} />
                        ) : (
                          <p>{formatearDireccion(museoInfo)}</p>
                        )}
                      </div>
                      {isLoading ? (
                        <div className="no-results" style={{ width: "80%" }}>
                          <LoadingIndicator />
                        </div>
                      ) : (
                        <MuseosMapView
                          MuseosMostrados={[museoInfo]}
                          MuseosCercanos={museosCercanos}
                          zoom={15}
                          tipo={5}
                        />
                      )}
                    </div>
                  </section>
                  <MuseoGallery images={galeria} loading={isLoading} />
                  <section id="museo-section-4" className="museo-detail-item">
                    <h1 className="h1-section">Museos Relacionados</h1>
                    <hr />
                    <div className="museo-section-4-container">
                      <h2 className="h2-section">Museos Similares</h2>
                      {isLoading ? (
                        <div className="no-results">
                          <LoadingIndicator />
                        </div>
                      ) : (
                        <MuseoSlider
                          listaMuseos={museosSimilares}
                          sliderType="Similares"
                          loading={museosSimilaresLoading}
                        />
                      )}
                    </div>
                    <hr />
                    <div className="museo-section-4-container">
                      <h2 className="h2-section">
                        A otros usuarios les gustaron
                      </h2>
                      {isLoading ? (
                        <div className="no-results">
                          <LoadingIndicator />
                        </div>
                      ) : (
                        <MuseoSlider
                          listaMuseos={museosAsociados}
                          sliderType="A otros usuarios les gustaron"
                          loading={museosAsociadosLoading}
                        />
                      )}
                    </div>
                    <hr />
                    <div className="museo-section-4-container">
                      <h2 className="h2-section">Museos Cerca</h2>
                      {isLoading ? (
                        <div className="no-results">
                          <LoadingIndicator />
                        </div>
                      ) : (
                        <MuseoSlider
                          listaMuseos={museosCercanos}
                          sliderType="Cerca"
                          loading={museosCercanosLoading}
                        />
                      )}
                    </div>
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
                            {isLoading ? (
                              <Skeleton width={50} />
                            ) : (
                              <p>{calificacionPromedio.toFixed(2)}</p>
                            )}
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
                            {[5, 4, 3, 2, 1].map((star) => {
                              const total =
                                calificacionesDistribucion[star] || 0;
                              const porcentaje =
                                total > 0 && resenas.length > 0
                                  ? (total / resenas.length) * 100
                                  : 0;

                              return (
                                <div
                                  className="museo-calif-grafica-row"
                                  key={star}
                                >
                                  <p>{star}</p>
                                  <img
                                    src={estrellaIcon}
                                    alt="Estrella"
                                    style={
                                      isDarkMode ? { filter: "invert(1)" } : {}
                                    }
                                  />
                                  {isLoading ? (
                                    <Skeleton width={600} />
                                  ) : (
                                    <div
                                      className="museo-calif-grafica-estrellas-fill"
                                      style={{ width: `${porcentaje}%` }}
                                    ></div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {user?.usr_tipo !== 2 && user?.usr_tipo !== 3 ? (
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

                      {user && user?.usr_tipo === 3 ? (
                        <div className="museo-section-5-registrar">
                          <Link
                            to={`/${TIPOS_USUARIO[tipoUsuario].nombre}/VerResenas/${museoId}`}
                            // id="museo-section-5-registrar-button"
                            className="button-link"
                          >
                            Ver las reseñas de este museo
                          </Link>
                        </div>
                      ) : null}
                    </div>
                    <div className="museo-section-5-resenas">
                      {resenas.map((resena) => (
                        <ResenaCard
                          key={resena.res_id_res}
                          resena={resena}
                          loadingResena={resenasLoading}
                        />
                      ))}
                      {resenas.length === 0 && !resenasLoading && (
                        <div className="no-results">
                          <p>No hay reseñas disponibles</p>
                        </div>
                      )}
                    </div>
                    {totalPaginas > 1 && (
                      <ReactPaginate
                        breakLabel="..."
                        breakClassName="break"
                        nextLabel={<IoIosArrowForward />}
                        onPageChange={(event) => {
                          handlePageClick(event);
                        }}
                        pageRangeDisplayed={1}
                        marginPagesDisplayed={1}
                        pageCount={totalPaginas}
                        previousLabel={<IoIosArrowBack />}
                        renderOnZeroPageCount={null}
                        containerClassName="pagination"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="previous"
                        previousLinkClassName="previous"
                        nextClassName="next"
                        nextLinkClassName="next"
                        breakLinkClassName="page-link"
                        activeClassName="active"
                        forcePage={paginaResenas - 1} // React Paginate usa 0-indexed, así que restamos 1
                      />
                    )}
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
