import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Icons from "../Other/IconProvider";
const { corazonIcon } = Icons;
import MuseoSlider from "../Museo/MuseoSlider";
import QVSearch from "../Museo/QVSearch";
import { useMuseos } from "../../hooks/Museo/useMuseos";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import { useAuth } from "../../context/AuthProvider";
import { useMuseosSugeridos } from "../../hooks/Usuario/useUsuarioMuseosSugeridos";

function UsuarioPage() {
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();

  const { museos: sugeridos, loading } = useMuseos({
    tipo: "3",
    searchQuery: "",
    isMapView: false,
    filters: { tipos: [], alcaldias: [] },
    sortBy: null,
  });

  const {
    museosFavoritos,
    loading: loadingFavoritos,
    fetchMuseosFavoritosUsuario,
  } = useFavorito();

  const { museos: museosSugeridos, loading: loadingSugeridos } =
    useMuseosSugeridos({
      top_n: 10,
      correo: user.usr_correo,
    });

  useEffect(() => {
    if (user) {
      fetchMuseosFavoritosUsuario(user.usr_correo);
    }
  }, [user]);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "0" }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.18 }}
    >
      <main id="perfil-main">
        <section className="perfil-section-museo perfil-section-item">
          <div className="section-header">
            <h2>Museos Sugeridos</h2>
          </div>
          <MuseoSlider
            listaMuseos={museosSugeridos}
            sliderType="Sugeridos"
            refetchFavoritos={() => {
              fetchMuseosFavoritosUsuario(user.usr_correo);
            }}
          />
        </section>
        <hr />
        <section className="perfil-section-museo perfil-section-item">
          <div className="section-header">
            <h2>
              Museos Favoritos <img src={corazonIcon} id="corazon-icon" />
            </h2>
          </div>
          <MuseoSlider
            listaMuseos={museosFavoritos}
            loading={loadingFavoritos}
            sliderType="Favoritos"
            refetchFavoritos={() =>
              fetchMuseosFavoritosUsuario(user.usr_correo)
            }
          />
        </section>
        <hr />
        <section className="perfil-section-museo perfil-section-item">
          <div className="section-header">
            <h2>Museos que quiero visitar</h2>
            <div className="section-header-controller">
              <QVSearch />
              <button
                type="button"
                id="editar-button"
                onClick={() => setEditMode(!editMode)}
              >
                <span>{editMode ? "Salir" : "Editar"}</span>
              </button>
            </div>
          </div>
          <MuseoSlider
            listaMuseos={null}
            editMode={editMode}
            sliderType="Quiero-visitar"
            refetchFavoritos={() =>
              fetchMuseosFavoritosUsuario(user.usr_correo)
            }
          />
        </section>
      </main>
    </motion.div>
  );
}

export default UsuarioPage;
