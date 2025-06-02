import { Routes, Route, Outlet } from "react-router-dom";
import NavBarMenu from "../components/Other/NavBarMenu";
import Footer from "../components/Other/Footer";
import MuseosList from "../pages/Museo/MuseosList";
import MuseoDetail from "../pages/Museo/MuseoDetail";
import RegistroVisita from "../pages/Museo/RegistroVisita";
import "../styles/pages/VerMuseosLayout.scss";
import MuseoEncuesta from "../pages/Museo/MuseoEncuesta";

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
          element={<MuseosList titulo="Todos los museos" tipo="1" />}
        />
        <Route
          path="CercaDeMi"
          element={<MuseosList titulo="Museos cerca de mi" tipo="2" />}
        />
        <Route
          path="Populares"
          element={<MuseosList titulo="Museos populares" tipo="3" />}
        />

        <Route
          path="Busqueda"
          element={<MuseosList titulo="Resultados de la búsqueda" tipo="4" />}
        />

        <Route path=":museoId" element={<MuseoDetail />} />

        <Route path=":museoId/RegistrarVisita" element={<RegistroVisita />} />
        <Route path=":museoId/ContestarEncuesta" element={<MuseoEncuesta />} />
      </Route>
    </Routes>
  );
}

export { VerMuseosLayout };
export default VerMuseosRoutes;
