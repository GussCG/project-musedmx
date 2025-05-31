import placeholderUserImage from "../../assets/images/placeholders/user_placeholder.png";
import { Link } from "react-router-dom";
import ImagenesSlider from "../../components/Resena/ImagenesSlider";
import Icons from "../Other/IconProvider";
const { FaStar } = Icons;
import { formatName } from "../../utils/formatName";
import {
  formatearFecha,
  formatearFechaRelativa,
  formatearFechaRelativaCompleta,
} from "../../utils/formatearFechas";
import { SERVICIOS } from "../../constants/catalog";
import { useTheme } from "../../context/ThemeProvider";
import Skeleton from "react-loading-skeleton";
import { useAuth } from "../../context/AuthProvider";

function ResenaCard({ resena = {}, loadingResena = true }) {
  loadingResena = false;
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  return (
    <>
      <div className="resena-card">
        <div className="resena-foto-container">
          {loadingResena ? (
            <Skeleton width={100} height={100} circle={true} />
          ) : (
            <img
              src={resena.usr_foto || placeholderUserImage}
              alt="Foto de usuario"
            />
          )}
        </div>
        <div className="resena-comentario-container">
          <div className="resena-comentario-header">
            <div className="nombre-calif-container">
              <div className="left-header">
                <p id="nombre-user">
                  {formatName({
                    nombre: resena?.usr_nombre,
                    apPaterno: resena?.usr_ap_paterno,
                    apMaterno: resena?.usr_ap_materno,
                  })}
                </p>

                <div className="resena-calificacion">
                  {loadingResena ? (
                    <Skeleton width={100} height={20} />
                  ) : (
                    Array.from(
                      { length: resena?.res_calif_estrellas },
                      (_, i) => <FaStar key={i} />
                    )
                  )}
                </div>
                {user.usr_correo === resena.visitas_vi_usr_correo && (
                  <Link
                    className="button-link"
                    to={`/Usuario/Historial/${resena.res_id_res}`}
                  >
                    Editar
                  </Link>
                )}
              </div>

              <div
                className="resena-servicios"
                key={`servicios-${resena?.visitas_vi_fechahora}`}
              >
                {loadingResena ? (
                  <Skeleton width={100} height={20} />
                ) : (
                  resena?.servicios?.length > 0 &&
                  resena.servicios.map((servicioId) => {
                    const servicio = SERVICIOS[servicioId];
                    if (!servicio) return null; // ← solo renderiza si existe en el catálogo

                    return (
                      <img
                        src={servicio.icon}
                        alt={servicio.nombre}
                        key={servicioId}
                        title={servicio.nombre}
                        style={{
                          filter: isDarkMode ? "invert(1)" : "none",
                        }}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <p id="fecha-resena">
              {loadingResena ? (
                <Skeleton width={100} height={20} />
              ) : (
                formatearFechaRelativaCompleta(resena?.visitas_vi_fechahora)
              )}
            </p>
          </div>
          <div className="resena-comentario-body">
            {loadingResena ? (
              <Skeleton count={3} width={"500px"} />
            ) : (
              <p>{resena?.res_comentario || ""}</p>
            )}
            {/* Slider de imagenes */}

            {resena?.fotos && resena.fotos.length > 0 && (
              <ImagenesSlider
                fotos={resena.fotos}
                id={`slider-${resena.visitas_vi_fechahora}`}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResenaCard;
