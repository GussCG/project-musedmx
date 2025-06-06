import { motion } from "framer-motion";
import Icons from "../../components/Other/IconProvider";
import { useState } from "react";
import ToastMessage from "../../components/Other/ToastMessage";
import { useResenaMods } from "../../hooks/Resena/useResenaMods";
import { useParams, useNavigate } from "react-router-dom";
import { MOTIVOS_RECHAZO } from "../../constants/catalog";
const { CgClose, IoIosArrowDown } = Icons;

function ModRechazar({ onClose }) {
  const [motivo, setMotivo] = useState("1");
  const [comentario, setComentario] = useState("");
  const { rechazarResena } = useResenaMods();

  const { resId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!motivo || !comentario) {
      ToastMessage({
        tipo: "error",
        mensaje: "Por favor, complete todos los campos.",
      });
      return;
    }

    if (comentario.trim().length < 10) {
      ToastMessage({
        tipo: "error",
        mensaje: "El comentario debe tener al menos 10 caracteres.",
      });
      return;
    }

    const data = {
      motivo: MOTIVOS_RECHAZO[motivo]?.nombre || "Otro",
      comentario,
    };

    try {
      const response = await rechazarResena(
        resId,
        data.motivo,
        data.comentario
      );
      if (response) {
        ToastMessage({
          tipo: "success",
          mensaje: "Reseña rechazada exitosamente, se notificará al usuario.",
        });
        navigate("/Mod/VerResenas");
      } else {
        ToastMessage({
          tipo: "error",
          mensaje: "Error al rechazar la reseña. Inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error al rechazar la reseña:", error);
      ToastMessage({
        tipo: "error",
        mensaje: "Error al rechazar la reseña. Inténtalo de nuevo más tarde.",
      });
      return;
    }
  };
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
              <select
                className="rechazo-select"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              >
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
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>
        <button type="button" className="button" onClick={handleSubmit}>
          Enviar
        </button>
      </main>
    </motion.div>
  );
}

export default ModRechazar;
