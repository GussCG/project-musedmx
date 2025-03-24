import axios from "axios";

const API_URL = "https://localhost:3000/api/usuario/";

const UsuarioService = {
  // Registrar usuario
  async registrarUsuario(usuario) {
    const response = await axios.post(API_URL + "registrar", usuario);
    return response.data;
  },

  // Editar usuario
  async editarUsuario(usuario) {
    const response = await axios.put(API_URL + "editar", usuario);
    return response.data;
  },

  // Login
  // Aqui deberia estar el login y el logout cuando este el backend mientras en el AuthProvider para pruebas
  async login(usuario) {
    const response = await axios.post(API_URL + "login", usuario);
    return response.data;
  },

  // Logout
  async logout() {
    const response = await axios.post(API_URL + "logout");
    return response.data;
  },
};

export default UsuarioService;
