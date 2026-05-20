import { useState } from "react";
import { useMuseosSimilares } from "../../hooks/Museo/useMuseosSimilares";
import { useMuseosCercanos } from "../../hooks/Museo/useMuseosCercanos";
import { useMuseosAsociados } from "../../hooks/Museo/useMuseosAsociados";
import NMuseoSlider from "./NMuseoSlider";

function MuseoSimilares({ museoId }) {
  const {
    museos: museosSimilares,
    loading: museosSimilaresLoading,
    error: museosSimilaresError,
  } = useMuseosSimilares({
    museoId: museoId,
    top_n: 10,
  });
  const {
    museos: museosCercanos,
    loading: museosCercanosLoading,
    error: museosCercanosError,
  } = useMuseosCercanos({
    museoId: museoId,
    top_n: 10,
  });
  const {
    museos: museosAsociados,
    loading: museosAsociadosLoading,
    error: museosAsociadosError,
  } = useMuseosAsociados({
    museoId: museoId,
    top_n: 10,
  });
  return (
    <section className="museo-detail-relacionados">
      <div className="section-header">
        <div className="title-group">
          <h2>Museos Relacionados</h2>
        </div>
      </div>

      <div className="museo-similares-item">
        <NMuseoSlider
          title="Similares"
          subtitle="Museos con temáticas o colecciones similares a este museo"
          museos={museosSimilares}
          isLoading={museosSimilaresLoading}
        />
      </div>
      <hr />
      <div className="museo-similares-item">
        <NMuseoSlider
          title="Cercanos"
          subtitle="Museos que están geográficamente cerca de este museo"
          museos={museosCercanos}
          isLoading={museosCercanosLoading}
        />
      </div>
      <hr />
      <div className="museo-similares-item">
        <NMuseoSlider
          title="Asociados"
          subtitle="Museos que usuarios que visitaron este museo también les gustaron"
          museos={museosAsociados}
          isLoading={museosAsociadosLoading}
        />
      </div>
      <div className="museo-similares-item"></div>
    </section>
  );
}

export default MuseoSimilares;
