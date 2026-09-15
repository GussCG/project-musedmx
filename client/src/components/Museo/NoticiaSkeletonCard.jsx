import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function NoticiaSkeletonCard({ isMain }) {
  return (
    <div
      className={`noticia-skeleton ${isMain ? "main" : "side"}`}
      style={{
        width: "100%",
        height: "100%",
        minHeight: isMain ? "350px" : "120px",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      {isMain ? (
        <div
          style={{ height: "100%", minHeight: "350px", position: "relative" }}
        >
          <Skeleton
            height={"100%"}
            containerClassName="avatar-skeleton"
            borderRadius={20}
            baseColor="#838383"
            highlightColor="#999999"
            style={{ minHeight: "350px" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              width: "calc(100% - 40px)",
              zIndex: 2,
            }}
          >
            <Skeleton width={80} height={18} />
            <Skeleton width={"90%"} height={24} style={{ marginTop: 10 }} />
            <Skeleton width={"60%"} height={16} style={{ marginTop: 8 }} />
          </div>
        </div>
      ) : (
        <div style={{ height: "100%", minHeight: "120px" }}>
          <Skeleton
            height={"100%"}
            borderRadius={20}
            baseColor="#838383"
            highlightColor="#999999"
            style={{ minHeight: "120px" }}
          />
        </div>
      )}
    </div>
  );
}

export default NoticiaSkeletonCard;
