import { createContext, useState, useContext, useEffect } from "react";

const UserLocationContext = createContext();

export const UserLocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    userLocation: null,
    mapCenter: null,
  });

  useEffect(() => {
    const successCallback = (position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      setLocation((prev) => ({
        ...prev,
        userLocation: newLocation,
        mapCenter: newLocation,
      }));
    };

    const errorCallback = (error) => {
      console.error("Error al obtener la ubicación del usuario:", error);
      if (error.code === error.PERMISSION_DENIED) {
        alert("Por favor, permite el acceso a tu ubicación.");
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        alert("No se pudo obtener tu ubicación. Intenta de nuevo.");
      } else if (error.code === error.TIMEOUT) {
        alert("La solicitud de geolocalización ha excedido el tiempo límite.");
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.error("La geolocalización no está disponible en este navegador.");
    }
  }, []);

  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => useContext(UserLocationContext);
