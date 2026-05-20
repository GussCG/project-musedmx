import React, { useRef } from "react";
import { useReviews } from "../../hooks/Resena/useReviews";
import ResenaCard from "../Comunidad/ResenaCard";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthProvider";

import Icons from "../Other/IconProvider";
import { useTheme } from "../../context/ThemeProvider";
import { TEMATICAS } from "../../constants/catalog";
const { MdKeyboardDoubleArrowRight } = Icons;

function ResenasRecientesMuseo({
  resenas,
  museoId,
  hasMore,
  loading,
  nextPage,
  museo,
}) {
  const { user, setIsLogginPopupOpen } = useAuth();
  const scrollContainerRef = useRef(null);

  const { isDarkMode } = useTheme();
  const colors = isDarkMode
    ? TEMATICAS[museo.tematica]?.museoCardColorsDark
    : TEMATICAS[museo.tematica]?.museoCardColorsLight;

  const handleMouseDown = (e) => {
    const slider = scrollContainerRef.current;
    slider.isDown = true;
    slider.classList.add("active");
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
  };

  const handleMouseLeave = () => {
    const slider = scrollContainerRef.current;
    slider.isDown = false;
  };

  const handleMouseUp = () => {
    const slider = scrollContainerRef.current;
    slider.isDown = false;
  };

  const handleMouseMove = (e) => {
    const slider = scrollContainerRef.current;
    if (!slider.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 2; // Velocidad de arrastre
    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;

    if (scrollLeft + clientWidth >= scrollWidth - 300) {
      if (hasMore && !loading) {
        console.log("Cargando página siguiente...");
        nextPage();
      }
    }
  };

  const handleAuthRedirect = (e, path) => {
    if (!user) {
      e.preventDefault();
      localStorage.setItem("redirectPath", path);
      setIsLogginPopupOpen(true);
    }
  };

  return (
    <section className="resenas-recientes museo">
      <div className="section-header">
        <div className="title-group">
          <h2>Reseñas Recientes</h2>
          <span className="scroll-hint">
            Desliza para ver más{" "}
            <MdKeyboardDoubleArrowRight color={colors?.text} />
          </span>
        </div>
      </div>

      <div
        className="resenas-horizontal-container"
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={scrollContainerRef}
        style={{
          "--thumb-color": colors?.text,
        }}
      >
        <div className={`resenas-grid items-${resenas.length}`}>
          {resenas.map((resena, index) => {
            const variantsPattern = [
              "featured",
              "minimal",
              "accent",
              "wide",
              "minimal",
              "accent",
              "featured",
              "minimal",
              "minimal",
              "wide",
              "accent",
            ];

            const variant = variantsPattern[index % variantsPattern.length];

            return (
              <ResenaCard
                key={resena.res_id_res}
                resena={resena}
                variant={variant}
                colors={colors}
              />
            );
          })}

          {!hasMore && (
            <>
              <Link
                to={`/Museos/${museoId}/RegistrarVisita`}
                className="resena-link"
                onClick={(e) =>
                  handleAuthRedirect(e, `/Museos/${museoId}/RegistrarVisita`)
                }
              >
                <div className="review-card cta-card secondary">
                  <div className="cta-content">
                    <h3>Únete a la conversación</h3>
                    <p>
                      Comparte tu experiencia en este museo y ayúdanos a crecer
                      nuestra comunidad.
                    </p>
                    <button className="cta-button">Escribir Reseña</button>
                  </div>
                </div>
              </Link>

              <Link
                className="resena-link"
                to={`/Museos/${museoId}/ContestarEncuesta`}
                onClick={(e) =>
                  handleAuthRedirect(e, `/Museos/${museoId}/ContestarEncuesta`)
                }
              >
                <div className="review-card cta-card ">
                  <div className="cta-content">
                    <h3>¿Ya visitaste el museo?</h3>
                    <p>
                      {" "}
                      Entonces responde esta encuesta para calificar el museo.
                    </p>
                    <button className="cta-button">Responder Encuesta</button>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default ResenasRecientesMuseo;
