import React, { useState } from "react";

import userPlaceholder from "../assets/images/placeholders/user_placeholder.png";

import Icons from "../components/IconProvider";
const { corazonIcon, buscarIcon, editarIcon } = Icons;

import MuseoSlider from "../components/MuseoSlider";
import { Link } from "react-router";

function UsuarioPage() {
  const [editMode, setEditMode] = useState(false);

  // Estos se obtendrían de la base de datos
  // De momento, se pondran valores de ejemplo
  const museoEjemplo = {
    id: 1,
    nombre: "Museo de Historia Natural",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "10:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "10:00 - 18:00",
      Viernes: "10:00 - 18:00",
      Sabado: "10:00 - 18:00",
      Domingo: "13:00 - 18:00",
    },
    img: "../assets/images/others/museo-main-1.jpg",
    calificacion: 4,
    costo: 0,
    distancia: 4.5,
    alcaldia: "Cuauhtémoc",
  };

  const museoEjemplo2 = {
    id: 2,
    nombre: "Museo del Perfume",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "10:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "10:00 - 18:00",
      Viernes: "10:00 - 18:00",
      Sabado: "10:00 - 18:00",
      Domingo: "9:00 - 18:00",
    },
    img: "../assets/images/others/museo-main-2.jpg",
    calificacion: 5,
    costo: 2,
    distancia: 3.5,
    alcaldia: "Cuauhtémoc",
  };

  const museoEjemplo3 = {
    id: 3,
    nombre: "Museo del Castillo de Chapultepec",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "10:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "10:00 - 18:00",
      Viernes: "10:00 - 18:00",
      Sabado: "10:00 - 18:00",
      Domingo: "",
    },
    img: "../assets/images/others/museo-main-2.jpg",
    calificacion: 5,
    costo: 3,
    distancia: 2.5,
    alcaldia: "Cuauhtémoc",
  };

  const museoEjemplo4 = {
    id: 4,
    nombre: "Museo del Castillo de Chapultepec",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "10:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "10:00 - 18:00",
      Viernes: "10:00 - 18:00",
      Sabado: "10:00 - 18:00",
      Domingo: "",
    },
    img: "../assets/images/others/museo-main-2.jpg",
    calificacion: 5,
    costo: 3,
    distancia: 1.5,
    alcaldia: "Cuauhtémoc",
  };

  const museoEjemplo5 = {
    id: 5,
    nombre: "Museo del Castillo de Chapultepec",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "10:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "10:00 - 18:00",
      Viernes: "10:00 - 18:00",
      Sabado: "10:00 - 18:00",
      Domingo: "",
    },
    img: "../assets/images/others/museo-main-2.jpg",
    calificacion: 5,
    costo: 3,
    distancia: 0.5,
    alcaldia: "Cuauhtémoc",
  };

  const museosFavoritos = {
    museoEjemplo,
    museoEjemplo2,
    museoEjemplo3,
    museoEjemplo4,
    museoEjemplo5,
  };

  // Estos se obtendrían de la base de datos
  // De momento, se pondran valores de ejemplo
  const museosQuieroVisitar = {
    museoEjemplo,
    museoEjemplo2,
    museoEjemplo3,
    museoEjemplo4,
    museoEjemplo5,
  };

  return (
    <main id="perfil-main">
      <section className="perfil-section-museo">
        <div className="section-header">
          <h2>Museos Sugeridos</h2>
        </div>
        <MuseoSlider listaMuseos={museosFavoritos} />
      </section>
      <hr />
      <section className="perfil-section-museo">
        <div className="section-header">
          <h2>
            Museos Favoritos <img src={corazonIcon} id="corazon-icon" />
          </h2>
        </div>
        <MuseoSlider listaMuseos={museosFavoritos} />
      </section>
      <hr />
      <section className="perfil-section-museo">
        <div className="section-header">
          <h2>Museos que quiero visitar</h2>
          <div className="section-header-controller">
            {" "}
            <div className="nav-bar">
              <form>
                <button type="submit">
                  <img src={buscarIcon} alt="Buscar" />
                </button>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Buscar museo para agregar"
                />
              </form>
            </div>
            <button
              type="button"
              id="editar-button"
              onClick={() => setEditMode(!editMode)}
            >
              <img src={editarIcon} alt="Editar" />
            </button>
          </div>
        </div>
        <MuseoSlider listaMuseos={museosQuieroVisitar} editMode={editMode} />
      </section>
      <hr />
      <section className="perfil-section-museo">
        <div className="section-header">
          <h2>Vistos Recientemente</h2>
        </div>
        <MuseoSlider listaMuseos={museosFavoritos} />
      </section>
    </main>
  );
}

export default UsuarioPage;
