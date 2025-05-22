import { useState } from "react";
import UsuarioService from "../../services/UsuarioService";

export const useUsuario = () => {
  const [error, setError] = useState(null);

  // Registrar Usuario
  const registrarUsuario = async (usuario) => {
    setError(null);
    try {
      return await UsuarioService.registrarUsuario(usuario);
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  // Editar Usuario
  const editarUsuario = async (usuario, usr_correo) => {
    // console.log(usuario);
    setError(null);
    try {
      return await UsuarioService.editarUsuario(usuario, usr_correo);
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

  const obtenerUsuarioByCorreo = async (usr_correo) => {
    setError(null);
    try {
      return await UsuarioService.obtenerUsuarioPorCorreo(usr_correo);
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setError(null);
    }
  };

  return {
    registrarUsuario,
    editarUsuario,
    recuperarContrasena,
    obtenerUsuarioByCorreo,
    error,
  };
};

export default useUsuario;
