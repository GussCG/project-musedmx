import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants/api";

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

  // Tipos de usuario
  const tiposUsuario = {
    0: "No registrado",
    1: "Usuario",
    2: "Admin",
    3: "Mod",
  };

  const [tipoUsuario, setTipoUsuario] = useState("");

  // Gestionar el estado de carga
  const [isLoading, setIsLoading] = useState(true);

  // Manejar errores
  const [error, setError] = useState(null);

  const [isLogginPopupOpen, setIsLogginPopupOpen] = useState(false);

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

      setUser(user);
      setTipoUsuario(tiposUsuario[user.usr_tipo]);

      localStorage.setItem("user", JSON.stringify(user)); // Guardar el usuario en el localStorage
      localStorage.setItem("tipoUsuario", tiposUsuario[user.usr_tipo]); // Guardar el tipo de usuario en el localStorage
      setIsLogginPopupOpen(false); // Cerrar el popup
      let redirectPath = "/"; // Ruta por defecto

      switch (user.usr_tipo) {
        case 1:
          redirectPath = "/Usuario";
          break;
        case 2:
          redirectPath = "/Admin";
          break;
        case 3:
          redirectPath = "/Mod";
          break;
        default:
          redirectPath = "/";
      }
      console.log("Redirigiendo a:", redirectPath);
      navigate(redirectPath); // Redirigir a la ruta correspondiente
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
      setUser(null);
      localStorage.removeItem("user");
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

        if (response.data) {
          setUser(response.data.usuario);
          setTipoUsuario(tiposUsuario[response.data.usuario.tipoUsuario]);
          localStorage.setItem("user", JSON.stringify(response.data.usuario));
          localStorage.setItem(
            "tipoUsuario",
            tiposUsuario[response.data.usuario.tipoUsuario]
          );
        }
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
