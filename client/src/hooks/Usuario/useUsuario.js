import { useState } from "react";
import UsuarioService from "../../services/UsuarioService";

export const useUsuario = () => {
  const [error, setError] = useState(null);

  // Registrar Usuario
  const registrarUsuario = async (usuario) => {
    setError(null);
    try {
      const response = await UsuarioService.registrarUsuario(usuario);
      console.log("Response de registrarUsuario", response);
      return response;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  // Editar Usuario
  const editarUsuario = async (usuario) => {
    // console.log(usuario);
    setError(null);
    try {
      const response = await UsuarioService.editarUsuario(usuario);
      return response;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  // Recuperar contraseña
  const recuperarContrasena = async (usuario) => {
    setError(null);
    try {
      const response = await UsuarioService.recuperarContrasena(usuario);
      return response;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  // Registrar Moderador (maybe se mueve a useModeradores)
  const registrarModerador = async (usuario) => {
    setError(null);
    console.log(usuario);
    try {
      const response = await UsuarioService.registrarModerador(usuario);
      return response;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };
  return { registrarUsuario, editarUsuario, registrarModerador, error };
};

export default useUsuario;
