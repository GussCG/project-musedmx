import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants/api";
import { TIPOS_USUARIO } from "../constants/catalog";

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
function AuthProvider({ children }) {
  // Estado del usuario
  const [user, setUser] = useState(() => {
    // Verificar si hay un usuario en el localStorage
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
    } catch (e) {
      console.error("Error al parsear el usuario del localStorage:", e);
      localStorage.removeItem("user"); // limpia lo dañado
      return null;
    }
  });

  const navigate = useNavigate();

  const [tipoUsuario, setTipoUsuario] = useState(() => {
    const storedTipoUsuario = localStorage.getItem("tipoUsuario");
    try {
      return storedTipoUsuario && storedTipoUsuario !== "undefined"
        ? JSON.parse(storedTipoUsuario)
        : 0;
    } catch (e) {
      console.error("Error al parsear el tipo de usuario del localStorage:", e);
      localStorage.removeItem("tipoUsuario"); // limpia lo dañado
      return 0;
    }
  });

  // Gestionar el estado de carga
  const [isLoading, setIsLoading] = useState(true);

  // Manejar errores
  const [error, setError] = useState(null);

  const [isLogginPopupOpen, setIsLogginPopupOpen] = useState(false);
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Función para iniciar sesión
  const login = async (userData) => {
    try {
      setIsLoading(true);
      setError(null); // Limpiar errores

      // Ruta para iniciar sesión (Backend)
      const endpoint = `${BACKEND_URL}/api/auth/login`;
      const response = await axios.post(endpoint, userData, {
        withCredentials: true,
      });

      const user = response.data.usuario; // Desestructurar la respuesta del backend
      console.log("Usuario logueado: ", user);
      setUser(user);
      setTipoUsuario(TIPOS_USUARIO[user.usr_tipo].id);
      localStorage.setItem("user", JSON.stringify(user)); // Guardar el usuario en el localStorage
      localStorage.setItem(
        "tipoUsuario",
        JSON.stringify(TIPOS_USUARIO[user.usr_tipo].id)
      );

      setIsLogginPopupOpen(false); // Cerrar el popup

      navigate(TIPOS_USUARIO[user.usr_tipo].redirectPath); // Redirigir a la ruta correspondiente
    } catch (error) {
      console.error("Error de login: ", error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setError(null); // Limpiar errores
      // Ruta para cerrar sesión (Backend)
      const endpoint = `${BACKEND_URL}/api/auth/logout`;
      await axios.post(
        endpoint,
        {},
        {
          withCredentials: true, // para que se borre la cookie
        }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("tipoUsuario");
      localStorage.removeItem("token");
      setUser(null);
      setTipoUsuario(0);
      setToken(null); // Limpiar el token del estado
      navigate("/"); // Redirigir a la página de inicio
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  // Verificar si hay un usuario loggeado al iniciar la aplicación
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        // Obtener la información del usuario (Backend)
        const endpoint = `${BACKEND_URL}/api/auth/verify`;
        const response = await axios.get(endpoint, {
          withCredentials: true,
        });

        if (response.data?.usuario) {
          const userVerified = response.data.usuario;
          setUser(userVerified);
          setTipoUsuario(TIPOS_USUARIO[userVerified.usr_tipo]?.id || 0);
          localStorage.setItem("user", JSON.stringify(userVerified));
          localStorage.setItem(
            "tipoUsuario",
            JSON.stringify(TIPOS_USUARIO[user.usr_tipo].id || 0)
          );
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("No hay sesión activa");
        } else {
          console.error("Error inesperado:", error);
          setError(error);
        }
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
        token,
        isLogginPopupOpen,
        setIsLogginPopupOpen,
        setUser,
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
