import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
// Toastify
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import estrellaIcon from "../assets/icons/estrella-icon.png";
import moneyIcon from "../assets/icons/money-icon.png";
import freeIcon from "../assets/icons/free-icon.png";
import eliminarIcon from "../assets/icons/eliminar-icon.png";

import imgPrueba from "../assets/images/others/museo-main-1.jpg";
import PopUpLogin from "./PopUpLogin";

export default function MuseoCard({ museo, editMode }) {
  // Para obtener el usuario autenticado pero aun no se ha implementado el backend
  const { user, setIsLogginPopupOpen } = useAuth();
  // const {user} = useAuth()

  const navigate = useNavigate();

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
  const museoInfo = {
    id: museo.id,
    nombre: museo.nombre,
    horarios: museo.horarios,
    img: museo.img,
    calificacion: museo.calificacion,
    costo: museo.costo,
  };

  // Funcion para agrupar los horarios por dia
  const agruparHorarios = () => {
    let horariosAgrupados = {};
    let diasSemana = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo",
    ];

    // Se obtienen los horarios del museo de forma {Dia:Horario}
    let horariosArray = Object.entries(museoInfo.horarios);

    // Agrupamos los dias que tienen el mismo horario
    horariosArray.forEach(([dia, horario]) => {
      if (horariosAgrupados[horario]) {
        horariosAgrupados[horario].push(dia);
      } else {
        horariosAgrupados[horario] = [dia];
      }
    });

    // Ordenar los dias en el orden correcto de la semana
    Object.keys(horariosAgrupados).forEach((horario) => {
      horariosAgrupados[horario].sort(
        (a, b) => diasSemana.indexOf(a) - diasSemana.indexOf(b)
      );
    });

    // Formatear el resultado
    let resultado = Object.entries(horariosAgrupados)
      .map(([horario, dias]) => {
        // Si no tiene horario, no se muestra
        if (horario === "") {
          return "";
        }

        if (dias.length === 1) {
          return `${dias[0]}: ${horario}`;
        } else {
          let agrupados = [];
          let tempGroup = [dias[0]];

          // Agrupar los dias consecutivos
          for (let i = 1; i < dias.length; i++) {
            let diaActual = dias[i];
            let diaAnterior = dias[i - 1];

            if (
              diasSemana.indexOf(diaActual) ===
              diasSemana.indexOf(diaAnterior) + 1
            ) {
              tempGroup.push(diaActual);
            } else {
              agrupados.push(tempGroup);
              tempGroup = [diaActual];
            }
          }
          agrupados.push(tempGroup);

          // Formatear la salida correctamente
          return (
            agrupados
              .map((grupo) => {
                return grupo.length === 1
                  ? `${grupo[0]}`
                  : `${grupo[0]} - ${grupo[grupo.length - 1]}`;
              })
              .join(", ") + `: ${horario}`
          );
        }
      })
      .join("\n");

    return resultado.split("\n");
  };
  const horarios = agruparHorarios();

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

  return (
    <>
      <div className="museo-card">
        <div className="museo-card-img-container">
          {editMode ? (
            <label className="museo-card-fav-button-container">
              <button
                type="button"
                onClick={() => handleQVDelete(museoInfo.id)}
              >
                <img src={eliminarIcon} alt="Eliminar" />
              </button>
            </label>
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
          <img
            src={imgPrueba}
            alt={museoInfo.nombre}
            className="museo-card-img"
          />
          <div className="museo-card-info-header-rating">
            <p id="museo-card-rating">{museoInfo.calificacion}</p>
            <img
              src={estrellaIcon}
              alt="Estrella"
              className="museo-card-star"
            />
          </div>
        </div>
        <div className="museo-card-info-container">
          <div className="museo-card-info-header">
            <Link to={`/Museos/${museoInfo.id}`} id="museo-card-nombre">
              {museoInfo.nombre}
            </Link>
          </div>
          <div className="museo-card-info-body">
            <div className="museo-card-info-body-horario">
              {horarios.map((horario, index) => (
                <p key={`${horario}-${index}`}>{horario}</p>
              ))}
            </div>
            <div className="museo-card-info-body-costo">
              {/* Dependiendo el numero se ponen signos de peso */}
              {costoImagen()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
