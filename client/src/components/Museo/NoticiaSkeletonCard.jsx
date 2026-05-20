import React from "react";
import Skeleton from "react-loading-skeleton";

function NoticiaSkeletonCard({ isMain }) {
  return (
    <div className={`noticia-skeleton ${isMain ? "main" : "side"}`}>
      {isMain ? (
        <div style={{ height: "100%", position: "relative" }}>
          <Skeleton
            height={"100%"}
            borderRadius={25}
            baseColor="#838383"
            highlightColor="#999999"
          />
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 20,
              width: "80%",
            }}
          >
            <Skeleton width={100} height={20} />
            <Skeleton width={"100%"} height={30} style={{ marginTop: 10 }} />
            <Skeleton width={"60%"} height={20} style={{ marginTop: 10 }} />
          </div>
        </div>
      ) : (
        <div style={{ height: "100%" }}>
          <Skeleton
            height={"100%"}
            borderRadius={15}
            baseColor="#838383"
            highlightColor="#999999"
          />
        </div>
      )}
    </div>
  );
}

export default NoticiaSkeletonCard;
