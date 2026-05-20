import React from "react";
import { useReviews } from "../../hooks/Resena/useReviews";
import ResenaCard from "./ResenaCard";

function ResenasRecientes() {
  const { reviews, loading, error } = useReviews();

  console.log("Reseñas obtenidas:", reviews);

  if (error) return null;

  return (
    <section className="resenas-recientes">
      <div className="section-header">
        <div className="title-group">
          <span className="tagline">RESEÑAS RECIENTES</span>
          <h2>Voces de la Curaduría</h2>
        </div>
      </div>

      <div className={`resenas-grid items-${reviews.length}`}>
        {reviews.map((resena, index) => {
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
            />
          );
        })}
      </div>
    </section>
  );
}

export default ResenasRecientes;
