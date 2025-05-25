import React from "react";
import { motion } from "framer-motion";
import Icons from "../../components/Other/IconProvider";
const { CgClose, IoIosArrowDown } = Icons;
import { DIAS_SEMANA } from "../../constants/catalog";
import useMuseoHorarios from "../../hooks/Museo/useMuseoHorarios";
import { useParams } from "react-router";

function AddDia({ onClose, horario, onAdded }) {
  const { addHorarioByDia } = useMuseoHorarios();
  const { museoId } = useParams();

  const diasDisponibles = DIAS_SEMANA.filter(
    (dia) => !horario.some((h) => h.mh_dia === dia)
  );

  const handleSubmit = async () => {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    const diasSeleccionados = Array.from(checkboxes).map(
      (checkbox) => checkbox.value
    );

    if (diasSeleccionados.length === 0) {
      alert("No se seleccionó ningún día");
      return;
    }

    // Usamos Promise.all por si addHorarioByDia es asíncrona
    await Promise.all(
      diasSeleccionados.map((dia) => addHorarioByDia(dia, museoId))
    );

    if (onAdded) onAdded();

    onClose();
  };

  return (
    <motion.div
      className="bg-opaco-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <main className="agregar-dias-main">
        <button className="close-button" type="button" onClick={onClose}>
          <CgClose />
        </button>
        <div className="agregar-dias-header">
          <h1>Agregar Días</h1>
          <p>Los días se crearán con datos vacíos</p>
        </div>
        {diasDisponibles.length === 0 ? (
          <div className="no-dias">
            <h2>Ya están todos los días agregados</h2>
          </div>
        ) : (
          <>
            <div className="registros-chks">
              <fieldset>
                <legend>Selecciona los días que quieres agregar</legend>

                <div className="dias-chks-container">
                  {DIAS_SEMANA.filter(
                    (dia) => !horario.some((h) => h.mh_dia === dia)
                  ).map((dia) => (
                    <div className="registros-chk" key={dia}>
                      <input type="checkbox" id={dia} name={dia} value={dia} />
                      <label htmlFor={dia}>{dia}</label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            <button type="button" className="button" onClick={handleSubmit}>
              Agregar
            </button>
          </>
        )}
      </main>
    </motion.div>
  );
}

export default AddDia;
