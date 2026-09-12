import Skeleton from "react-loading-skeleton";

function MuseoCardSliderSkeleton() {
  return (
    <div style={{ marginBottom: "20px", width: "100%" }}>
      <Skeleton height={350} borderRadius={20} />

      <div style={{ marginTop: "15px" }}>
        <Skeleton width={30} height={15} style={{ marginLeft: "10px" }} />
        <Skeleton
          width={"90%"}
          height={20}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        />
        <Skeleton
          width={"80%"}
          height={20}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        />
      </div>
    </div>
  );
}

export default MuseoCardSliderSkeleton;
