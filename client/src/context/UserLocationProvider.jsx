import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthProvider";

const UserLocationContext = createContext();

export const UserLocationProvider = ({ children }) => {
  const { user } = useAuth();
  const [location, setLocation] = useState({
    userLocation: null,
    mapCenter: null,
  });

  // Cargar desde localStorage si ya hay ubicación guardada
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      const parsed = JSON.parse(savedLocation);
      setLocation({
        userLocation: parsed,
        mapCenter: parsed,
      });
    }
  }, []);

  // Guardar ubicación si hay usuario
  useEffect(() => {
    if (user && location.userLocation) {
      localStorage.setItem(
        "userLocation",
        JSON.stringify(location.userLocation)
      );
    }
    if (!user) {
      localStorage.removeItem("userLocation");
    }
  }, [user, location.userLocation]);

  const obtenerUbicacion = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.error("La geolocalización no está disponible en este navegador.");
      alert("Tu navegador no permite acceder a la ubicación.");
    }
  };

  const successCallback = (position) => {
    const newLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
    setLocation({
      userLocation: newLocation,
      mapCenter: newLocation,
    });
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

  return (
    <UserLocationContext.Provider
      value={{ location, setLocation, obtenerUbicacion }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => useContext(UserLocationContext);
