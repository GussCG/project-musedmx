import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";

export default function FavoritoButton() {
  const { user, setIsLogginPopupOpen } = useAuth();

  // Estado para los checkbox de favoritos
  const [isFavorite, setIsFavorite] = useState(false);
  const handleFavoriteChange = () => {
    // if (!user) {
    //     navigate('/Auth/Iniciar')
    //     return
    // }

    // Lógica para agregar o quitar de favoritos en el backend
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
