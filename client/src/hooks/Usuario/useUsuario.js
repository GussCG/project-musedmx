import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { BACKEND_URL } from "../../constants/api";
import axios from "axios";

export const useUsuario = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Registrar Usuario
  const registrarUsuario = async (usuario) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/auth/signup`;
      const response = await axios.post(endpoint, usuario, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(response.data.usuario.usuario);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.usuario.usuario)
      );
      return response.data;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Editar Usuario
  const editarUsuario = async (usuario, usr_correo) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(usr_correo);
      const endpoint = `${BACKEND_URL}/api/auth/update/${encodedCorreo}`;

      const response = await axios.post(endpoint, usuario, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data.usuario.usuario);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.usuario.usuario)
      );
      return response.data;
    } catch (error) {
      console.error("Error al editar usuario:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Recuperar contraseña
  const recuperarContrasena = async (usr_correo) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/auth/recuperarContrasena`;
      const response = await axios.post(endpoint, usr_correo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Recuperar contraseña:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateContrasena = async (usr_correo, newPassword) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/auth/cambiarContrasena`;
      const response = await axios.post(
        endpoint,
        { usr_correo, usr_contrasenia: newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obtenerUsuarioByCorreo = async (usr_correo) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(usr_correo);
      const endpoint = `${BACKEND_URL}/api/auth/usuario/${encodedCorreo}`;
      const response = await axios.get(endpoint, {
        withCredentials: true,
      });

      if (response.data.usuario.usuario) {
        const userVerified = response.data.usuario.usuario;
        setUser(userVerified);
        localStorage.setItem("user", JSON.stringify(userVerified));
      }

      return response.data;
    } catch (error) {
      console.error("Error al obtener usuario por correo:", error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    registrarUsuario,
    editarUsuario,
    recuperarContrasena,
    obtenerUsuarioByCorreo,
    updateContrasena,
    error,
  };
};

export default useUsuario;
