import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function HeroNoticiaSkeleton() {
  return (
    <div className="noticia-card hero-card skeleton">
      <div className="content">
        <Skeleton width="50%" height={35} />

        <Skeleton width="80%" height={20} style={{ marginTop: 10 }} />
        <Skeleton width="70%" height={20} />
        <Skeleton width="60%" height={20} />

        <div style={{ marginTop: 15, display: "flex", gap: 20 }}>
          <Skeleton width={100} height={15} />
          <Skeleton width={100} height={15} />
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <Skeleton width={120} height={35} borderRadius={20} />
          <Skeleton width={140} height={35} borderRadius={20} />
        </div>
      </div>
    </div>
  );
}

export default HeroNoticiaSkeleton;
