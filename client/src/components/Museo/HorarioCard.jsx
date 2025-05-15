import { formatearHora } from "../../utils/formatearFechas";
import ReactFlipCard from "reactjs-flip-card";

function HorarioCard({ horario, hoy }) {
  return (
    <div
      className={`horario-card ${
        horario.mh_dia.toLowerCase() === hoy ? "hoy" : ""
      } ${
        horario.mh_hora_inicio === "00:00:00" ||
        horario.mh_hora_fin === "00:00:00"
          ? "cerrado"
          : ""
      }`}
    >
      <h2>{horario.mh_dia}</h2>
      {horario.mh_hora_inicio === "00:00:00" ||
      horario.mh_hora_fin === "00:00:00" ? (
        <p className="cerrado">CERRADO</p>
      ) : (
        <>
          <div className="horario-container-item-horario">
            <p>
              {formatearHora(horario.mh_hora_inicio)} -{" "}
              {formatearHora(horario.mh_hora_fin)}
            </p>
          </div>
        </>
      )}

      {horario.mh_dia.toLowerCase() === hoy && (
        <div className="horario-container-today">
          <p>Hoy</p>
        </div>
      )}
    </div>
  );
}

function PrecioCard({ horario, hoy }) {
  const {
    mh_hora_inicio,
    mh_hora_fin,
    mh_precio_ad,
    mh_precio_est,
    mh_precio_ni,
    mh_precio_ter,
  } = horario;

  const estaCerrado =
    mh_hora_inicio === "00:00:00" && mh_hora_fin === "00:00:00";

  const aceptaDonativos =
    !estaCerrado &&
    [(mh_precio_ad, mh_precio_ni, mh_precio_est, mh_precio_ter)].every(
      (p) => p === "-1"
    );

  // Si todos los precios son 0, entonces es gratis
  const todoGratis =
    !estaCerrado &&
    [mh_precio_ad, mh_precio_ni, mh_precio_est, mh_precio_ter].every(
      (p) => p === "0"
    );

  return (
    <div
      className={`horario-card precio ${
        horario.mh_dia.toLowerCase() === hoy ? "hoy" : ""
      } ${estaCerrado ? "cerrado" : ""} ${todoGratis ? "gratis" : ""} `}
    >
      <h2>Precios</h2>
      {estaCerrado ? (
        <p className="cerrado">CERRADO</p>
      ) : aceptaDonativos ? (
        <p className="donativo">Entrada libre. Se aceptan donativos.</p>
      ) : (
        <div className="horario-container-item-precios">
          {mh_precio_ad !== "-1" && (
            <div className="horario-container-item-precio">
              <b>Adultos -</b>
              <p>{mh_precio_ad === "0" ? "Gratis" : "$" + mh_precio_ad}</p>
            </div>
          )}
          {mh_precio_ni !== "-1" && (
            <div className="horario-container-item-precio">
              <b>Niños -</b>
              <p>{mh_precio_ni === "0" ? "Gratis" : "$" + mh_precio_ni}</p>
            </div>
          )}
          {mh_precio_est !== "-1" && (
            <div className="horario-container-item-precio">
              <b>Estudiantes -</b>
              <p>{mh_precio_est === "0" ? "Gratis" : "$" + mh_precio_est}</p>
            </div>
          )}
          {mh_precio_ter !== "-1" && (
            <div className="horario-container-item-precio">
              <b>Tercera edad -</b>
              <p>{mh_precio_ter === "0" ? "Gratis" : "$" + mh_precio_ter}</p>
            </div>
          )}
        </div>
      )}

      {horario.mh_dia.toLowerCase() === hoy && (
        <div className="horario-container-today">
          <p>Hoy</p>
        </div>
      )}
    </div>
  );
}

function HorarioPrecioCard({ horario, hoy }) {
  return (
    <ReactFlipCard
      frontComponent={<HorarioCard horario={horario} hoy={hoy} />}
      backComponent={<PrecioCard horario={horario} hoy={hoy} />}
      direction="horizontal"
      flipTrigger="onClick"
      flipCardStyle={{
        transition: "transform 0.8s",
      }}
    />
  );
}

export default HorarioPrecioCard;
