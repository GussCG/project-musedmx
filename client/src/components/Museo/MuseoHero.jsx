import { createElement } from "react";
import { TEMATICAS, REDES_SOCIALES } from "../../constants/catalog";

import Icons from "../Other/IconProvider";
import { useTheme } from "../../context/ThemeProvider";
import { procesarHorarioActual } from "../../utils/horarioUtils";
import parseCalificacion from "../../utils/parseCalificacion";
import ScrollIndicator from "../Other/ScrollIndicator";

const { FaStar, IoMdTime, FaMoneyBills } = Icons;

function MuseoHero({ museo, redesSociales, horario }) {
  const { isDarkMode } = useTheme();

  const colors = isDarkMode
    ? TEMATICAS[museo.tematica]?.museoCardColorsDark
    : TEMATICAS[museo.tematica]?.museoCardColorsLight;

  const infoHoy = procesarHorarioActual(horario);

  if (!museo) return null;

  return (
    <section
      className="hero museo-detail"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%), url(${museo.img})`,
      }}
    >
      <div className="museo-info-container">
        <div className="museo-pretitle">
          <span
            className="museo-tematica"
            style={{ backgroundColor: colors?.header || "#000" }}
          >
            {TEMATICAS[museo?.tematica]?.nombre}
          </span>
          •<span className="museo-ubicacion">{museo?.alcaldia}</span>
        </div>
        <h1 className="museo-title">{museo?.nombre}</h1>
        <div className="museo-redes-sociales">
          {redesSociales?.map((red) => (
            <a
              key={red.id}
              href={red.link}
              target="_blank"
              rel="noopener noreferrer"
              className="museo-section-1-csm-icon"
              title={REDES_SOCIALES[red.nombre]?.nombre}
              style={{
                "--hover-color": colors?.text,
              }}
            >
              {createElement(REDES_SOCIALES[red?.nombre]?.icon)}
            </a>
          ))}
        </div>
        <div className="museo-info-rate-reviews">
          <span className="museo-rate">
            <FaStar />
            {parseCalificacion(museo.mus_calificacion).toFixed(1) || "N/A"}
          </span>
          <span className="museo-reviews">
            ({museo?.total_resenias} reseñas)
          </span>
        </div>
      </div>

      {infoHoy && (
        <div className="n-search-container">
          <div className="item-container">
            <div
              className="item-icon"
              style={{ backgroundColor: colors.background }}
            >
              <IoMdTime fill={colors.text} />
            </div>
            <div className="item-text">
              <span className="item-title">Estado actual</span>
              <span className="item-value">{infoHoy.textoEstado}</span>
            </div>
          </div>

          <div
            className="divider"
            style={{
              backgroundColor: colors.text,
            }}
          ></div>

          <div className="item-container">
            <div
              className="item-icon"
              style={{ backgroundColor: colors.background }}
            >
              <FaMoneyBills fill={colors.text} />
            </div>
            <div className="item-text">
              <span className="item-title">
                {infoHoy.aceptaDonativos ? "Entrada" : "Desde"}
              </span>
              <span className="item-value">
                {infoHoy.aceptaDonativos ? "Donativo" : infoHoy.precioDesde}
              </span>
            </div>
          </div>
        </div>
      )}
      <ScrollIndicator color={colors?.header} />
    </section>
  );
}

export default MuseoHero;
