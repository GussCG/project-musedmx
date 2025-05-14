import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/auth/";

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
function AuthProvider({ children }) {
  // Estado del usuario
  const [user, setUser] = useState(() => {
    // Verificar si hay un usuario en el localStorage
    const storedUser = localStorage.getItem("user");
	try {
		return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
	} catch (e) {
		console.error("Error al parsear el usuario del localStorage:", e);
		localStorage.removeItem("user"); // limpia lo dañado
		return null;
	}
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
    tipoUsuario: 3,
    fecNac: "2002-09-30",
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
    /* // Logica para iniciar sesión pero sin el backend
    setUser(userPrueba);
    localStorage.setItem("user", JSON.stringify(userPrueba));
    localStorage.setItem("tipoUsuario", tiposUsuario[userPrueba.tipoUsuario]);
    setTipoUsuario(tiposUsuario[userPrueba.tipoUsuario]);
    setIsLogginPopupOpen(false); // Cerrar el popup

    // Obtenemos la ruta guardada o redirigimos a la página principal
    const redirectPath =
      localStorage.getItem("redirectPath") || `/${tipoUsuario}`;
    localStorage.removeItem("redirectPath");

    navigate(redirectPath); */
    try {
		setIsLoading(true);
		setError(null); // Limpiar errores

		// Ruta para iniciar sesión (Backend)
		const response = await axios.post(API_URL + "login", userData, {
			withCredentials: true
		  });

		const user = response.data; // Desestructurar la respuesta del backend
	
		setUser(user);
		setTipoUsuario(tiposUsuario[user.tipoUsuario]);
				
		localStorage.setItem("user", JSON.stringify(response.data)); // Guardar el usuario en el localStorage
		localStorage.setItem("tipoUsuario", tiposUsuario[response.data.tipoUsuario]); // Guardar el tipo de usuario en el localStorage
		setIsLogginPopupOpen(false); // Cerrar el popup

		const redirectPath =
			localStorage.getItem("redirectPath") || `/${tiposUsuario[response.data.tipoUsuario]}`;
		localStorage.removeItem("redirectPath");
		navigate(redirectPath);
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
    // Lógica para cerrar sesión pero sin el backend
    // setUser(null);
    // localStorage.removeItem("user");
    // localStorage.removeItem("tipoUsuario");
    // navigate("/");
    try {
		setError(null); // Limpiar errores
		// Ruta para cerrar sesión (Backend)
		await axios.post(API_URL + "logout", {}, {
			withCredentials: true, // para que se borre la cookie
		});
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
        // const storedUser = localStorage.getItem("user");

        // if (storedUser) {
        //   const parsedUser = JSON.parse(storedUser);
        //   setUser(parsedUser);
        //   setTipoUsuario(tiposUsuario[parsedUser.tipoUsuario]);
        // }

        // Obtener la información del usuario (Backend)
        const response = await axios.get(API_URL + "verify", {
			withCredentials: true
		  });
		  
        if (response.data) {
			setUser(response.data.usuario);
			setTipoUsuario(tiposUsuario[response.data.usuario.tipoUsuario]);
			localStorage.setItem("user", JSON.stringify(response.data.usuario));
			localStorage.setItem("tipoUsuario", tiposUsuario[response.data.usuario.tipoUsuario]);
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
