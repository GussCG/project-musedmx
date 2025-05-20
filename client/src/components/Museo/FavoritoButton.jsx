import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useFavorito } from "../../hooks/Favorito/useFavorito";

export default function FavoritoButton({ museoId }) {
  const { user, setIsLogginPopupOpen } = useAuth();
  const { agregarFavorito, eliminarFavorito, verificarFavorito } =
    useFavorito();

  // Estado para los checkbox de favoritos
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorito = async () => {
      if (user) {
        const fav = await verificarFavorito(user.usr_correo, museoId);
        setIsFavorite(fav);
      }
    };
    fetchFavorito();
  }, [user, museoId]);

  const handleFavoriteChange = async () => {
    if (!user) return;

    const correo = user.usr_correo;

    if (isFavorite) {
      await eliminarFavorito(correo, museoId);
    } else {
      await agregarFavorito(correo, museoId);
    }

    setIsFavorite(!isFavorite);
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
