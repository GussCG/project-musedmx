import { useState } from "react";
import { motion } from "framer-motion";

import userPlaceholder from "../assets/images/placeholders/user_placeholder.png";

import Icons from "../components/IconProvider";
const { corazonIcon, IoSearch, IoSettings } = Icons;

import MuseoSlider from "../components/MuseoSlider";
import { Link } from "react-router";
import QVSearch from "./QVSearch";

function UsuarioPage() {
  const [editMode, setEditMode] = useState(false);

  // Estos se obtendrían de la base de datos
  // De momento, se pondran valores de ejemplo

  const museoPrueba = {
    mus_id: 1,
    mus_nombre: "Museo de Prueba1",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "9:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "9:00 - 18:00",
      Viernes: "9:00 - 18:00",
      Sabado: "9:00 - 14:00",
      Domingo: "9:00 - 14:00",
    },
    mus_foto:
      "https://www.shutterstock.com/image-photo/san-francisco-california-usa-1-600nw-2424683443.jpg",
    mus_calificacion: 4,
    costo: 0,
    coords: {
      lat: 19.426111111111,
      lng: -99.186111111111,
    },
    mus_tematica: 5,
    mus_alcaldia: "Alcaldía de Prueba",
  };

  const museoPrueba2 = {
    mus_id: 2,
    mus_nombre: "Museo de Prueba2",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "9:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "9:00 - 18:00",
      Viernes: "9:00 - 18:00",
      Sabado: "9:00 - 14:00",
      Domingo: "9:00 - 14:00",
    },
    mus_foto: "https://i.ytimg.com/vi/tYI2eJZDHYQ/maxresdefault.jpg",
    mus_calificacion: 4,
    costo: 0,
    coords: {
      lat: 19.426111111111,
      lng: -99.186111111111,
    },
    mus_tematica: 2,
    mus_alcaldia: "Alcaldía de Prueba",
  };

  const museoPrueba3 = {
    mus_id: 3,
    mus_nombre: "Museo de Prueba3",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "9:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "9:00 - 18:00",
      Viernes: "9:00 - 18:00",
      Sabado: "9:00 - 14:00",
      Domingo: "9:00 - 14:00",
    },
    mus_foto:
      "https://th.bing.com/th/id/OIP.Dk9hzhtZz6ip3svewvBlGQHaEK?rs=1&pid=ImgDetMain",
    mus_calificacion: 4,
    costo: 0,
    coords: {
      lat: 19.426111111111,
      lng: -99.186111111111,
    },
    mus_tematica: 2,
    mus_alcaldia: "Alcaldía de Prueba",
  };

  const museoPrueba4 = {
    mus_id: 4,
    mus_nombre: "Museo de Prueba4",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "9:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "9:00 - 18:00",
      Viernes: "9:00 - 18:00",
      Sabado: "9:00 - 14:00",
      Domingo: "9:00 - 14:00",
    },
    mus_foto: "https://media.timeout.com/images/103167639/image.jpg",
    mus_calificacion: 4,
    costo: 0,
    coords: {
      lat: 19.426111111111,
      lng: -99.186111111111,
    },
    mus_tematica: 2,
    mus_alcaldia: "Alcaldía de Prueba",
  };

  const museosFavoritos = {
    museoPrueba,
    museoPrueba2,
    museoPrueba3,
    museoPrueba4,
  };

  // Estos se obtendrían de la base de datos
  // De momento, se pondran valores de ejemplo
  const museosQuieroVisitar = {
    museoPrueba,
    museoPrueba2,
    museoPrueba3,
    museoPrueba4,
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "0" }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.18 }}
    >
      <main id="perfil-main">
        <section className="perfil-section-museo perfil-section-item">
          <div className="section-header">
            <h2>Museos Sugeridos</h2>
          </div>
          <MuseoSlider listaMuseos={museosFavoritos} sliderType="Sugeridos" />
        </section>
        <hr />
        <section className="perfil-section-museo perfil-section-item">
          <div className="section-header">
            <h2>
              Museos Favoritos <img src={corazonIcon} id="corazon-icon" />
            </h2>
          </div>
          <MuseoSlider listaMuseos={museosFavoritos} sliderType="Favoritos" />
        </section>
        <hr />
        <section className="perfil-section-museo perfil-section-item">
          <div className="section-header">
            <h2>Museos que quiero visitar</h2>
            <div className="section-header-controller">
              <QVSearch />
              <button
                type="button"
                id="editar-button"
                onClick={() => setEditMode(!editMode)}
              >
                <span>{editMode ? "Salir" : "Editar"}</span>
              </button>
            </div>
          </div>
          <MuseoSlider
            listaMuseos={museosQuieroVisitar}
            editMode={editMode}
            sliderType="Quiero-visitar"
          />
        </section>
        <hr />
        <section className="perfil-section-museo perfil-section-item">
          <div className="section-header">
            <h2>Vistos Recientemente</h2>
          </div>
          <MuseoSlider listaMuseos={museosFavoritos} sliderType="Recientes" />
        </section>
      </main>
    </motion.div>
  );
}

export default UsuarioPage;
