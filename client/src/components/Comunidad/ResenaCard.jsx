import React from "react";
import Icons from "../Other/IconProvider";
import TimeAgo from "react-timeago";
import esStrings from "react-timeago/lib/language-strings/es";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const { FaStar, FaQuoteRight } = Icons;
const formatter = buildFormatter(esStrings);

function ResenaCard({ resena, variant = "standard", colors = {} }) {
  return (
    <div
      className={`review-card ${variant}`}
      style={{
        backgroundColor: variant === "accent" ? colors?.background : "",
      }}
    >
      <div className="card-header">
        <div className="user-info">
          <img
            src={resena.foto_perfil || "/default-avatar.png"}
            alt={resena.nombre_usuario}
          />
          <div className="user-meta">
            <span className="username">{resena.nombre_usuario}</span>
            <span className="location">Visitó el {resena.nombre_museo}</span>
          </div>
        </div>
      </div>

      <div className="rating-stars">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={
              i < resena.res_calif_estrellas ? "star-filled" : "star-empty"
            }
            color={i < resena.res_calif_estrellas ? colors.text : ""}
          />
        ))}
      </div>

      <p
        className="review-text"
        style={{ color: variant === "accent" ? colors?.text : "" }}
      >
        {variant === "featured" ? (
          <em>"{resena.res_comentario}"</em>
        ) : (
          `"${resena.res_comentario}"`
        )}
      </p>

      <div className="card-footer">
        <span className="timestamp">
          Publicado{" "}
          <TimeAgo date={resena.visitas_vi_fechahora} formatter={formatter} />
        </span>
        {variant === "minimal" && (
          <span className="user-name">
            - {resena.nombre_usuario.split(" ")[0]}{" "}
            {resena.nombre_usuario.split(" ").length > 1
              ? resena.nombre_usuario.split(" ")[1].charAt(0) + "."
              : ""}
          </span>
        )}
        {variant === "featured" && (
          <FaQuoteRight className="quote-icon" color={colors?.text} />
        )}
        {variant === "accent" && (
          <div className="user-initial-container">
            <span
              className="user-initial"
              style={{
                backgroundColor: colors?.header,
                color: colors?.background,
              }}
            >
              {resena.nombre_usuario.charAt(0)}
            </span>
            <div className="name-location">
              <span className="user-name">{resena.nombre_usuario}</span>
              <span className="user-location">{resena.nombre_museo}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResenaCard;
