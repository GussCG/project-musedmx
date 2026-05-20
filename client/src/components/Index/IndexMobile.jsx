import React from "react";
import Icons from "../Other/IconProvider";
const { MuseDMXLogo, FaGooglePlay, IoLogoAppleAppstore } = Icons;

import mobileMockup from "../../assets/images/placeholders/mobile-mockup.png";

function IndexMobile() {
  return (
    <section className="index-mobile">
      <div className="index-mobile-content">
        <h2 className="title">Lleva los museos en tu bolsillo</h2>
        <p className="description">
          Descarga la app de{" "}
          <img src={MuseDMXLogo} alt="MuseDMX Logo" className="logo-inline" />.
          Una experiencia nativa impecable con nuevas funciones exclusivas para
          tu dispositivo móvil. Explora y disfruta de los museos como nunca
          antes.
        </p>

        <div className="app-links">
          <a
            href="https://apps.apple.com/app/musedmx/id1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="app-store"
          >
            <span className="link-msg">
              <IoLogoAppleAppstore />
              <div className="msg">
                <span className="download">Consiguelo en</span>
                <span>App Store</span>
              </div>
            </span>
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.musedmx.app"
            target="_blank"
            rel="noopener noreferrer"
            className="play-store"
          >
            <span className="link-msg">
              <FaGooglePlay />
              <div className="msg">
                <span className="download">Disponible en</span>
                <span>Google Play</span>
              </div>
            </span>
          </a>
        </div>
      </div>
      <div className="index-mobile-render">
        <img src={mobileMockup} alt="App Preview" />
      </div>
    </section>
  );
}

export default IndexMobile;
