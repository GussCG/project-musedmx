import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import NavBarMenu from "../components/NavBarMenu";
import Footer from "../components/Footer";
import MuseosList from "../pages/Museo/MuseosList";
import MuseoEdit from "../pages/Museo/MuseoEdit";
import MuseoDetail from "../pages/Museo/MuseoDetail";
import RegistroVisita from "../pages/Museo/RegistroVisita";

import "../styles/pages/VerMuseosLayout.scss";

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
  distancia: 3.5,
  costo: 0,
  coords: {
    lat: 19.420458,
    lng: -99.182228,
  },
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
  distancia: 2.5,
  costo: 2,
  coords: {
    lat: 19.432608,
    lng: -99.133209,
  },
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
  calificacion: 1,
  distancia: 1.5,
  costo: 3,
  coords: {
    lat: 19.42847,
    lng: -99.18129,
  },
};

const MuseosMostrados = [museoEjemplo, museoEjemplo2, museoEjemplo3];

function VerMuseosLayout() {
  return (
    <div>
      <NavBarMenu />
      <Outlet />
      <Footer />
    </div>
  );
}

function VerMuseosRoutes() {
  return (
    <Routes>
      <Route element={<VerMuseosLayout />}>
        <Route
          index
          element={
            <MuseosList
              titulo="Todos los museos"
              MuseosMostrados={MuseosMostrados}
              tipo="1"
            />
          }
        />
        <Route
          path="CercaDeMi"
          element={
            <MuseosList
              titulo="Museos cerca de mi"
              MuseosMostrados={MuseosMostrados}
              tipo="2"
            />
          }
        />
        <Route
          path="Populares"
          element={
            <MuseosList
              titulo="Museos populares"
              MuseosMostrados={MuseosMostrados}
              tipo="3"
            />
          }
        />
        <Route path=":museoId" element={<MuseoDetail />} />

        <Route path=":museoId/RegistrarVisita" element={<RegistroVisita />} />

        <Route path="/EditarInformacion/:museoId" element={<MuseoEdit />} />
      </Route>
    </Routes>
  );
}

export { VerMuseosLayout };
export default VerMuseosRoutes;
