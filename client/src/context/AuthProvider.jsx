import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants/api";
import { TIPOS_USUARIO } from "../constants/catalog";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
    } catch (e) {
      console.error("Error al parsear el usuario del localStorage:", e);
      localStorage.removeItem("user");
      return null;
    }
  });

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

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogginPopupOpen, setIsLogginPopupOpen] = useState(false);

  // Función para iniciar sesión
  const login = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = `${BACKEND_URL}/api/auth/login`;
      const response = await axios.post(endpoint, userData);

      const user = response.data.usuario;
      const token = response.data.token; // <--- asegúrate que el backend lo envíe

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      if (token) localStorage.setItem("token", token); // <--- guardas token

      // etc...
    } catch (error) {
      // manejo de errores...
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setError(null);
      const endpoint = `${BACKEND_URL}/api/auth/logout`;
      await axios.post(
        endpoint,
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("tipoUsuario");
      localStorage.removeItem("token");
      setUser(null);
      setTipoUsuario(0);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setError(error);
    }
  };

  // Verificar si hay un usuario loggeado al iniciar la aplicación
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const endpoint = `${BACKEND_URL}/api/auth/verify`;
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.usuario) {
          const userVerified = response.data.usuario;
          setUser(userVerified);
          setTipoUsuario(TIPOS_USUARIO[userVerified.usr_tipo]?.id || 0);
          localStorage.setItem("user", JSON.stringify(userVerified));
          localStorage.setItem(
            "tipoUsuario",
            JSON.stringify(TIPOS_USUARIO[userVerified.usr_tipo]?.id || 0)
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
