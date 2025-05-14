import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { motion } from "framer-motion";
// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buildImage } from "../utils/buildImage";
import Icons from "./IconProvider";
const { moneyIcon, freeIcon, FaTrash, FaStar } = Icons;
import { TEMATICAS } from "../constants/catalog";
import { agruparHorarios } from "../utils/agruparHorarios";
import FavoritoButton from "./FavoritoButton";

export default function MuseoCard({ museo, editMode, sliderType }) {
  // Prefijo unico basado en sliderType
  const layoutPrefix = sliderType ? `${sliderType}-` : ``;
  // Para obtener el usuario autenticado pero aun no se ha implementado el backend
  const { user, setIsLogginPopupOpen } = useAuth();
  const navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);
  // Eliminar un museo de Quiero Visitar
  const handleQVDelete = (id) => {
    // Lógica para eliminar el museo de Quiero Visitar en el backend
    try {
      // Eliminar el museo de la lista
      toast.success(`${museo.nombre} eliminado de la lista`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error al eliminar el museo de Quiero Visitar", error);
    }
  };

  // De prueba
  const horarios = {
    Lunes: "10:00 - 18:00",
    Martes: "10:00 - 18:00",
    Miercoles: "10:00 - 18:00",
    Jueves: "10:00 - 18:00",
    Viernes: "10:00 - 18:00",
    Sabado: "10:00 - 18:00",
    Domingo: "",
  };

  const horariosAgrupados = agruparHorarios(horarios);

  // Funcion para devolver la imagen de costo dependiendo del numero
  const costoImagen = () => {
    if (museo.costo === 0) {
      return <img src={freeIcon} alt="Costo" key="gratis" />;
    } else {
      return Array.from({ length: museo.costo }, (_, index) => (
        <img src={moneyIcon} alt="Costo" key={index} />
      ));
    }
  };

  return (
    <>
      {museo.tematica && (
        <motion.div
          className="museo-card"
          layoutId={`${layoutPrefix}museo-card-${museo.id}`}
          key={`${layoutPrefix}card-${museo.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
          style={{
            backgroundColor:
              TEMATICAS[museo.tematica].museoCardColors.background,
          }}
        >
          <div className="museo-card-img-container">
            {editMode ? (
              <div className="museo-card-delete-container">
                <button type="button" onClick={() => handleQVDelete(museo.id)}>
                  <FaTrash />
                </button>
              </div>
            ) : (
              <FavoritoButton />
            )}
            <Link
              to={`/Museos/${museo.id}`}
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => navigate(`/Museos/${museo.id}`), 0);
              }}
            >
              <motion.img
                src={buildImage(museo)}
                alt={museo.nombre}
                className="museo-card-img"
                layoutId={`${layoutPrefix}museo-image-${museo.id}`}
                key={`${layoutPrefix}img-${museo.id}`}
                title={museo.nombre}
              />

              <div className="museo-card-img-rating">
                <p id="museo-card-rating">{museo.calificacion || 4}</p>
                <FaStar
                  style={{
                    fill: TEMATICAS[museo.tematica].museoCardColors
                      .backgroundImage,
                  }}
                />
              </div>
              <div
                className="museo-card-img-tematica"
                style={{
                  backgroundColor:
                    TEMATICAS[museo.tematica].museoCardColors.header,
                }}
              >
                {museo.tematica && <h2>{TEMATICAS[museo.tematica].nombre}</h2>}
              </div>
            </Link>
          </div>
          <div className="museo-card-info-container">
            <div className="museo-card-info-header">
              <Link
                to={`/Museos/${museo.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setTimeout(() => navigate(`/Museos/${museo.id}`), 0);
                }}
              >
                <h2
                  id="museo-card-nombre"
                  style={{
                    color: TEMATICAS[museo.tematica].museoCardColors.header,
                  }}
                >
                  {museo.nombre}
                </h2>
              </Link>
              <p
                id="museo-card-alcaldia"
                style={{
                  color: TEMATICAS[museo.tematica].museoCardColors.text,
                }}
              >
                {museo.alcaldia}
              </p>
            </div>
            <div className="museo-card-info-body">
              <div className="museo-card-info-body-item">
                <p
                  className="semibold"
                  style={{
                    color: TEMATICAS[museo.tematica].museoCardColors.header,
                  }}
                >
                  Horarios:
                </p>
                {horariosAgrupados.map((horario, index) => (
                  <p
                    key={`${horario}-${index}`}
                    style={{
                      color: TEMATICAS[museo.tematica].museoCardColors.text,
                    }}
                  >
                    {horario}
                  </p>
                ))}
              </div>
              <div className="museo-card-info-body-tematica">
                <img src={TEMATICAS[museo.tematica].icon} alt="Tematica" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
