import MuseumSearch from "../../components/Museo/MuseumSearch";
import Icons from "../Other/IconProvider";
const { FaFilter } = Icons;

import museoBg from "../../assets/images/others/museo-list-hero.jpg";

function MuseosListHero({ onOpenFilters, currentFilters, onSearchAction }) {
  return (
    <section
      className="hero museo-list"
      style={{ backgroundImage: `url(${museoBg})` }}
    >
      <div className="text-container">
        <h1>Explora la Riqueza</h1>
        <h1 className="cultural">Cultural</h1>
        <p className="subtitle">
          Sumérgete en la vasta red de recintos históricos y contemporáneos que
          definen el alma de México
        </p>
      </div>

      <div className="n-search-container">
        <p className="search-title">Encuentra tu próximo destino</p>
        <div className="nav-bar-filter">
          <MuseumSearch
            swiperRef={null}
            className="hero-search-variant"
            onSearchAction={onSearchAction}
          />

          <div className="right-section">
            <button
              className="right-section-button"
              type="button"
              onClick={onOpenFilters}
            >
              <FaFilter /> Filtrar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MuseosListHero;
