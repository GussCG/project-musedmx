import React from "react";
import Icons from "../Other/IconProvider";
import NoticiaCard from "../Museo/NoticiaCard";
import NoticiaCardSkeleton from "../Museo/NoticiaSkeletonCard";
import { Link } from "react-router";
import { useNoticias } from "../../hooks/Noticias/useNoticias";

const { MdArrowOutward } = Icons;

function IndexNoticias() {
  const { noticias, loading } = useNoticias();

  return (
    <section className="index-noticias">
      <div className="index-noticias-header">
        <Link to="/Noticias">
          <span className="index-noticias-title">
            <h2>Noticias Recientes</h2>
            <MdArrowOutward title="Ver todas" />
          </span>
        </Link>
      </div>

      <div className="index-noticias-grid">
        {loading ? (
          <>
            <NoticiaCardSkeleton isMain={true} />
            <NoticiaCardSkeleton isMain={false} />
            <NoticiaCardSkeleton isMain={false} />
          </>
        ) : noticias && noticias.length > 0 ? (
          noticias
            .slice(0, 3)
            .map((noticia, index) => (
              <NoticiaCard
                key={noticia.url}
                noticia={noticia}
                variant={index === 0 ? "main" : "side"}
                index={index}
              />
            ))
        ) : (
          <div className="no-noticias-message">
            <p>No hay noticias para mostrar.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default IndexNoticias;
