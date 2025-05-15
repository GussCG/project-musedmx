import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Icons from "../Other/IconProvider";
const { corazonIcon } = Icons;
import MuseoSlider from "../Museo/MuseoSlider";
import QVSearch from "../Museo/QVSearch";
import { useMuseos } from "../../hooks/Museo/useMuseos";

function UsuarioPage() {
  const [editMode, setEditMode] = useState(false);

  const { museos: sugeridos, loading } = useMuseos({
    tipo: "3",
    searchQuery: "",
    isMapView: false,
    filters: { tipos: [], alcaldias: [] },
    sortBy: null,
  });

  console.log("sugeridos", sugeridos);

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
          <MuseoSlider listaMuseos={sugeridos} sliderType="Sugeridos" />
        </section>
        <hr />
        <section className="perfil-section-museo perfil-section-item">
          <div className="section-header">
            <h2>
              Museos Favoritos <img src={corazonIcon} id="corazon-icon" />
            </h2>
          </div>
          <MuseoSlider listaMuseos={null} sliderType="Favoritos" />
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
          />
        </section>
        <hr />
        <section className="perfil-section-museo perfil-section-item">
          <div className="section-header">
            <h2>Vistos Recientemente</h2>
          </div>
          <MuseoSlider listaMuseos={null} sliderType="Recientes" />
        </section>
      </main>
    </motion.div>
  );
}

export default UsuarioPage;
