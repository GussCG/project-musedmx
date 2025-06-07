import { useState } from "react";
import { Mod } from "../../models/Usuario/Usuario";
import { BACKEND_URL } from "../../constants/api";
import axios from "axios";

export const useModeradores = () => {
  const [moderadores, setModeradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Registrar Moderador
  const registrarModerador = async (usuario) => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/auth/mod/create`;
      const response = await axios.post(endpoint, usuario);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error al registrar moderador:", error);

      const mensaje =
        error?.response?.data?.details ||
        "Error desconocido al registrar moderador";

      return {
        success: false,
        message: mensaje,
      };
    } finally {
      setLoading(false);
    }
  };

  // Editar Moderador
  const editarModerador = async (correo, usuario) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/auth/mod/update/${encodedCorreo}`;
      console.log("Endpoint de edición:", endpoint);
      const response = await axios.post(endpoint, usuario, {
        withCredentials: true,
      });
      console.log("Respuesta de edición:", response.data.resultado);
      return response.data.resultado;
    } catch (error) {
      setError(error);
      console.error("Error al editar moderador:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar Moderador
  const eliminarModerador = async (usuario) => {
    try {
      setLoading(true);
      const encodedCorreo = encodeURIComponent(usuario.usr_correo);
      const endpoint = `${BACKEND_URL}/api/auth/mod/delete/${encodedCorreo}`;
      const response = await axios.delete(endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario.token}`, // Asegúrate de enviar el token si es necesario
        },
      });
      return response;
    } catch (error) {
      setError(error);
      console.error("Error al eliminar moderador:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Recuperar contraseña
  const recuperarContrasena = async (usuario) => {
    setError(null);
    try {
      return await UsuarioService.recuperarContrasena(usuario);
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  const fetchModeradores = async () => {
    try {
      setLoading(true);
      const endpoint = `${BACKEND_URL}/api/auth/mod`;
      console.log("Fetching moderadores from:", endpoint);
      const response = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setModeradores(response.data.map((mod) => new Mod(mod)));
      return response.data;
    } catch (error) {
      setError(error);
      console.error("Error al obtener moderadores:", error);
      setModeradores([]);
    } finally {
      setLoading(false);
    }
  };

  const obtenerModByCorreo = async (correo) => {
    try {
      setLoading(true);
      const endcodedCorreo = encodeURIComponent(correo);
      const endpoint = `${BACKEND_URL}/api/auth/mod/verify/${endcodedCorreo}`;
      const response = await axios.get(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      setError(error);
      console.error("Error al obtener moderador por correo:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    registrarModerador,
    editarModerador,
    eliminarModerador,
    recuperarContrasena,
    fetchModeradores,
    obtenerModByCorreo,
    error,
  };
};

export default useModeradores;
