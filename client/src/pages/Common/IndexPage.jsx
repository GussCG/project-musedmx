import { useEffect } from "react";
import { changeBackgroundImage } from "../../utils/index-main";

import "../../styles/pages/IndexPage.scss";
import { Link } from "react-router-dom";

import NavBarMenu from "../../components/NavBarMenu";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthProvider";

function IndexPage() {
  const { user, tipoUsuario } = useAuth();

  useEffect(() => {
    changeBackgroundImage();

    // La función se ejecutará cada 5 segundos
    const intervalId = setInterval(changeBackgroundImage, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <NavBarMenu />
      <NavBar />
      <main id="index-main">
        <p id="index-main-nombre-museo"></p>
        <div id="index-main-bg"></div>
        <div id="index-main-container">
          <h1 id="index-main-text">
            Encuentra los museos perfectos para ti en CDMX
          </h1>
          <Link
            to={user ? `/${tipoUsuario}` : `/Auth/Iniciar`}
            id="index-main-button"
          >
            Comenzar
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default IndexPage;
