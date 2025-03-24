import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
function AuthProvider({ children }) {
  // Estado del usuario
  const [user, setUser] = useState(() => {
    // Verificar si hay un usuario en el localStorage
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  // Estado del tipo de usuario
  // 1: Usuario normal, 2: Administrador, 3: Moderador

  const navigate = useNavigate();

  // Hacer un usuario de pruebas
  const userPrueba = {
    id: 1,
    nombre: "Juan",
    apPaterno: "Perez",
    apMaterno: "Gonzalez",
    email: "mail@mail.com",
    tipoUsuario: 2,
    fecNac: "2002-09-30T05:00:00.000Z",
    tel: "+525527167255",
    foto: "https://a.espncdn.com/i/headshots/nba/players/full/3975.png",

    //Preferencias
    tematicas: ["Arte", "Antropología", "Historia"],
    tipo_costo: "A veces gratis",
    rango_costo: [10, 100],
  };

  // Tipos de usuario
  const tiposUsuario = {
    0: "No registrado",
    1: "Usuario",
    2: "Admin",
    3: "Mod",
  };

  const [tipoUsuario, setTipoUsuario] = useState(
    tiposUsuario[userPrueba.tipoUsuario] || "No registrado"
  );

  // Gestionar el estado de carga
  const [isLoading, setIsLoading] = useState(true);

  // Manejar errores
  const [error, setError] = useState(null);

  const [isLogginPopupOpen, setIsLogginPopupOpen] = useState(false);

  // Función para iniciar sesión
  const login = async (userData) => {
    // Logicar para iniciar sesión pero sin el backend
    setUser(userPrueba);
    localStorage.setItem("user", JSON.stringify(userPrueba));
    localStorage.setItem("tipoUsuario", tiposUsuario[userPrueba.tipoUsuario]);
    setTipoUsuario(tiposUsuario[userPrueba.tipoUsuario]);
    setIsLogginPopupOpen(false); // Cerrar el popup

    // Obtenemos la ruta guardada o redirigimos a la página principal
    const redirectPath =
      localStorage.getItem("redirectPath") || `/${tipoUsuario}`;
    localStorage.removeItem("redirectPath");

    navigate(redirectPath);
    // try {
    //   setIsLoading(true);
    //   setError(null); // Limpiar errores
    //   // Ruta para iniciar sesión (Backend)
    //   const response = await axios.post("/api/auth/login", userData);
    //   setUser(response.data);
    //   setTipoUsuario(tiposUsuario[response.data.tipoUsuario]);
    //   localStorage.setItem("user", JSON.stringify(response.data)); // Guardar el usuario en el localStorage
    // } catch (error) {
    //   console.error(error);
    //   setError(error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  // Función para cerrar sesión
  const logout = async () => {
    // Lógica para cerrar sesión pero sin el backend
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tipoUsuario");
    navigate("/");
    // try {
    //   setError(null); // Limpiar errores
    //   // Ruta para cerrar sesión (Backend)
    //   await axios.post("/api/auth/logout");
    //   setUser(null);
    //   localStorage.removeItem("user");
    // } catch (error) {
    //   console.error(error);
    //   setError(error);
    // }
  };

  // Verificar si hay un usuario loggeado al iniciar la aplicación
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setTipoUsuario(tiposUsuario[parsedUser.tipoUsuario]);
        }

        // Obtener la información del usuario (Backend)
        // const response = await axios.get("/api/auth/user");
        // if (response.data) {
        //   setUser(response.data);
        //   setTipoUsuario(tiposUsuario[response.data.tipoUsuario]);
        //   localStorage.setItem("user", JSON.stringify(response.data));
        // localStorage.setItem("tipoUsuario", tiposUsuario[response.data.tipoUsuario]);
        // }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedInUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        error,
        tipoUsuario,
        isLogginPopupOpen,
        setIsLogginPopupOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
