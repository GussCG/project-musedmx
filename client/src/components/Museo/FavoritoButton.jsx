import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import ToastMessage from "../Other/ToastMessage";

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
    if (!user) return;

    let isMounted = true;

    const fetchFavorito = async () => {
      try {
        const fav = await verificarFavorito(user.usr_correo, museoId);
        if (isMounted) setIsFavorite(fav);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorito();

    return () => {
      isMounted = false;
    };
  }, [user?.usr_correo, museoId, verificarFavorito]);

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
        onChange={() => {
          if (user && user.usr_tipo === 1) {
            handleFavoriteChange();
          } else if (user && (user.usr_tipo === 2 || user.usr_tipo === 3)) {
            ToastMessage({
              tipo: "error",
              mensaje: "Tu cuenta no puede registrar favoritos.",
              position: "top-right",
            });
          } else {
            localStorage.setItem("redirectPath", window.location.pathname);
            setIsLogginPopupOpen(true);
          }
        }}
      />
      <span className="fav-button-span"></span>
    </label>
  );
}
