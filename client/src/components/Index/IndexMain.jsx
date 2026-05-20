import React from "react";
import MuseumSearch from "../Museo/MuseumSearch";
import { useTheme } from "../../context/ThemeProvider";

import lightImage from "../../assets/images/others/museo-index-main-light.jpg";
import darkImage from "../../assets/images/others/museo-index-main-dark.png";

function IndexMain() {
  const { isDarkMode } = useTheme();
  const gradient = isDarkMode
    ? "radial-gradient(circle at bottom left, rgba(18, 18, 18, 1) 0%, rgba(18, 18, 18, 0.8) 25%, rgba(18, 18, 18, 0) 60%)"
    : "radial-gradient(circle at bottom left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 25%, rgba(255, 255, 255, 0) 60%)";

  const image = isDarkMode ? darkImage : lightImage;

  return (
    <section
      className="index-main"
      style={{
        backgroundImage: `${gradient}, url(${image})`,
      }}
    >
      <div className="index-main-content">
        <p className="index-main-subtitle">DESCUBRE LA CIUDAD DE MÉXICO</p>
        <h1 className="index-main-title">
          Explora la <br />
          <b>cultura</b>
          <br />
          <i>a tu manera</i>
        </h1>

        <MuseumSearch />

        <p className="index-museum-name">Museo Tamayo</p>
      </div>
    </section>
  );
}

export default IndexMain;
