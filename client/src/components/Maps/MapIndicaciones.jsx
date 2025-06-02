import { useState } from "react";
import Icons from "../Other/IconProvider";
const { museoIcon, FaPerson, IoClose } = Icons;
import { AnimatePresence, motion } from "framer-motion";
import { useMapTour } from "../../context/MapTourProvider";

function MapIndicaciones({ isOpen, onClose }) {
  const { startTour } = useMapTour();
  const [dontShowAgain, setDontShowAgain] = useState(
    localStorage.getItem("dontShowMapIndicaciones") === "true"
  );

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("dontShowMapIndicaciones", "true");
    } else {
      localStorage.removeItem("dontShowMapIndicaciones");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-opaco-blur"
        >
          <main id="main-map-indicaciones">
            <button id="close-login-popup" onClick={handleClose}>
              <IoClose />
            </button>
            <h1>Instrucciones</h1>
            <div id="map-indicaciones-warn" className="map-indicaciones-item">
              <h2>Advertencias</h2>
              <p>
                Para que el mapa cargue correctamente, debe estar activada la
                opción{" "}
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Aceleración por hardware
                </span>{" "}
                en el navegador. Para ver como activarla{" "}
                <a
                  target="_blank"
                  href="https://doc.milestonesys.com/2023r3/es-ES/standard_features/sf_mc/sf_mcnodes/sf_3devices/mc_enableordisablehardwareacceleration_devices.htm?TocPath=XProtect%20Productos%20VMS%7CXProtect%20Administrador%20manual%20VMS%7CConfiguraci%C3%B3n%7CDispositivos%20-%20Detecci%C3%B3n%20de%20movimiento%7C_____3"
                >
                  click aquí
                </a>
                .
              </p>
              <p>
                El mapa también puede presentar problemas de carga dependiendo
                de la conexión del dispositivo.
              </p>
            </div>
            <div id="map-indicaciones-list" className="map-indicaciones-item">
              <h2>Indicaciones</h2>
              <ul>
                <li>
                  Si{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    No
                  </span>{" "}
                  permitiste obtener la ubicación o hubo algun error, puedes
                  ingresar una dirección, código postal o un lugar en el botón
                  de cambiar de ubicación.
                </li>
                <li>
                  En la barra de búsqueda puedes buscar el museo que quieras o
                  museos por palabra clave.
                </li>
                <li>
                  Da click en el símbolo de{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Museo
                  </span>{" "}
                  para más información.
                </li>
                <li>
                  Si estas en{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Cerca de mí
                  </span>{" "}
                  puedes agrandar el rango de búsqueda.
                </li>
              </ul>
            </div>
            <div
              id="map-indicaciones-simbolos"
              className="map-indicaciones-item"
            >
              <h2>Símbolos en el mapa</h2>
              <div className="map-indicaciones-simbolo-container">
                <div className="map-indicaciones-simbolo">
                  <div className="custom-marker simbolo">
                    <div className="marker-container">
                      <img
                        src={museoIcon}
                        alt="Museo"
                        className="custom-marker-image"
                      />
                    </div>

                    <div className="marker-tail-border" />
                    <div className="marker-tail" />
                  </div>
                  <p>Museo</p>
                </div>
                <div className="map-indicaciones-simbolo">
                  <div className="user-marker simbolo">
                    <FaPerson />
                  </div>
                  <p>Mi Ubicación</p>
                </div>
              </div>
            </div>
            <div className="map-indicaciones-mostrar">
              <label htmlFor="switch-label-mostrar">No volver a mostrar</label>
              <div className="switch-button-dm">
                <input
                  type="checkbox"
                  name="switch-label"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  id="switch-label-mostrar"
                  className="switch-button__checkbox"
                />
                <label
                  htmlFor="switch-label-mostrar"
                  className="switch-button__label"
                >
                  <span className="switch-button-slider"></span>
                </label>
              </div>
            </div>
            <div className="map-indicaciones-botones">
              <button
                className="button"
                id="map-indicaciones-close"
                onClick={handleClose}
              >
                Entendido
              </button>
              <button
                className="button"
                id="map-indicaciones-close"
                onClick={() => {
                  handleClose();
                  setTimeout(() => {
                    startTour();
                  }, 300);
                }}
              >
                Ver Tour
              </button>
            </div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MapIndicaciones;
