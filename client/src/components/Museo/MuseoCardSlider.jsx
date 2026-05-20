import { useState, useEffect, memo } from "react";
import { Link } from "react-router";
import { TEMATICAS } from "../../constants/catalog";
import { useTheme } from "../../context/ThemeProvider";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import FavoritoButton from "./FavoritoButton";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import Icons from "../Other/IconProvider";

const { LuMapPin } = Icons;

function MuseoCardSlider({
  museo,
  isIndex = false,
  editMode = false,
  handleDeleteFromQV,
  refetchFavoritos,
  onDeleteFromQV,
  refreshSugeridos,
}) {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode
    ? TEMATICAS[museo.tematica].museoCardColorsDark
    : TEMATICAS[museo.tematica].museoCardColorsLight;

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

  return (
    <div className={`museo-card-slider ${isIndex ? "index" : ""}`}>
      <Link to={`/museos/${museo.id}` || "#"}>
        <div className="image-container">
          <img src={museo.img} alt={museo.nombre} loading="lazy" />
        </div>
      </Link>
      <p
        className="tematica"
        style={{
          color: colors.text,
        }}
      >
        {TEMATICAS[museo.tematica].nombre}
      </p>
      <div className="name-container">
        <h3 className="nombre">{museo.nombre}</h3>
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
      </div>
      <span className="ubicacion">
        <LuMapPin /> {museo.alcaldia}
      </span>
    </div>
  );
}

export default MuseoCardSlider;
