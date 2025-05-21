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
  async editarUsuario(usuario) {
    const response = await axios.put(API_URL + "update", usuario, {
		headers: {
		  'Content-Type': 'multipart/form-data'
		},
		withCredentials: true, 
	  });
    return response.data;
  },

  // Recuperar contraseña
  async recuperarContrasena(usuario) {
    const response = await axios.post(API_URL + "recuperarContrasena", usuario);
    return response.data;
  },

  // Login
  // Aqui deberia estar el login y el logout cuando este el backend mientras en el AuthProvider para pruebas
  async login(usuario) {
    const response = await axios.post(API_URL + "login", usuario);
    // { usr_correo, usr_contrasenia });
    localStorage.setItem("token", res.data.token);
    return response.data;
  },

  // Logout
  async logout() {
    const response = await axios.post(API_URL + "logout");
    return response.data;
  },
};

export default UsuarioService;
