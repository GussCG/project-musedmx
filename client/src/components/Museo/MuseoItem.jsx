import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import foto_default from "../../assets/images/others/museo-main-1.jpg";
import { TEMATICAS } from "../../constants/catalog";
import FavoritoButton from "../Museo/FavoritoButton";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import { useAuth } from "../../context/AuthProvider";
import { motion } from "framer-motion";

function MuseoItem({ museo, index }) {
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
        backgroundColor: TEMATICAS[museo.tematica].museoCardColors.background,
      }}
    >
      <div className="museo-list-item-img">
        <Link to={`/Museos/${museo.id}`}>
          <img src={museo.img || foto_default} alt={museo.nombre} />
        </Link>
        <div
          className="museo-list-item-rank"
          style={{
            backgroundColor:
              TEMATICAS[museo.tematica].museoCardColors.backgroundImage,
          }}
        >
          <p>{index + 1}</p>
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
                color: TEMATICAS[museo.tematica].museoCardColors.header,
              }}
            >
              {museo.nombre}
            </p>
          </Link>
        </div>
        {museo.tematica && (
          <>
            <div className="museo-list-item-tematica">
              <p
                style={{
                  color: TEMATICAS[museo.tematica].museoCardColors.text,
                }}
              >
                {TEMATICAS[museo.tematica].nombre}
              </p>
            </div>
            <div className="museo-list-tematica-icon">
              <img src={TEMATICAS[museo.tematica].icon} alt="" />
            </div>
          </>
        )}
      </div>
    </motion.li>
  );
}

export default MuseoItem;
