import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useFavorito } from "../../hooks/Favorito/useFavorito";

export default function FavoritoButton({
  museoId,
  refetchFavoritos,
  isFavorite,
  setIsFavorite,
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

    const correo = user.usr_correo;

    if (isFavorite) {
      await eliminarFavorito(correo, museoId);
    } else {
      await agregarFavorito(correo, museoId);
    }

    // Actualizamos favorito individual
    const fav = await verificarFavorito(correo, museoId);
    setIsFavorite(fav);

    // Refrescar el contador si se usa en otro componente
    if (onFavoritoChange) {
      await onFavoritoChange(); // 🔁 Refresca el contador del componente externo
    }

    // Si hay que refrescar lista general
    if (refetchFavoritos) {
      await refetchFavoritos();
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
