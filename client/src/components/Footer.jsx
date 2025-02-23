import { Link } from "react-router";

import logo from "../assets/images/placeholders/logo_placeholder.png";
import facebookLogo from "../assets/icons/facebook-w-icon.png";
import instagramLogo from "../assets/icons/instagram-w-icon.png";
import twitterLogo from "../assets/icons/twitter-icon.png";

function Footer() {
  return (
    <footer>
      <div className="footer-info-container">
        <div id="footer-logo" className="footer-div">
          <Link to="/">
            <img src={logo} alt="Logo®" />
          </Link>
        </div>
        <div id="footer-museos-menu" className="footer-div">
          <div className="footer-div-container">
            <p className="footer-title">Ver Museos</p>
            <ul>
              <li>
                <Link to="/Museos">Todos los museos</Link>
              </li>
              <li>
                <Link to="/Museos/Populares">Populares</Link>
              </li>
              <li>
                <Link to="/Museos/CercaDeMi">Cerca de mi</Link>
              </li>
            </ul>
          </div>
        </div>
        <div id="footer-nosotros" className="footer-div">
          <div className="footer-div-container">
            <p className="footer-title">Nosotros</p>
            <ul>
              <li>
                <a href="#">
                  <div className="footer-social-media">
                    <img src={facebookLogo} alt="Facebook" />
                    <p>Facebook</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="#">
                  <div className="footer-social-media">
                    <img src={instagramLogo} alt="Instagram" />
                    <p>Instagram</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="#">
                  <div className="footer-social-media">
                    <img src={twitterLogo} alt="Twitter" />
                    <p>Twitter</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div id="footer-contacto" className="footer-div">
          <div className="footer-div-container">
            <p className="footer-title">Contáctenos</p>
            <p id="footer-contacto-p">musedmxof@musedmx.com</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="footer-copyright-container">
        <p>©MuseDMX. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
