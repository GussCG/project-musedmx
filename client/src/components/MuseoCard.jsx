import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { motion } from "framer-motion";
// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buildImage } from "../utils/buildImage";
import imgPrueba from "../assets/images/others/museo-main-1.jpg";
import Icons from "./IconProvider";
const { estrellaIcon, moneyIcon, freeIcon, FaTrash, FaStar } = Icons;
import { TEMATICAS } from "../constants/catalog";
import Museo from "../models/Museo/Museo";
import { agruparHorarios } from "../utils/agruparHorarios";

export default function MuseoCard({ museo, editMode, sliderType }) {
  // Prefijo unico basado en sliderType
  const layoutPrefix = sliderType ? `${sliderType}-` : ``;
  // Para obtener el usuario autenticado pero aun no se ha implementado el backend
  const { user, setIsLogginPopupOpen } = useAuth();
  const navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);
  // Estado para los checkbox de favoritos
  const [isFavorite, setIsFavorite] = useState(false);

  // Eliminar un museo de Quiero Visitar
  const handleQVDelete = (id) => {
    // Lógica para eliminar el museo de Quiero Visitar en el backend
    try {
      // Eliminar el museo de la lista
      toast.success(`${museoInfo.nombre} eliminado de la lista`, {
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

  const handleFavoriteChange = () => {
    // if (!user) {
    //     navigate('/Auth/Iniciar')
    //     return
    // }

    // Lógica para agregar o quitar de favoritos en el backend
    setIsFavorite(!isFavorite);
  };

  // Para obtener los museos del backend
  const museoInfo = new Museo(museo);

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
    if (museoInfo.costo === 0) {
      return <img src={freeIcon} alt="Costo" key="gratis" />;
    } else {
      return Array.from({ length: museoInfo.costo }, (_, index) => (
        <img src={moneyIcon} alt="Costo" key={index} />
      ));
    }
  };

  const tema = TEMATICAS[museoInfo.tematica];

  return (
    <motion.div
      className="museo-card"
      layoutId={`${layoutPrefix}museo-card-${museoInfo.id}`}
      key={`${layoutPrefix}card-${museoInfo.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: tema.museoCardColors.background,
      }}
    >
      <div className="museo-card-img-container">
        {editMode ? (
          <div className="museo-card-delete-container">
            <button type="button" onClick={() => handleQVDelete(museoInfo.id)}>
              <FaTrash />
            </button>
          </div>
        ) : (
          <label className="museo-card-fav-button-container">
            <input
              type="checkbox"
              name="museo-fav"
              className="museo-card-fav-button"
              checked={isFavorite}
              onChange={
                user
                  ? handleFavoriteChange
                  : () => {
                      localStorage.setItem(
                        "redirectPath",
                        window.location.pathname
                      );
                      setIsLogginPopupOpen(true);
                    }
              }
            />
            <span className="museo-card-fav-button-span"></span>
          </label>
        )}
        <Link
          to={`/Museos/${museoInfo.id}`}
          onClick={(e) => {
            e.preventDefault();
            setTimeout(() => navigate(`/Museos/${museoInfo.id}`), 0);
          }}
        >
          <motion.img
            src={buildImage(museoInfo)}
            alt={museoInfo.nombre}
            className="museo-card-img"
            layoutId={`${layoutPrefix}museo-image-${museoInfo.id}`}
            key={`${layoutPrefix}img-${museoInfo.id}`}
            title={museoInfo.nombre}
          />

          <div className="museo-card-img-rating">
            <p id="museo-card-rating">{museoInfo.calificacion}</p>
            <FaStar
              style={{
                fill: tema.museoCardColors.backgroundImage,
              }}
            />
          </div>
          <div
            className="museo-card-img-tematica"
            style={{ backgroundColor: tema.museoCardColors.header }}
          >
            <h2>{TEMATICAS[museoInfo.tematica].nombre}</h2>
          </div>
        </Link>
      </div>
      <div className="museo-card-info-container">
        <div className="museo-card-info-header">
          <Link
            to={`/Museos/${museoInfo.id}`}
            onClick={(e) => {
              e.preventDefault();
              setTimeout(() => navigate(`/Museos/${museoInfo.id}`), 0);
            }}
          >
            <h2
              id="museo-card-nombre"
              style={{ color: tema.museoCardColors.header }}
            >
              {museoInfo.nombre}
            </h2>
          </Link>
          <p
            id="museo-card-alcaldia"
            style={{ color: tema.museoCardColors.text }}
          >
            {museoInfo.alcaldia}
          </p>
        </div>
        <div className="museo-card-info-body">
          <div className="museo-card-info-body-item">
            <p
              className="semibold"
              style={{ color: tema.museoCardColors.header }}
            >
              Horarios:
            </p>
            {horariosAgrupados.map((horario, index) => (
              <p
                key={`${horario}-${index}`}
                style={{ color: tema.museoCardColors.text }}
              >
                {horario}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
