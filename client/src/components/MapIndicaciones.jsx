import { useState } from "react";

import Icons from "./IconProvider";
const { museoIcon, FaPerson, IoClose } = Icons;

import { AnimatePresence, motion } from "framer-motion";

function MapIndicaciones() {
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  return (
    <AnimatePresence>
      {isPopupOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-opaco-blur"
        >
          <main id="main-map-indicaciones">
            <button
              id="close-login-popup"
              onClick={() => {
                setIsPopupOpen(false);
              }}
            >
              <IoClose />
            </button>
            <h1>Instrucciones</h1>
            <div id="map-indicaciones-warn" className="map-indicaciones-item">
              <h2>Advertencias</h2>
              <p>
                Para que el mapa cargue correctamente, debe estar activada la
                opción <b>Aceleración por hardware</b> en el navegador. Para ver
                como activarla{" "}
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
                  Si <b>No</b> permitiste obtener la ubicación, puedes ingresar
                  tu dirección en la barra de búsqueda.
                </li>
                <li>
                  En la barra de búsqueda también puedes buscar el museo que
                  quieras en el mapa.
                </li>
                <li>
                  Da click en el símbolo de <b>Museo</b> para más información.
                </li>
                <li>
                  Si estas en <b>Cerca de mi</b> puedes agrandar el rango de
                  búsqueda.
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
            <button
              className="button"
              id="map-indicaciones-close"
              onClick={() => setIsPopupOpen(false)}
            >
              {" "}
              Entendido{" "}
            </button>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MapIndicaciones;
