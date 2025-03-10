import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import HeaderMuseoButtons from "../../components/HeaderMuseoButtons";

import "../../styles/pages/MuseoDetails.scss";

import Icons from "../../components/IconProvider";

const iconosServicios = {
  Tienda: Icons.tiendaIcon,
  WiFi: Icons.wifiIcon,
  Guardarropa: Icons.guardarropaIcon,
  Biblioteca: Icons.bilbiotecaIcon,
  Estacionamiento: Icons.estacionamientoIcon,
  VisitaGuiada: Icons.visitaGuiadaIcon,
  ServicioMédico: Icons.medicoIcon,
  WC: Icons.banioIcon,
  SilladeRuedas: Icons.sillaRuedasIcon,
  Cafeteria: Icons.cafeteriaIcon,
  Elevador: Icons.elevadorIcon,
  Braille: Icons.brailleIcon,
  LenguajedeSenas: Icons.lenguajeDeSenasIcon,
};

const titulosServicios = {
  Tienda: "Tienda",
  WiFi: "WiFi",
  Guardarropa: "Guardarropa",
  Biblioteca: "Biblioteca",
  Estacionamiento: "Estacionamiento",
  VisitaGuiada: "Visita Guiada",
  ServicioMédico: "Servicio Médico",
  WC: "Baños",
  SilladeRuedas: "Silla de Ruedas",
  Cafeteria: "Cafetería",
  Elevador: "Elevador",
  Braille: "Braille",
  LenguajedeSenas: "Lenguaje de Señas",
};

const calificacionesConfig = {
  Edad: {
    promedio: 2.0,
    rubricas: [
      { valor: 3, titulo: "Para Adultos", icono: Icons.adultoIcon },
      { valor: 2, titulo: "Para toda la familia", icono: Icons.familiarIcon },
      { valor: 1, titulo: "Para Niños", icono: Icons.ninoIcon },
    ],
    width: 0,
  },
  Interesante: {
    promedio: 4.5,
    rubricas: [
      { valor: 5, titulo: "Muy Interesante", icono: Icons.dormirIcon },
      { valor: 4, titulo: "Interesante", icono: Icons.dormirIcon },
      { valor: 3, titulo: "Poco Interesante", icono: Icons.dormirIcon },
      { valor: 2, titulo: "Aburrido", icono: Icons.dormirIcon },
    ],
    width: 0,
  },
  Limpio: {
    promedio: 0.5,
    rubricas: [
      { valor: 1, titulo: "Limpio", icono: Icons.limpioIcon },
      { valor: 0.5, titulo: "Sucio", icono: Icons.limpioIcon },
    ],
    width: 0,
  },
  Entendible: {
    promedio: 0.75,
    rubricas: [
      { valor: 1, titulo: "Entendible", icono: Icons.entendibleIcon },
      { valor: 0.5, titulo: "Difícil", icono: Icons.entendibleIcon },
    ],
    witdh: 0,
  },
  Costo: {
    promedio: 2.5,
    rubricas: [
      { valor: 4, titulo: "Muy Caro", icono: Icons.moneyIcon },
      { valor: 3, titulo: "Caro", icono: Icons.moneyIcon },
      { valor: 2, titulo: "Barato", icono: Icons.moneyIcon },
      { valor: 1, titulo: "Gratis", icono: Icons.moneyIcon },
    ],
    width: 0,
  },
};

const getCalificaciones = (config) => {
  let data = { icono: null, titulo: "" };
  for (const rubrica of config.rubricas) {
    if (config.promedio >= rubrica.valor) {
      data.icono = rubrica.icono;
      data.titulo = rubrica.titulo;
      break;
    }
  }
  return data;
};

Object.keys(calificacionesConfig).forEach((calificacion) => {
  const data = getCalificaciones(calificacionesConfig[calificacion]);
  calificacionesConfig[calificacion].icono = data.icono;
  calificacionesConfig[calificacion].titulo = data.titulo;
  // Calcular el width de la barra de progreso
  calificacionesConfig[calificacion].width = (
    (calificacionesConfig[calificacion].promedio /
      calificacionesConfig[calificacion].rubricas[0].valor) *
    100
  ).toFixed(0);
  console.log(calificacionesConfig[calificacion]);
});

const {
  FaSquareFacebook,
  FaSquareXTwitter,
  FaSquareInstagram,
  FaFilter,
  webIcon,
  tematicaIcon,
  estrellaIcon,
} = Icons;

import museoPlaceholder from "../../assets/images/others/museo-main-1.jpg";

