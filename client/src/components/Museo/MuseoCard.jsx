import { useState, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { motion } from "framer-motion";
// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buildImage } from "../../utils/buildImage";
import Icons from "../Other/IconProvider";
const { moneyIcon, freeIcon, FaTrash, FaStar, FaHeart } = Icons;
import { TEMATICAS } from "../../constants/catalog";
import { agruparHorarios } from "../../utils/agruparHorarios";
import FavoritoButton from "./FavoritoButton";
import useMuseoHorarios from "../../hooks/Museo/useMuseoHorarios";
import useMuseoResenas from "../../hooks/Museo/useMuseoResenas";
import { useFavorito } from "../../hooks/Favorito/useFavorito";

const MuseoCard = memo(function MuseoCard({
  museo,
  editMode,
  sliderType,
  refetchFavoritos,
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
  useEffect(() => {
    const fetchFavorito = async () => {
      if (user) {
        const fav = await verificarFavorito(user.usr_correo, museo.id);
        setIsFavorite(fav);
      }
      const count = await getFavoritosCountByMuseoId(museo.id);
      setLocaleCount(count);
    };
    fetchFavorito();
  }, [user, museo.id, getFavoritosCountByMuseoId]);

  // Eliminar un museo de Quiero Visitar
  const handleQVDelete = (id) => {
    // Lógica para eliminar el museo de Quiero Visitar en el backend
    try {
      // Eliminar el museo de la lista
      toast.success(`${museo.nombre} eliminado de la lista`, {
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
    } catch (error) {
      console.error("Error al eliminar el museo de Quiero Visitar", error);
    }
  };

  const {
    horarios,
    loading: loadingHorarios,
    error: errorHorarios,
    cerrado,
  } = useMuseoHorarios(museo.id);

  const horariosAgrupados = agruparHorarios(horarios);

  const { calificacionPromedio } = useMuseoResenas(museo.id);

  // Funcion para devolver la imagen de costo dependiendo del numero
  const costoImagen = () => {
    if (museo.costo === 0) {
      return <img src={freeIcon} alt="Costo" key="gratis" />;
    } else {
      return Array.from({ length: museo.costo }, (_, index) => (
        <img src={moneyIcon} alt="Costo" key={index} />
      ));
    }
  };

  return (
    <>
      {museo.tematica && (
        <motion.div
          className="museo-card"
          layoutId={`${layoutPrefix}museo-card-${museo.id}`}
          key={`${layoutPrefix}card-${museo.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
          style={{
            backgroundColor:
              TEMATICAS[museo.tematica].museoCardColors.background,
          }}
        >
          <div className="museo-card-img-container">
            {editMode ? (
              <div className="museo-card-delete-container">
                <button type="button" onClick={() => handleQVDelete(museo.id)}>
                  <FaTrash />
                </button>
              </div>
            ) : (
              <FavoritoButton
                museoId={museo.id}
                refetchFavoritos={refetchFavoritos}
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
              />
            )}
            <Link
              to={`/Museos/${museo.id}`}
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => navigate(`/Museos/${museo.id}`), 0);
              }}
            >
              <motion.img
                src={museo.img}
                alt={museo.nombre}
                className="museo-card-img"
                layoutId={`${layoutPrefix}museo-image-${museo.id}`}
                key={`${layoutPrefix}img-${museo.id}`}
                title={museo.nombre}
                loading="lazy"
              />

              <div className="museo-card-img-rating">
                <p id="museo-card-rating">{calificacionPromedio}</p>
                <FaStar
                  style={{
                    fill: TEMATICAS[museo.tematica].museoCardColors.header,
                  }}
                />
              </div>
              <div
                className="museo-card-img-tematica"
                style={{
                  backgroundColor:
                    TEMATICAS[museo.tematica].museoCardColors.header,
                }}
              >
                {museo.tematica && <h2>{TEMATICAS[museo.tematica].nombre}</h2>}
              </div>

              <div
                className="museo-card-likes"
                style={{
                  backgroundColor:
                    TEMATICAS[museo.tematica].museoCardColors.header,
                }}
              >
                <h2>{localeCount}</h2>
                <FaHeart />
              </div>
            </Link>
          </div>
          <div className="museo-card-info-container">
            <div className="museo-card-info-header">
              <Link
                to={`/Museos/${museo.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setTimeout(() => navigate(`/Museos/${museo.id}`), 0);
                }}
              >
                <h2
                  id="museo-card-nombre"
                  style={{
                    color: TEMATICAS[museo.tematica].museoCardColors.header,
                  }}
                >
                  {museo.nombre}
                </h2>
              </Link>
              <p
                id="museo-card-alcaldia"
                style={{
                  color: TEMATICAS[museo.tematica].museoCardColors.text,
                }}
              >
                {museo.alcaldia}
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
                    Horarios:
                  </p>
                  {cerrado && (
                    <p
                      style={{
                        color: TEMATICAS[museo.tematica].museoCardColors.text,
                      }}
                    >
                      Cerrado
                    </p>
                  )}
                  {horarios.length === 0 && !cerrado && (
                    <p
                      style={{
                        color: TEMATICAS[museo.tematica].museoCardColors.text,
                      }}
                    >
                      No se encontraron horarios disponibles
                    </p>
                  )}
                  {horariosAgrupados.map((horario, index) => (
                    <p
                      key={`${horario}-${index}`}
                      style={{
                        color: TEMATICAS[museo.tematica].museoCardColors.text,
                      }}
                    >
                      {horario}
                    </p>
                  ))}
                </>
              </div>
              <div className="museo-card-info-body-tematica">
                <img src={TEMATICAS[museo.tematica].icon} alt="Tematica" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
});

export default MuseoCard;
