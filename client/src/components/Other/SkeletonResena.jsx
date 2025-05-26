import Skeleton from "react-loading-skeleton";

function SkeletonResena() {
  return (
    <>
      <div className="resena-card">
        <div className="resena-foto-container">
          <Skeleton width={50} height={50} circle={true} />
        </div>
        <div className="resena-comentario-container">
          <div className="resena-comentario-header">
            <div className="nombre-calif-container">
              <div className="left-header">
                <p id="nombre-user">
                  <Skeleton width={100} />
                </p>

                <div className="resena-calificacion">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      width={20}
                      height={20}
                      circle={true}
                      style={{ marginRight: "5px" }}
                    />
                  ))}
                </div>
              </div>

              <div className="resena-servicios">
                {[...Array(3)].map((_, index) => (
                  <Skeleton
                    key={index}
                    width={30}
                    height={30}
                    circle={true}
                    style={{ marginRight: "5px" }}
                  />
                ))}
              </div>
            </div>
            <p id="fecha-resena">
              <Skeleton width={80} />
            </p>
          </div>
          <div className="resena-comentario-body">
            <Skeleton count={4} />
          </div>
        </div>
      </div>
    </>
  );
}

export default SkeletonResena;
