import NoticiaCard from "../Museo/NoticiaCard";
import HeroNoticiaSkeleton from "./NoticiaHeroSkeleton";

function NoticiasHero({ noticia = null }) {
  return (
    <section className="hero noticias">
      <div className="hero-header">
        <span className="pretitle">Crónica Cultural</span>
        <h1 className="title">
          Noticias del Mundo <br />
          Cultural
        </h1>
        <p className="subtitle">
          Mantente al día con las reaperturas, exposiciones temporales y eventos
          exclusivos de los museos más icónicos de la Ciudad de México. La
          curaduría digital al servicio de tu curiosidad.
        </p>
      </div>

      {!noticia ? (
        <HeroNoticiaSkeleton />
      ) : (
        <NoticiaCard noticia={noticia} variant="hero" />
      )}
    </section>
  );
}

export default NoticiasHero;
