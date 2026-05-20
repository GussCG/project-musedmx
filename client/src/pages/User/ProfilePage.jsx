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
import { useTheme } from "../../context/ThemeProvider";
import Icons from "../../components/Other/IconProvider";

const { FaInfoCircle } = Icons;

function ProfilePage() {
  const { user } = useAuth();

  const {
    fetchCountVisitas,
    fetchCountResenasUsuario,
    fetchVisitasCountDistinct,
  } = useVisitas();
  const [countVisitasDistinct, setCountVisitasDistinct] = useState(0);
  const [countVisitas, setCountVisitas] = useState(0);
  const [countResenas, setCountResenas] = useState(0);
  const [totalMuseos, setTotalMuseos] = useState(0);

  const { isDarkMode } = useTheme();

  // Se podría calcular el nivel de visitante aquí usando el numero de visitas totales (no importa si ha visitado el mismo museo varias veces, lo importante es el numero total de visitas)
  // (Bronze: 0-10 visitas, Plata: 11-30 visitas, Oro: 31-100 visitas, Platino: 101+ visitas)
  const getVisitorLevel = (count) => {
    if (count <= 10) return "Bronce";
    if (count <= 30) return "Plata";
    if (count <= 100) return "Oro";
    return "Platino";
  };

  useEffect(() => {
    const loadVisitas = async () => {
      if (user && user.usr_tipo === 1) {
        const response = await fetchCountVisitas(user.usr_correo);
        if (response) {
          setCountVisitas(response.count);
        }
      }
    };

    const loadVisitasDistinct = async () => {
      if (user && user.usr_tipo === 1) {
        const response = await fetchVisitasCountDistinct(user.usr_correo);
        if (response) {
          setCountVisitasDistinct(response.count);
          setTotalMuseos(response.totalMuseos);
        }
      }
    };

    const loadResenas = async () => {
      if (user && user.usr_tipo === 1) {
        const response = await fetchCountResenasUsuario(user.usr_correo);
        if (response) {
          setCountResenas(response.count);
        }
      }
    };

    loadVisitas();
    loadResenas();
    loadVisitasDistinct();
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
        <div className="header-user-container">
          <div id="header-image">
            <UserImage src={user?.usr_foto || userPlaceholder} alt="Usuario" />
          </div>
          <div id="header-user-info">
            <h1>{user && formatName({ user })}</h1>
            {user.usr_tipo === 2 ||
              (user.usr_tipo === 3 && (
                <p className="tipo">{TIPOS_USUARIO[user?.usr_tipo].nombre}</p>
              ))}
            {/* <p className="edad">{formatAge(user)} años</p> */}

            {user.usr_tipo === 1 ? (
              <>
                <div className="header-tematicas-container">
                  <ul className="tematicas-list">
                    {Array.isArray(user?.usr_tematicas) &&
                      user.usr_tematicas.map((tematicaNombre, index) => {
                        const tematica = Object.values(TEMATICAS).find(
                          (t) => t.nombre === tematicaNombre,
                        );

                        if (!tematica) return null;

                        return (
                          <li
                            key={index}
                            className="tematica-item"
                            style={{
                              backgroundColor: isDarkMode
                                ? TEMATICAS[tematica.id].museoCardColorsDark
                                    .background
                                : TEMATICAS[tematica.id].museoCardColorsLight
                                    .background,
                            }}
                          >
                            <span>{tematica.nombre}</span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                <div className="header-highlights-container">
                  <div
                    className={`highlight-item ${getVisitorLevel(countVisitas).toLowerCase()}`}
                  >
                    <p className="highlight-label">Nivel de Visitante</p>
                    <p className="highlight-value">
                      {getVisitorLevel(countVisitas).toUpperCase()}
                    </p>
                    <FaInfoCircle
                      className="highlight-icon"
                      title="Se calcula en base al número total de visitas realizadas. Bronce: 0-10 visitas, Plata: 11-30 visitas, Oro: 31-100 visitas, Platino: 101+ visitas."
                    />
                  </div>
                  <div className="highlight-item">
                    <p className="highlight-label">Visitas Realizadas</p>
                    <p className="highlight-value">{countVisitas}</p>
                  </div>
                  <div className="highlight-item">
                    <p className="highlight-label">Reseñas Escritas</p>
                    <p className="highlight-value">{countResenas}</p>
                  </div>
                  <div className="highlight-item">
                    <p className="highlight-label">Museos</p>
                    <p className="highlight-value">
                      {countVisitasDistinct}/{totalMuseos}
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
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
