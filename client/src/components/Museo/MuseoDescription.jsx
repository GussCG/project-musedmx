import { TEMATICAS } from "../../constants/catalog";
import { useTheme } from "../../context/ThemeProvider";

function MuseoDescription({ museo, calificaciones }) {
  const { isDarkMode } = useTheme();

  const colors = isDarkMode
    ? TEMATICAS[museo.tematica]?.museoCardColorsDark
    : TEMATICAS[museo.tematica]?.museoCardColorsLight;

  return (
    <section className="museo-description">
      <div className="description">
        <h2>Sobre el Recinto</h2>
        <p>{museo?.descripcion}</p>
      </div>

      <div className="resenas-summary">
        <h3>Puntuación del Público</h3>
        {Object.values(calificaciones).length === 0 ? (
          <p className="no-values">Se de los primeros en calificar el museo</p>
        ) : (
          <div className="resenas-summary-details">
            {Object.values(calificaciones).map((c) => (
              <div key={c.id} className="resena-rubro-item">
                <div
                  className="rubro-icon"
                  style={{ backgroundColor: colors.background }}
                >
                  <img
                    src={c.icono}
                    alt={c.nombre}
                    style={{
                      filter: isDarkMode ? "invert(100%)" : "none",
                    }}
                  />
                </div>
                <div className="rubro-label">{c.titulo}</div>
                <div className="rubro-rating" style={{ color: colors.text }}>
                  {c.width}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MuseoDescription;
