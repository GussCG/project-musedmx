import { useState, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { motion } from "framer-motion";
import Icons from "../Other/IconProvider";
const { FaTrash, FaStar, FaHeart } = Icons;
import { TEMATICAS } from "../../constants/catalog";
import { agruparHorarios } from "../../utils/agruparHorarios";
import FavoritoButton from "./FavoritoButton";
import useMuseoHorarios from "../../hooks/Museo/useMuseoHorarios";
import useResenaMuseo from "../../hooks/Resena/useResenaMuseo";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ImageSkeleton from "../Other/ImageSkeleton";

const MuseoCard = memo(function MuseoCard({
  museo,
  editMode,
  sliderType,
  refetchFavoritos,
  onDeleteFromQV,
  refreshSugeridos,
  loading,
}) {
  // Prefijo unico basado en sliderType
  const layoutPrefix = sliderType ? `${sliderType}-` : ``;
  // Para obtener el usuario autenticado pero aun no se ha implementado el backend
  const { user, setIsLogginPopupOpen } = useAuth();
  const navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);
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
    error: errorHorarios,
    cerrado,
  } = useMuseoHorarios(museo.id);

  const horariosAgrupados = agruparHorarios(horarios);
  const { calificacionPromedio } = useResenaMuseo({
    museoId: museo.id,
  });

  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  useEffect(() => {
    if (!loading && !loadingHorarios && !loadingFavoritos) {
      setIsFullyLoaded(true);
    }
  }, [loading, loadingHorarios, loadingFavoritos]);

  return (
    <>
      {museo.tematica && (
        <motion.div
          className="museo-card"
          key={`${layoutPrefix}card-${museo.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
          style={{
            backgroundColor: !isFullyLoaded
              ? "#d9d9d9"
              : TEMATICAS[museo.tematica].museoCardColors.background,
          }}
        >
          <div className="museo-card-img-container">
            {editMode ? (
              <div className="museo-card-delete-container">
                <button type="button" onClick={onDeleteFromQV}>
                  <FaTrash />
                </button>
              </div>
            ) : (
              <FavoritoButton
                museoId={museo.id}
                refetchFavoritos={refetchFavoritos}
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
                refreshSugeridos={refreshSugeridos}
              />
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

              <div className="museo-card-img-rating">
                <p id="museo-card-rating">
                  {!isFullyLoaded ? (
                    <Skeleton count={1} />
                  ) : calificacionPromedio !== 0 ? (
                    calificacionPromedio.toFixed(1)
                  ) : (
                    0
                  )}
                </p>
                <FaStar
                  style={{
                    fill: !isFullyLoaded
                      ? "white"
                      : TEMATICAS[museo.tematica].museoCardColors.header,
                  }}
                />
              </div>
              <div
                className="museo-card-img-tematica"
                style={{
                  backgroundColor: !isFullyLoaded
                    ? "#d9d9d9"
                    : TEMATICAS[museo.tematica].museoCardColors.header,
                }}
              >
                {museo.tematica &&
                  (!isFullyLoaded ? (
                    <Skeleton width={"70px"} />
                  ) : (
                    <h2>{TEMATICAS[museo.tematica].nombre}</h2>
                  ))}
              </div>

              <div
                className="museo-card-likes"
                style={{
                  backgroundColor: !isFullyLoaded
                    ? "#d9d9d9"
                    : TEMATICAS[museo.tematica].museoCardColors.header,
                }}
              >
                <h2>
                  {!isFullyLoaded ? <Skeleton width={"20px"} /> : localeCount}
                </h2>
                <FaHeart />
              </div>
            </Link>
          </div>
          <div className="museo-card-info-container">
            <div className="museo-card-info-header">
              <Link
                to={`/Museos/${museo.id}`}
                onClick={() => navigate(`/Museos/${museo.id}`)}
              >
                <h2
                  id="museo-card-nombre"
                  style={{
                    color: TEMATICAS[museo.tematica].museoCardColors.header,
                  }}
                >
                  {!isFullyLoaded ? <Skeleton width={250} /> : museo.nombre}
                </h2>
              </Link>
              <p
                id="museo-card-alcaldia"
                style={{
                  color: TEMATICAS[museo.tematica].museoCardColors.text,
                }}
              >
                {!isFullyLoaded ? <Skeleton width={150} /> : museo.alcaldia}
              </p>
            </div>
            <div className="museo-card-info-body">
              <div className="museo-card-info-body-item">
                <>
                  <p
                    className="semibold"
                    style={{
                      color: TEMATICAS[museo.tematica].museoCardColors.header,
                    }}
                  >
                    {!isFullyLoaded ? <Skeleton width={100} /> : "Horarios"}
                  </p>

                  {!isFullyLoaded ? (
                    <>
                      <Skeleton width={150} height={16} />
                      <Skeleton width={120} height={16} />
                      <Skeleton width={100} height={16} />
                    </>
                  ) : cerrado ? (
                    <p
                      style={{
                        color: TEMATICAS[museo.tematica].museoCardColors.text,
                      }}
                    >
                      Cerrado
                    </p>
                  ) : horarios.length === 0 ? (
                    <p
                      style={{
                        color: TEMATICAS[museo.tematica].museoCardColors.text,
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
                            color:
                              TEMATICAS[museo.tematica].museoCardColors.text,
                          }}
                        >
                          {horario}
                        </p>
                      );
                    })
                  )}
                </>
              </div>

              <div className="museo-card-info-body-tematica">
                {!isFullyLoaded ? (
                  <Skeleton
                    circle
                    height="100px"
                    width="100px"
                    style={{
                      position: "relative",
                      top: "50%",
                      left: "40%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ) : (
                  <img
                    src={TEMATICAS[museo.tematica].icon}
                    alt={museo.tematica}
                    className="museo-card-tematica-icon"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
});

export default MuseoCard;
