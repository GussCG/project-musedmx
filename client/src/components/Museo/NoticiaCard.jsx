import { Link } from "react-router";
import Icons from "../Other/IconProvider";
const { MdArrowOutward, MdHome, MdAccessTime } = Icons;

function NoticiaCard({ noticia, variant, index }) {
  if (!noticia) return null;

  if (variant === "hero") {
    return (
      <div
        className="noticia-card hero-card"
        style={{
          backgroundImage: `url(${noticia.imagen})`,
        }}
      >
        <div className="content">
          <h2 className="title">{noticia.titulo}</h2>
          <p className="summary">{noticia.resumen}</p>
          <div className="meta">
            <span>
              <MdHome /> Fuente: {noticia.fuente}
            </span>
            <span>
              <MdAccessTime /> Publicado:{" "}
              {new Date(noticia.fecha_publicacion).toLocaleDateString()}
            </span>
          </div>
          <div className="buttons">
            <button
              className="button-card"
              onClick={() => window.open(noticia.url, "_blank")}
            >
              Leer más <MdArrowOutward />
            </button>
            {noticia.mus_id && (
              <Link className="button-card" to={`/museos/${noticia.mus_id}`}>
                Ver museo <MdArrowOutward />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "main") {
    return (
      <div
        className="noticia-card main"
        style={{
          backgroundImage: `url(${noticia.imagen})`,
        }}
      >
        <div className="content">
          <span className="tag">FLASH INFORMATIVO</span>
          <div className="source-date">
            <span className="source">
              <MdHome /> {noticia.fuente}
            </span>
            <span className="date">
              <MdAccessTime />
              {new Date(noticia.fecha_publicacion).toLocaleDateString()}
            </span>
          </div>
          <h3 className="title">{noticia.titulo}</h3>

          <p className="summary">{noticia.resumen.substring(0, 100)}...</p>
          <div className="buttons">
            <button
              className="button-card"
              onClick={() => window.open(noticia.url, "_blank")}
            >
              Leer más <MdArrowOutward />
            </button>
            {noticia.mus_id && (
              <Link className="button-card" to={`/museos/${noticia.mus_id}`}>
                Ver museo <MdArrowOutward />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className="noticia-card featured">
        <div className="image-container">
          <img src={noticia.imagen} alt={noticia.titulo} loading="lazy" />
        </div>
        <div className="text-content">
          <div className="header-card">
            <span className="source-name">{noticia.fuente}</span>
            <span className="time-ago">
              {new Date(noticia.fecha_publicacion).toLocaleDateString()}
            </span>
          </div>
          <h3 className="title">{noticia.titulo}</h3>
          <p className="summary">{noticia.resumen.substring(0, 140)}...</p>
          <hr />
          <div className="buttons">
            <button
              className="button-card"
              onClick={() => window.open(noticia.url, "_blank")}
            >
              Leer más <MdArrowOutward />
            </button>
            {noticia.mus_id && (
              <Link className="button-card" to={`/museos/${noticia.mus_id}`}>
                Ver museo <MdArrowOutward />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isSpecialDark = index % 2 === 0;

  if (variant === "side") {
    return (
      <div className={`noticia-card side ${isSpecialDark ? "dark" : "light"}`}>
        <div className="text-content">
          <div className="source-date">
            <span className="source">
              <MdHome /> {noticia.fuente}
            </span>
            <span className="date">
              <MdAccessTime />
              {new Date(noticia.fecha_publicacion).toLocaleDateString()}
            </span>
          </div>
          <h3 className="title">{noticia.titulo}</h3>
          <p className="summary">{noticia.resumen.substring(0, 80)}...</p>
          <div className="buttons">
            <button
              className="button-card"
              onClick={() => window.open(noticia.url, "_blank")}
            >
              Leer más <MdArrowOutward />
            </button>
            {noticia.mus_id && (
              <Link className="button-card" to={`/museos/${noticia.mus_id}`}>
                Ver museo <MdArrowOutward />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`noticia-card standard ${isSpecialDark ? "dark" : "light"}`}
    >
      <div className="image-container">
        <img src={noticia.imagen} alt={noticia.titulo} loading="lazy" />
        <span className="source-name-tag">{noticia.fuente}</span>
      </div>
      <div className="text-content">
        <h3 className="title">{noticia.titulo}</h3>
        <p className="summary">{noticia.resumen.substring(0, 90)}...</p>
        <div className="footer-card">
          <div className="buttons">
            <button
              className="button-card"
              onClick={() => window.open(noticia.url, "_blank")}
            >
              Leer más <MdArrowOutward />
            </button>
            {noticia.mus_id && (
              <Link className="button-card" to={`/museos/${noticia.mus_id}`}>
                Ver museo <MdArrowOutward />
              </Link>
            )}
          </div>
          {noticia.fecha_publicacion && (
            <span className="date">
              <MdAccessTime />
              {new Date(noticia.fecha_publicacion).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoticiaCard;
