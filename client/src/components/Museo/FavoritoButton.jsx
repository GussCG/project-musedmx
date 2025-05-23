import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useFavorito } from "../../hooks/Favorito/useFavorito";

export default function FavoritoButton({
  museoId,
  refetchFavoritos,
  isFavorite,
  setIsFavorite,
  refreshSugeridos,
}) {
  const { user, setIsLogginPopupOpen } = useAuth();
  const {
    agregarFavorito,
    eliminarFavorito,
    verificarFavorito,
    getFavoritosCountByMuseoId,
    onFavoritoChange,
  } = useFavorito({
    museoId,
  });

  useEffect(() => {
    const fetchFavorito = async () => {
      if (user) {
        const fav = await verificarFavorito(user.usr_correo, museoId);
        setIsFavorite(fav);
      }
    };
    fetchFavorito();
  }, [user, museoId, setIsFavorite, verificarFavorito]);

  const handleFavoriteChange = async () => {
    if (!user) return;
    try {
      const correo = user.usr_correo;

      if (isFavorite) {
        await eliminarFavorito(correo, museoId);
        if (refreshSugeridos) refreshSugeridos();
      } else {
        await agregarFavorito(correo, museoId);
        if (refreshSugeridos) refreshSugeridos();
      }

      const fav = await verificarFavorito(correo, museoId);
      setIsFavorite(fav);

      if (onFavoritoChange) await onFavoritoChange();
      if (refetchFavoritos) await refetchFavoritos();
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
    }
  };

  return (
    <label className="fav-button-container">
      <input
        type="checkbox"
        name="museo-fav"
        className="fav-button"
        checked={isFavorite}
        onChange={
          user
            ? handleFavoriteChange
            : () => {
                localStorage.setItem("redirectPath", window.location.pathname);
                setIsLogginPopupOpen(true);
              }
        }
      />
      <span className="fav-button-span"></span>
    </label>
  );
}
