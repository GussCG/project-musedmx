import React from "react";
import Skeleton from "react-loading-skeleton";

function MuseoCardSliderSkeleton() {
  return (
    <div style={{ marginBottom: "20px", width: "100%" }}>
      <Skeleton height={450} borderRadius={30} />

      <div style={{ marginTop: "15px" }}>
        <Skeleton width={30} height={15} />
        <Skeleton width={"90%"} height={20} style={{ marginTop: "10px" }} />
        <Skeleton width={"80%"} height={20} style={{ marginTop: "10px" }} />
      </div>
    </div>
  );
}

export default MuseoCardSliderSkeleton;
