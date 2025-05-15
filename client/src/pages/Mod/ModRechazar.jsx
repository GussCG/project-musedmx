import { motion } from "framer-motion";
import Icons from "../../components/Other/IconProvider";
const { CgClose, IoIosArrowDown } = Icons;

function ModRechazar({ onClose }) {
  return (
    <motion.div
      className="bg-opaco-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <main className="mod-rechazar-main">
        <button className="close-button" type="button" onClick={onClose}>
          <CgClose />
        </button>
        <h1>Rechazar Reseña</h1>
        <div className="mod-rechazar-container">
          <div className="rechazo-select-container">
            <p>Seleccione el motivo del rechazo</p>
            <div className="select-wrapper">
              <select className="rechazo-select">
                <option value="1">Comentario inapropiado</option>
                <option value="2">Imágenes inapropiadas</option>
                <option value="3">Otro</option>
              </select>
              <IoIosArrowDown className="select-arrow-icon" />
            </div>
          </div>

          <textarea
            className="rechazo-textarea"
            placeholder="Escriba un comentario para el usuario"
            rows="8"
            cols="50"
            maxLength="500"
          />
        </div>
        <button type="button" className="button">
          Enviar
        </button>
      </main>
    </motion.div>
  );
}

export default ModRechazar;