// Galeria de fotos Placeholder
import galeriaFoto1 from "../../assets/images/others/museo-main-1.jpg";
import galeriaFoto2 from "../../assets/images/others/museo-main-2.jpg";
import galeriaFoto3 from "../../assets/images/others/museo-main-3.jpg";
import galeriaFoto4 from "../../assets/images/others/museo-main-4.jpg";
import galeriaFoto5 from "../../assets/images/others/museo-main-5.jpg";

// Placeholder usuario
import placeholderUserImage from "../../assets/images/placeholders/user_placeholder.png";

import MenuFiltroResena from "../../components/MenuFiltroResena";
import LightBox from "../../components/LightBox";
import MapMuseoDetail from "../../components/MapMuseoDetail";
import MuseoSlider from "../../components/MuseoSlider";
import ImagenesSlider from "../../components/ImagenesSlider";

function MuseoDetail() {
  // Obtenemos el usuario para saber su tipo
  const { user, tipoUsuario, setIsLogginPopupOpen } = useAuth();

  // Estado para controlar la visibilidad del menu de filtro
  const [menuVisible, setMenuVisible] = useState(false);

  const abrirMenu = () => {
    setMenuVisible(true);
  };

  // Estado para controlar la visibilidad del lightbox
  const [lightBoxVisible, setLightBoxVisible] = useState(false);

  // Estado para controlar la imagen actual del lightbox
  const [currentImage, setCurrentImage] = useState("");

  const openLightBox = (e) => {
    if (e.target.src) {
      setCurrentImage(e.target.src);
      setLightBoxVisible(true);
    }
  };

  const { museoId } = useParams();

  const museoPrueba = {
    id: 1,
    nombre: "Museo de Prueba",
    horarios: {
      Lunes: "9:00 - 18:00",
      Martes: "9:00 - 18:00",
      Miercoles: "9:00 - 18:00",
      Jueves: "9:00 - 18:00",
      Viernes: "9:00 - 18:00",
      Sabado: "9:00 - 14:00",
      Domingo: "9:00 - 14:00",
    },
    img: galeriaFoto1,
    calificacion: 4,
    costo: 0,
    coords: {
      lat: 19.426111111111,
      lng: -99.186111111111,
    },
    distancia: 2.4,
    alcaldia: "Alcaldía de Prueba",
  };

  // Lista de museos para el slider
  // Se obtienen del modelo para obtener los museos que a otros usuarios les gustaron con base en el museo actual
  // De momento, se pondran valores de ejemplo
  const museosSimilares = {
    museoPrueba,
  };

  // Estado para los checkbox de favoritos
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteChange = () => {
    // if (!user) {
    //     navigate('/Auth/Iniciar')
    //     return
    // }

    // Lógica para agregar o quitar de favoritos en el backend
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="museo-detail">
      <MenuFiltroResena
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
      />
      <LightBox
        lightBoxVisible={lightBoxVisible}
        setLightBoxVisible={setLightBoxVisible}
        currentImage={currentImage}
      />
      <main id="museo-main">
        <section id="museo-section-1">
          <div className="museo-section-1-image">
            <img src={museoPlaceholder} alt="Museo" />
          </div>
          <div
            className={
              user && (user.tipoUsuario === 2 || user.tipoUsuario === 3)
                ? "museo-section-1-container-botones"
                : "museo-section-1-container"
            }
          >
            <div className="museo-section-1-info">
              <label className="museo-section-1-info-title">
                <h1>Museo</h1>
                <label className="museo-fav-button-container">
                  <input
                    type="checkbox"
                    name="museo-fav"
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
                  <span className="museo-fav-button-span"></span>
                </label>
              </label>
              <div className="museo-section-1-info-fundacion">
                <p>Se fundó 17-09-1964 </p>
              </div>
              <div className="museo-section-1-info-tematica">
                <h1>Temática</h1>
                <img src={tematicaIcon} alt="Tematica" />
              </div>
              <div className="museo-section-1-info-horarios">
                <h1>Horarios:</h1>
                <p>Lunes-Viernes: 9:00 - 18:00</p>
                <p>Sábado-Domingo: 9:00 - 14:00</p>
              </div>
            </div>
            {user && (user.tipoUsuario === 2 || user.tipoUsuario === 3) ? (
              <HeaderMuseoButtons />
            ) : (
              <div className="museo-section-1-csm">
                <div className="museo-section-1-csm-calificacion">
                  <p>4.5</p>
                  <img src={estrellaIcon} alt="Estrella" />
                </div>
                <div className="museo-section-1-csm-social-media">
                  <a href="#">
                    <FaSquareFacebook />
                  </a>
                  <a href="#">
                    <FaSquareXTwitter />
                  </a>
                  <a href="#">
                    <FaSquareInstagram />
                  </a>
                  <a href="#">
                    <img src={webIcon} alt="Página Web" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
        <section id="museo-section-2">
          <div className="museo-section-2-calificaciones">
            <h1 className="h1-section">Calificaciones</h1>
            <div className="museo-section-2-calificaciones-container">
              {Object.keys(calificacionesConfig).map((calificacion) => (
                <div className="calificacion-container" key={calificacion}>
                  <div className="calificacion-title">
                    <h2>{calificacion}</h2>
                  </div>
                  <div className="calificacion-icon">
                    <img
                      src={calificacionesConfig[calificacion].icono}
                      alt={calificacion}
                    />
                  </div>
                  <div
                    className="calificacion-graph-bar"
                    title={`${calificacionesConfig[calificacion].width}%`}
                  >
                    <div
                      className="calificacion-graph-bar-fill"
                      style={{
                        width: `${calificacionesConfig[calificacion].width}%`,
                      }}
                    ></div>
                  </div>
                  <p>{calificacionesConfig[calificacion].titulo}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="museo-section-2-servicios">
            <h1>Servicios</h1>
            <div className="servicios-container">
              {Object.keys(iconosServicios).map((servicio) => (
                <div className="servicio-icon" key={servicio}>
                  <img
                    src={iconosServicios[servicio]}
                    alt={servicio}
                    title={titulosServicios[servicio]}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="museo-section-2-descripcion">
            <h1>Descripción</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              varius sagittis mi, id scelerisque urna ultrices sed. Maecenas in
              lobortis ligula. Cras eleifend, felis nec porttitor vulputate, dui
              leo ornare erat, eget maximus enim dui nec leo. Cras tempus
              vestibulum magna non suscipit. Praesent posuere rhoncus neque sit
              amet scelerisque. Nunc id justo suscipit, pellentesque augue nec,
              molestie sapien. Sed id turpis eget turpis fermentum euismod a id
              enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Aenean varius sagittis mi, id scelerisque urna ultrices sed.
              Maecenas in lobortis ligula. Cras eleifend, felis nec porttitor
              vulputate, dui leo ornare erat, eget maximus enim dui nec leo.
              Cras tempus vestibulum magna non suscipit. Praesent posuere
              rhoncus neque sit amet scelerisque. Nunc id justo suscipit,
              pellentesque augue nec, molestie sapien. Sed id turpis eget turpis
              fermentum euismod a id enim. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Aenean varius sagittis mi, id
              scelerisque urna ultrices sed. Maecenas in lobortis ligula. Cras
              eleifend, felis nec porttitor vulputate, dui leo ornare erat, eget
              maximus enim dui nec leo. Cras tempus vestibulum magna non
              suscipit. Praesent posuere rhoncus neque sit amet scelerisque.
              Nunc id justo suscipit, pellentesque augue nec, molestie sapien.
              Sed id turpis eget turpis fermentum euismod a id enim.
            </p>
          </div>
          <div className="museo-section-2-ubicacion">
            <MapMuseoDetail museo={museoPrueba} />
          </div>
        </section>
        <section id="museo-section-3">
          <h1 className="h1-section">Galería de Fotos</h1>
          <div className="museo-section-3-galeria" onClick={openLightBox}>
            <div className="museo-galeria-foto" id="foto-1">
              <img src={galeriaFoto1} alt="Foto 1" className="gallery_img" />
            </div>
            <div className="museo-galeria-foto" id="foto-2">
              <img src={galeriaFoto2} alt="Foto 2" className="gallery_img" />
            </div>
            <div className="museo-galeria-foto" id="foto-3">
              <img src={galeriaFoto3} alt="Foto 3" className="gallery_img" />
            </div>
            <div className="museo-galeria-foto" id="foto-4">
              <img src={galeriaFoto4} alt="Foto 4" className="gallery_img" />
            </div>
            <div className="museo-galeria-foto" id="foto-5">
              <img src={galeriaFoto5} alt="Foto 5" className="gallery_img" />
            </div>
            <div className="museo-galeria-foto" id="foto-6">
              <img src={galeriaFoto1} alt="Foto 6" className="gallery_img" />
            </div>
          </div>
        </section>
        <section id="museo-section-4">
          <h1 className="h1-section">A otros usuarios también les gusto</h1>
          <MuseoSlider listaMuseos={museosSimilares} />
        </section>
        <section id="museo-section-5">
          <div className="museo-section-5-header">
            <h1 className="h1-section">Reseñas y Comentarios</h1>
            <button
              className="museos-header-section-right-button"
              onClick={abrirMenu}
            >
              <FaFilter />
            </button>
          </div>
          <div className="museo-section-5-crv">
            <div className="museo-section-5-calificacion">
              <h2>Calificación</h2>
              <div className="museo-calificaciones">
                <div className="museo-calif-prom">
                  <p>4.5</p>
                  <img src={estrellaIcon} alt="Estrella" />
                </div>
                <div className="museo-calif-linea"></div>
                <div className="museo-calif-grafica">
                  <div className="museo-calif-grafica-row">
                    <p>5</p>
                    <img src={estrellaIcon} alt="Estrella" />
                    <div
                      className="museo-calif-grafica-estrellas-fill"
                      id="museo-calif-grafica-5-estrellas-fill"
                    ></div>
                  </div>
                  <div className="museo-calif-grafica-row">
                    <p>4</p>
                    <img src={estrellaIcon} alt="Estrella" />
                    <div
                      className="museo-calif-grafica-estrellas-fill"
                      id="museo-calif-grafica-4-estrellas-fill"
                    ></div>
                  </div>
                  <div className="museo-calif-grafica-row">
                    <p>3</p>
                    <img src={estrellaIcon} alt="Estrella" />
                    <div
                      className="museo-calif-grafica-estrellas-fill"
                      id="museo-calif-grafica-3-estrellas-fill"
                    ></div>
                  </div>
                  <div className="museo-calif-grafica-row">
                    <p>2</p>
                    <img src={estrellaIcon} alt="Estrella" />
                    <div
                      className="museo-calif-grafica-estrellas-fill"
                      id="museo-calif-grafica-2-estrellas-fill"
                    ></div>
                  </div>
                  <div className="museo-calif-grafica-row">
                    <p>1</p>
                    <img src={estrellaIcon} alt="Estrella" />
                    <div
                      className="museo-calif-grafica-estrellas-fill"
                      id="museo-calif-grafica-1-estrellas-fill"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            {user?.tipoUsuario !== 2 && user?.tipoUsuario !== 3 ? (
              <div className="museo-section-5-registrar">
                <h2>¿Fuiste al museo?</h2>
                <Link
                  to={`/Museos/${museoId}/RegistrarVisita`}
                  className="button-reg-resena"
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      localStorage.setItem(
                        "redirectPath",
                        `/Museos/${museoId}/RegistrarVisita`
                      );
                      setIsLogginPopupOpen(true);
                    }
                  }}
                >
                  Registra tu visita aquí
                </Link>
              </div>
            ) : null}

            {user && user?.tipoUsuario === 3 ? (
              <div className="museo-section-5-registrar">
                <Link
                  to={`/${tipoUsuario}/VerResenas/${museoId}`}
                  // id="museo-section-5-registrar-button"
                  className="button-link"
                >
                  Ver las reseñas de este museo
                </Link>
              </div>
            ) : null}
          </div>
          <div className="museo-section-5-resenas">
            <div className="museo-section-5-resena">
              <div className="resena-foto-container">
                <img src={placeholderUserImage} alt="Usuario" />
              </div>
              <div className="resena-comentario-container">
                <div className="resena-comentario-header">
                  <p id="nombre-user">Nombre de Usuario</p>
                  <p id="fecha-resena">17-09-2021</p>
                  <div className="resena-calificacion">
                    <p>4</p>
                    <img src={estrellaIcon} alt="Estrella" />
                  </div>
                </div>
                <div className="resena-comentario-body">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec vel turpis aliquam odio condimentum convallis. In sit
                    amet ex eu ex varius pretium id a quam. Proin faucibus
                    turpis congue turpis ullamcorper, ac vehicula sapien
                    volutpat. Sed placerat justo vitae neque semper, ut posuere
                    lacus convallis. Curabitur consectetur a urna sit amet
                    rutrum. Maecenas finibus, purus eget ultricies feugiat,
                    lorem lacus sollicitudin enim, quis feugiat tellus lacus
                    quis augue. Nunc sollicitudin vestibulum erat, at
                    ullamcorper arcu finibus et. Fusce sollicitudin diam arcu,
                    sit amet dignissim ligula pulvinar id.
                  </p>
                  {/* Slider de imagenes */}
                  <ImagenesSlider />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MuseoDetail;
