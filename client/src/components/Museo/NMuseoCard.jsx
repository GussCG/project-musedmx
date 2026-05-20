import { useState, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { motion } from "framer-motion";
import Icons from "../Other/IconProvider";
const { FaTrash, FaStar, MdReviews, HiMapPin, FaArrowRight } = Icons;
import { TEMATICAS } from "../../constants/catalog";
import { agruparHorarios } from "../../utils/agruparHorarios";
import FavoritoButton from "./FavoritoButton";
import useMuseoHorarios from "../../hooks/Museo/useMuseoHorarios";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ImageSkeleton from "../Other/ImageSkeleton";
import parseCalificacion from "../../utils/parseCalificacion";
import { useTheme } from "../../context/ThemeProvider";

const NMuseoCard = memo(function NMuseoCard({
  museo,
  editMode,
  sliderType,
  refetchFavoritos,
  onDeleteFromQV,
  refreshSugeridos,
  loading,
}) {
  const layoutPrefix = sliderType ? `${sliderType}-` : ``;
  const { user } = useAuth();
  const navigate = useNavigate();

  const { isDarkMode } = useTheme();

  const [isFavorite, setIsFavorite] = useState(false);
  const [localeCount, setLocaleCount] = useState(0);
  const { verificarFavorito, getFavoritosCountByMuseoId } = useFavorito();
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);

  useEffect(() => {
    const fetchFavorito = async () => {
      try {
        setLoadingFavoritos(true);

        if (user) {
          const fav = await verificarFavorito(user.usr_correo, museo.id);
          setIsFavorite(fav);
        }

        const count = await getFavoritosCountByMuseoId(museo.id);
        setLocaleCount(count);
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
      } finally {
        setLoadingFavoritos(false);
      }
    };

    fetchFavorito();
  }, [user, museo.id, getFavoritosCountByMuseoId]);

  const {
    horarios,
    loading: loadingHorarios,
    cerrado,
  } = useMuseoHorarios(museo.id);

  const horariosAgrupados = agruparHorarios(horarios);

  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  useEffect(() => {
    if (!loading && !loadingHorarios && !loadingFavoritos) {
      setIsFullyLoaded(true);
    }
  }, [loading, loadingHorarios, loadingFavoritos]);

  // Define colores por tema (dark o light)
  const colors = isDarkMode
    ? TEMATICAS[museo.tematica].museoCardColorsDark
    : TEMATICAS[museo.tematica].museoCardColorsLight;

  console.log("Renderizando NMuseoCard para museo:", museo);

  return (
    <>
      {museo.tematica && (
        <motion.div
          className="n-museo-card"
          key={`${layoutPrefix}card-${museo.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
          style={{
            backgroundColor: !isFullyLoaded ? "#d9d9d9" : colors.background,
          }}
        >
          <div className="museo-card-img-container">
            <div className="rating-pill">
              <span>
                {!isFullyLoaded ? (
                  <Skeleton width={30} />
                ) : museo.mus_calificacion ? (
                  <>
                    <FaStar fill={colors.header} />
                    {parseCalificacion(museo.mus_calificacion).toFixed(1) || 0}
                  </>
                ) : (
                  <>
                    <FaStar fill={colors.header} />
                    N/A
                  </>
                )}
              </span>
            </div>

            {editMode ? (
              <div className="museo-card-delete-container">
                <button type="button" onClick={onDeleteFromQV}>
                  <FaTrash />
                </button>
              </div>
            ) : (
              <></>
            )}
            <Link
              to={`/Museos/${museo.id}`}
              onClick={() => navigate(`/Museos/${museo.id}`)}
            >
              {!isFullyLoaded ? (
                <Skeleton
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: "20px" }}
                />
              ) : (
                <ImageSkeleton
                  src={museo.img}
                  alt={museo.nombre}
                  className={"museo-card-img"}
                />
              )}
            </Link>
          </div>
          <div className="museo-card-info-container">
            <div className="info-header">
              <div
                className="tematica-pill"
                style={{
                  backgroundColor: isFullyLoaded
                    ? `${colors.header}`
                    : "#c0c0c0",
                }}
              >
                {isFullyLoaded && (
                  <span>{TEMATICAS[museo.tematica].nombre}</span>
                )}
              </div>
              <div className="info-header-right">
                <span>
                  {!isFullyLoaded ? (
                    <Skeleton width={30} />
                  ) : (
                    <>
                      <MdReviews />
                      {museo.total_resenias}
                    </>
                  )}
                </span>
                <span className="likes">
                  {!isFullyLoaded ? (
                    <Skeleton width={30} />
                  ) : (
                    <>
                      <FavoritoButton
                        museoId={museo.id}
                        refetchFavoritos={refetchFavoritos}
                        isFavorite={isFavorite}
                        setIsFavorite={setIsFavorite}
                        refreshSugeridos={refreshSugeridos}
                      />
                      {localeCount}
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="info-body">
              <h2 id="museo-card-nombre">
                {!isFullyLoaded ? <Skeleton width={250} /> : museo.nombre}
              </h2>

              <div className="horarios">
                {!isFullyLoaded ? (
                  <>
                    <Skeleton width={150} height={16} />
                    <Skeleton width={120} height={16} />
                    <Skeleton width={100} height={16} />
                  </>
                ) : cerrado ? (
                  <p
                    style={{
                      color: colors.text,
                    }}
                  >
                    Cerrado
                  </p>
                ) : horarios.length === 0 ? (
                  <p
                    style={{
                      color: colors.text,
                    }}
                  >
                    No se encontraron horarios disponibles
                  </p>
                ) : (
                  horariosAgrupados.map((horario, index) => {
                    return (
                      <p
                        key={`${horario}-${index}`}
                        style={{
                          color: colors.text,
                        }}
                      >
                        {horario}
                      </p>
                    );
                  })
                )}
              </div>
            </div>
            <hr
              style={{
                borderTop: `1px solid ${colors.text}`,
              }}
            />
            <div className="info-footer">
              {!isFullyLoaded ? (
                <Skeleton width={100} height={10} />
              ) : (
                <span
                  className="location"
                  style={{
                    color: `${colors.text}`,
                  }}
                >
                  <HiMapPin />
                  {!isFullyLoaded ? <Skeleton width={120} /> : museo.alcaldia}
                </span>
              )}

              {isFullyLoaded && (
                <Link
                  to={`/Museos/${museo.id}`}
                  onClick={() => navigate(`/Museos/${museo.id}`)}
                  className="goto-btn"
                  style={{
                    backgroundColor: `${colors.header}`,
                  }}
                  title="Ver más información"
                >
                  <FaArrowRight />
                </Link>
              )}
            </div>

            {isFullyLoaded && (
              <img
                src={TEMATICAS[museo.tematica].icon}
                alt={museo.tematica}
                className="museo-card-tematica-icon"
                style={{
                  filter: isDarkMode ? "invert(1)" : "none",
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </>
  );
});

export default NMuseoCard;
