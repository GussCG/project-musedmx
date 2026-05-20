import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function HeroNoticiaSkeleton() {
  return (
    <div className="noticia-card hero-card skeleton">
      {/* Background fake */}
      <div className="background-skeleton">
        <Skeleton height={400} borderRadius={20} />
      </div>

      {/* Overlay content */}
      <div className="content">
        {/* Título */}
        <Skeleton width="70%" height={35} />

        {/* Resumen */}
        <Skeleton width="90%" height={20} style={{ marginTop: 10 }} />
        <Skeleton width="85%" height={20} />
        <Skeleton width="60%" height={20} />

        {/* Meta */}
        <div style={{ marginTop: 15, display: "flex", gap: 20 }}>
          <Skeleton width={150} height={15} />
          <Skeleton width={180} height={15} />
        </div>

        {/* Botones */}
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <Skeleton width={120} height={35} borderRadius={20} />
          <Skeleton width={140} height={35} borderRadius={20} />
        </div>
      </div>
    </div>
  );
}

export default HeroNoticiaSkeleton;
