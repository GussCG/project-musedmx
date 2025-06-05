import { useAuth } from "../../context/AuthProvider";
import { motion } from "framer-motion";
import userPlaceholder from "../../assets/images/placeholders/user_placeholder.png";
import AdminPage from "../../components/User/AdminPage";
import ModPage from "../../components/User/ModPage";
import UsuarioPage from "../../components/User/UsuarioPage";
import HeaderButtons from "../../components/User/HeaderButtons";
import UserImage from "../../components/User/UserImage";
import { useVisitas } from "../../hooks/Visitas/useVisitas";
import { useEffect, useState } from "react";
import { TEMATICAS, TIPOS_USUARIO } from "../../constants/catalog";
import { formatName } from "../../utils/formatName";
import { formatAge } from "../../utils/formatAge";

function ProfilePage() {
  const { user } = useAuth();

  const { fetchCountVisitas } = useVisitas();
  const [countVisitas, setCountVisitas] = useState(0);
  const [totalMuseos, setTotalMuseos] = useState(0);

  useEffect(() => {
    const loadVisitas = async () => {
      if (user && user.usr_tipo === 1) {
        const response = await fetchCountVisitas(user.usr_correo);
        if (response) {
          setCountVisitas(response.count);
          setTotalMuseos(response.totalMuseos);
        }
      }
    };

    loadVisitas();
  }, [user]);

  return (
    <>
      <motion.header
        className="profile-header"
        initial={{ y: "-200%" }}
        animate={{ y: "0" }}
        exit={{ y: "-200%" }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.18 }}
      >
        <div id="header-image">
          <UserImage src={user?.usr_foto || userPlaceholder} alt="Usuario" />
        </div>
        <div id="header-user-info">
          <h1>{user && formatName({ user })}</h1>
          {user.usr_tipo === 2 ||
            (user.usr_tipo === 3 && (
              <p id="light">{TIPOS_USUARIO[user?.usr_tipo].nombre}</p>
            ))}
          <p id="semibold">{formatAge(user)} años</p>

          {user.usr_tipo === 1 ? (
            <>
              <p id="regular">
                <b>Museos Visitados</b>:{` ${countVisitas} de ${totalMuseos}`}
              </p>
              <div className="header-tematicas-container">
                <p>Temáticas</p>
                <ul className="tematicas-list">
                  {Array.isArray(user?.usr_tematicas) &&
                    user.usr_tematicas.map((tematicaNombre, index) => {
                      const tematica = Object.values(TEMATICAS).find(
                        (t) => t.nombre === tematicaNombre
                      );

                      if (!tematica) return null;

                      return (
                        <li
                          key={index}
                          className="tematica-item"
                          style={{
                            backgroundColor:
                              tematica.museoCardColors.background,
                          }}
                        >
                          <span>{tematica.nombre}</span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </>
          ) : null}
        </div>
        <HeaderButtons tipoUsuario={user.usr_tipo} />
      </motion.header>

      {user.usr_tipo === 1 && <UsuarioPage />}

      {user.usr_tipo === 2 && <AdminPage />}

      {user.usr_tipo === 3 && <ModPage />}
    </>
  );
}

export default ProfilePage;
