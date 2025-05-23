import { useEffect, useMemo, useState, useCallback } from "react";
import { m, motion } from "framer-motion";
import Icons from "../Other/IconProvider";
const { corazonIcon } = Icons;
import MuseoSlider from "../Museo/MuseoSlider";
import QVSearch from "../Museo/QVSearch";
import { useMuseos } from "../../hooks/Museo/useMuseos";
import { useFavorito } from "../../hooks/Favorito/useFavorito";
import { useAuth } from "../../context/AuthProvider";
import { useMuseosSugeridos } from "../../hooks/Usuario/useUsuarioMuseosSugeridos";
import { useQV } from "../../hooks/QuieroVisitar/useQV";

function UsuarioPage() {
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();

  const {
    museosFavoritos,
    loading: loadingFavoritos,
    fetchMuseosFavoritosUsuario,
  } = useFavorito();

  const {
    museos: museosSugeridosData,
    loading: loadingSugeridos,
    refetch,
  } = useMuseosSugeridos({
    top_n: 10,
    correo: user.usr_correo,
  });

  const [museosSugeridos, setMuseosSugeridos] = useState([]);

  // Actualiza el estado local cuando cambie el hook
  useEffect(() => {
    setMuseosSugeridos(museosSugeridosData || []);
  }, [museosSugeridosData]);

  // Nueva función que hace refetch y actualiza el estado local
  const refreshSugeridos = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const {
    museosQV,
    loading: loadingQV,
    fetchMuseosQVUsuario,
    agregarQV,
  } = useQV();

  useEffect(() => {
    if (user) {
      fetchMuseosFavoritosUsuario(user.usr_correo);
      fetchMuseosQVUsuario(user.usr_correo);
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
            refreshSugeridos={refreshSugeridos}
            loading={loadingSugeridos}
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
              <QVSearch
                correo={user.usr_correo}
                agregarQV={agregarQV}
                refreshQV={() => fetchMuseosQVUsuario(user.usr_correo)}
                museosQV={museosQV}
              />
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
            listaMuseos={museosQV}
            editMode={editMode}
            sliderType="Quiero-visitar"
            refetchFavoritos={() => {
              fetchMuseosFavoritosUsuario(user.usr_correo);
            }}
            refreshQV={() => fetchMuseosQVUsuario(user.usr_correo)}
            correo={user.usr_correo}
            loading={loadingQV}
          />
        </section>
      </main>
    </motion.div>
  );
}

export default UsuarioPage;
