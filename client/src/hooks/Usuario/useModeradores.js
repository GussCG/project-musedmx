import { useState } from "react";
import UsuarioService from "../../services/UsuarioService";

export const useUsuario = () => {
  const [error, setError] = useState(null);

// Registrar Moderador
  const registrarModerador = async (usuario) => {
    setError(null);
    console.log(usuario);
    try {
      return await UsuarioService.registrarUsuario(usuario);
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  // Editar Moderador
  const editarModerador = async (usuario) => {
    setError(null);
    try {
      return await UsuarioService.editarUsuario(usuario);
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  // Eliminar Moderador
  const eliminarModerador = async (usuario) => {
    setError(null);
    try {
      return await UsuarioService.deleteUser(usuario);
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
      return await UsuarioService.recuperarContrasena(usuario);
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  return { 
    registrarModerador, 
    editarModerador, 
    eliminarModerador, 
    recuperarContrasena, 
    error 
  };
};

export default useModeradores;