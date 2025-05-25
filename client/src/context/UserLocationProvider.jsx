import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthProvider";

const UserLocationContext = createContext();

const DEFAULT_LOCATION = {
  lat: 19.4326077,
  lng: -99.1332079,
  accuracy: 0,
};

export const UserLocationProvider = ({ children }) => {
  const { user } = useAuth();
  const [location, setLocation] = useState({
    userLocation: null,
    mapCenter: DEFAULT_LOCATION,
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
      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation !== JSON.stringify(location.userLocation)) {
        localStorage.setItem(
          "userLocation",
          JSON.stringify(location.userLocation)
        );
      }
    } else if (!user) {
      localStorage.removeItem("userLocation");
    }
  }, [user, location.userLocation]);

  const obtenerUbicacion = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.error("La geolocalización no está disponible en este navegador.");
      alert("Tu navegador no permite acceder a la ubicación.");
      // Si no hay geolocalización, mantenemos el centro en CDMX
      setLocation((prev) => ({
        ...prev,
        userLocation: null,
        mapCenter: DEFAULT_LOCATION,
      }));
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
    // En caso de error, mantenemos el centro en CDMX
    setLocation((prev) => ({
      ...prev,
      userLocation: null,
      mapCenter: DEFAULT_LOCATION,
    }));
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
