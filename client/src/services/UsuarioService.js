import axios from "axios";
import { BACKEND_URL } from "../constants/api";

const UsuarioService = {
  // Registrar usuario
  async registrarUsuario(usuario) {
    const endpoint = `${BACKEND_URL}/api/auth/signup`;
    const response = await axios.post(endpoint, usuario, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Editar usuario
  async editarUsuario(usuario, usr_correo) {
    const encodedCorreo = encodeURIComponent(usr_correo);
    const endpoint = `${BACKEND_URL}/api/auth/update/${encodedCorreo}`;

    const response = await axios.post(endpoint, usuario, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Recuperar contraseña
  async recuperarContrasena(usuario) {
    const response = await axios.post(API_URL + "recuperarContrasena", usuario);
    return response.data;
  },

  async obtenerUsuarioPorCorreo(usr_correo) {
    const encodedCorreo = encodeURIComponent(usr_correo);
    const endpoint = `${BACKEND_URL}/api/auth/usuario/${encodedCorreo}`;
    const response = await axios.get(endpoint, {
      withCredentials: true,
    });
    return response.data;
  },
};

export default UsuarioService;
