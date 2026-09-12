import Skeleton from "react-loading-skeleton";

function MuseoCardSliderSkeleton() {
  return (
    <div className="museo-card-skeleton">
      <div className="skeleton-image-wrapper">
        <Skeleton borderRadius={20} className="skeleton-image" />
      </div>

      <div className="skeleton-content">
        <Skeleton width="40%" height={12} className="skeleton-tematica" />
        <Skeleton width="85%" height={22} className="skeleton-titulo" />
        <Skeleton width="60%" height={14} className="skeleton-ubicacion" />
      </div>
    </div>
  );
}

export default MuseoCardSliderSkeleton;
