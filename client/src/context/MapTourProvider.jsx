import { createContext, useContext, useEffect } from "react";
import { driver as createDriver } from "driver.js";
import "driver.js/dist/driver.css";

const MapTourContext = createContext();

const getDriverSteps = () => [
  {
    element: "#map-museos",
    popover: {
      title: "Mapa de Museos",
      description:
        "En este mapa podrás ver la ubicación de los museos disponibles. Haz clic en un museo para obtener más información.",
      position: "left",
    },
  },
  {
    element: "#btn-map-user-location",
    popover: {
      title: "Ayuda",
      description:
        "Haz clic aquí si tienes dudas sobre cómo usar la aplicación.",
      position: "bottom",
    },
  },
  {
    element: "#btn-map-get-location",
    popover: {
      title: "Ubicación del Usuario",
      description: "Haz clic aquí para activar tu ubicación",
      position: "bottom",
    },
  },
  {
    element: "#dd-travel-mode",
    popover: {
      title: "Modo de Viaje",
      description:
        "Selecciona el modo de viaje que prefieras para ver las rutas hacia los museos.",
      position: "bottom",
    },
  },
  {
    element: "#dd-map-type",
    popover: {
      title: "Tipo de Mapa",
      description:
        "Elige el tipo de mapa que prefieras para visualizar los museos.",
      position: "bottom",
    },
  },
  {
    element: "#museum-search",
    popover: {
      title: "Búsqueda de Museos",
      description:
        "Utiliza la barra de búsqueda para encontrar museos por nombre, palabras clave o temáticas.",
      position: "bottom",
    },
  },
  {
    element: "#ver-museos",
    popover: {
      title: "Ver Museos",
      description: "Haz clic aquí para ver la lista de museos disponibles.",
      position: "bottom",
    },
  },
  {
    element: "#ver-cerca-de-mi",
    popover: {
      title: "Museos Cercanos",
      description: "Haz clic aquí para ver los museos cercanos a tu ubicación.",
      position: "bottom",
    },
  },
  {
    element: "#ver-populares",
    popover: {
      title: "Museos Populares",
      description: "Haz clic aquí para ver los museos mejor calificados.",
      position: "bottom",
    },
  },
  {
    element: "#ver-lista",
    popover: {
      title: "Lista de Museos",
      description:
        "Haz clic aquí para ver la lista de museos en formato lista.",
      position: "bottom",
    },
  },
];

const createMapDriver = () =>
  createDriver({
    progressText: "Paso {{current}} de {{total}}",
    showProgress: true,
    animate: true,
    opacity: 0.75,
    allowClose: true,
    overlayClickNext: true,
    doneBtnText: "Finalizar",
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    steps: getDriverSteps(),
    popoverClass: "map-tour-popover",
  });

export const MapTourProvider = ({ children }) => {
  // Tour manual, no guarda en localStorage
  const startTour = () => {
    const driver = createMapDriver();
    driver.drive();
  };

  // Tour automático, solo si no se ha mostrado antes
  const startAutoTour = () => {
    const alreadyShown = localStorage.getItem("dontShowMapTour") === "true";
    if (!alreadyShown) {
      const driver = createMapDriver();
      driver.drive();
      localStorage.setItem("dontShowMapTour", "true");
    }
  };

  return (
    <MapTourContext.Provider value={{ startTour, startAutoTour }}>
      {children}
    </MapTourContext.Provider>
  );
};

export const useMapTour = () => useContext(MapTourContext);
