import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
import { SERVICIOS, TEMATICAS } from "../../constants/catalog";
import { formatearDireccion } from "../../utils/formatearDireccionVista";
import MuseosMapView from "../../pages/Museo/MuseosMapView";

function MuseoHUS({ museo, horarios, servicios, ubicacion, MuseosCercanos }) {
  const { isDarkMode } = useTheme();

  const colors = isDarkMode
    ? TEMATICAS[museo.tematica]?.museoCardColorsDark
    : TEMATICAS[museo.tematica]?.museoCardColorsLight;

  const [hoy, setHoy] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    const hoy = new Date()
      .toLocaleDateString("es-MX", {
        weekday: "long",
        timeZone: "America/Mexico_City",
      })
      .toLowerCase();
    setHoy(hoy);

    if (horarios?.length) {
      const index = horarios.findIndex(
        (horario) => horario.dia.toLowerCase() === hoy,
      );

      setKey((prevKey) => prevKey + 1);
    }
  }, [horarios]);

  return (
    <section className="museo-hus">
      <div className="hus-horarios-servicios">
        <div className="hus-horarios">
          <h3>Horarios de Visita</h3>
          {horarios?.length === 0 && (
            <p className="no-values">No hay horarios disponibles</p>
          )}
          {horarios?.length > 0 && (
            <ul className="horarios-list">
              {horarios.map((horario, index) => {
                const esHoy = horario.dia.toLowerCase() === hoy;

                return (
                  <li
                    key={index}
                    className={`horario-item ${esHoy ? "hoy" : ""}`}
                    style={{
                      borderColor: esHoy ? colors.backgroundImage : "",
                      backgroundColor: esHoy ? colors.background : "",
                    }}
                  >
                    <span
                      className="horario-dia"
                      style={{
                        color: esHoy ? colors.text : "",
                      }}
                    >
                      {horario.dia}
                      {esHoy && <span className="hoy-indicator"> (hoy)</span>}
                    </span>
                    <span
                      className="horario-hora"
                      style={{ color: esHoy ? colors.text : "" }}
                    >
                      {horario.hora_inicio.slice(0, 5)} -{" "}
                      {horario.hora_fin.slice(0, 5)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="hus-servicios">
          <h3>Servicios</h3>
          {Object.values(servicios).length === 0 ? (
            <p className="no-values">
              No se han calificado servicios del museo
            </p>
          ) : (
            <div className="servicios-grid">
              {Object.entries(servicios).map(([id, datos]) => {
                const infoExtendida = SERVICIOS[id];
                if (!infoExtendida) return null;

                const opacidadValor = parseFloat(datos.opacidad);
                const mostrarServicio = opacidadValor >= 0.75;

                if (!mostrarServicio) return null;

                return (
                  <div
                    key={id}
                    className="servicio-item"
                    style={{ backgroundColor: colors.background }}
                  >
                    <div className="icon-window">
                      <img
                        src={infoExtendida.icon}
                        alt={infoExtendida.nombre}
                        style={{
                          filter: `drop-shadow(26px 0 0 ${colors.text})`,
                        }}
                      />
                    </div>
                    <span>{infoExtendida.nombre}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="hus-ubicacion">
        <div className="hus-header">
          <h3>Ubicación</h3>
          <p className="location">{formatearDireccion(ubicacion)}</p>
        </div>
        <MuseosMapView
          MuseosMostrados={[ubicacion]}
          MuseosCercanos={MuseosCercanos}
          zoom={15}
          tipo={5}
        />
      </div>
    </section>
  );
}

export default MuseoHUS;
