import MuseDMXLogo from "../../assets/icons/SVG/musedmx-logo.svg";
import ScrollIndicator from "../Other/ScrollIndicator";

function ComunidadHero() {
  return (
    <section className="hero comunidad">
      <div className="text-container">
        <div className="header">
          <h1>Comunidad</h1>
          <img src={MuseDMXLogo} alt="MuseDMX Logo" className="logo" />
        </div>
        <p className="subtitle">
          Comparte tu pasión por la cultura, descubre nuevas perspectivas y
          conecta con otros exploradores del arte.
        </p>
      </div>
      <ScrollIndicator />
    </section>
  );
}

export default ComunidadHero;
