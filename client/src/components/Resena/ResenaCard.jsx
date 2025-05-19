import React from "react";
import placeholderUserImage from "../../assets/images/placeholders/user_placeholder.png";
import ImagenesSlider from "../../components/Resena/ImagenesSlider";
import Icons from "../Other/IconProvider";
const { FaStar } = Icons;
import useResena from "../../hooks/Resena/useResena";
import LoadingIndicator from "../Other/LoadingIndicator";

function ResenaCard({ idResena }) {
  const { resena, loading: loadingResena, error } = useResena(idResena);

  return (
    <>
      {loadingResena && <LoadingIndicator />}

      <div className="resena-card">
        <div className="resena-foto-container">
          <img src={placeholderUserImage} alt="Usuario" />
        </div>
        <div className="resena-comentario-container">
          <div className="resena-comentario-header">
            <div className="nombre-calif-container">
              <p id="nombre-user">Juan Pérez</p>

              <div className="resena-calificacion">
                {Array.from(
                  { length: resena[0]?.res_calif_estrellas },
                  (_, i) => (
                    <FaStar key={i} />
                  )
                )}
              </div>
            </div>
            <p id="fecha-resena">17-09-2024</p>
          </div>
          <div className="resena-comentario-body">
            {loadingResena ? (
              <LoadingIndicator />
            ) : (
              <p>{resena[0]?.res_comentario || ""}</p>
            )}
            {/* Slider de imagenes */}
            {/* {fotosResena && <ImagenesSlider listaImagenes={fotosResena} />} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResenaCard;
