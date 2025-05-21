import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import foto_default from "../../assets/images/others/museo-main-1.jpg";
import FavoritoButton from "../Museo/FavoritoButton";
import { TEMATICAS } from "../../constants/catalog";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";

function MuseoCercaItem({ museo, travelMode }) {
  const { user } = useAuth();
  const { verificarFavorito, getFavoritosCountByMuseoId } = useFavorito();

  const [isFavorite, setIsFavorite] = useState(false);
  const [localeCount, setLocaleCount] = useState(0);

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
  }, [user, museo.id]);

  const timeLabels = {
    WALKING: "Caminando",
    BICYCLING: "En Bicicleta",
    DRIVING: "En Auto",
    TRANSIT: "En Transporte Público",
  };

  const formatearDistancia = (distancia) => {
    const metros = distancia * 1000;
    return metros < 1000
      ? `${metros.toFixed(0)} m`
      : `${(metros / 1000).toFixed(1)} km`;
  };

  return (
    <motion.li
      key={museo.id}
      className="museo-list-item"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
        type: "spring",
        stiffness: 50,
      }}
      style={{
        backgroundColor: TEMATICAS[museo.tematica]?.museoCardColors.background,
      }}
    >
      <div className="museo-list-item-img">
        <Link to={`/Museos/${museo.id}`}>
          <img src={museo.img || foto_default} alt={museo.nombre} />
        </Link>
        <div
          className="museo-list-item-distance"
          style={{
            backgroundColor:
              TEMATICAS[museo.tematica]?.museoCardColors.backgroundImage,
          }}
        >
          <p>{formatearDistancia(museo.distancia)}</p>
        </div>
        <FavoritoButton
          museoId={museo.id}
          refetchFavoritos={null}
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
        />
      </div>
      <div className="museo-list-item-info">
        <div className="museo-list-item-name">
          <Link to={`/Museos/${museo.id}`}>
            <p
              style={{
                color: TEMATICAS[museo.tematica]?.museoCardColors.header,
              }}
            >
              {museo.nombre}
            </p>
          </Link>
        </div>
        <div className="museo-list-item-tiempo">
          <p
            style={{
              color: TEMATICAS[museo.tematica]?.museoCardColors.text,
            }}
          >
            {museo.tiempoEstimado} min - {timeLabels[travelMode]}
          </p>
        </div>
        {museo.tematica && (
          <div className="museo-list-tematica-icon">
            <img src={TEMATICAS[museo.tematica].icon} alt="" />
          </div>
        )}
      </div>
    </motion.li>
  );
}

export default MuseoCercaItem;
