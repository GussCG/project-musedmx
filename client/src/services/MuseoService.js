import axios from "axios";

const API_URL = "http://localhost:3000/api/museos/";

const MuseoService = {
	/*   // Obtener museos filtrados
  async obtenerMuseosFiltrados(filtros) {
	const response = await axios.get(API_URL + "filtroPor", { params: filtros });
	return response.data;
  },

  // Obtener museos por busqueda
  async obtenerMuseosBusqueda(busqueda) {
	const response = await axios.get(API_URL + "busqueda", { params: busqueda });
	return response.data;
  },

  // Obtener nombres de museos
  async obtenerNombresMuseos() {
	const response = await axios.get(API_URL + "nombres");
	return response.data;
  },

  // Obtener museo por ID
  async obtenerMuseoPorId(id) {
	const response = await axios.get(API_URL + id);
	return response.data;
  }, */

  // Crear museo
  async registrarMuseo(museo) {
	console.log("Recibe: ");
	for (var pair of museo.entries()) {
		console.log(pair[0]+ ', ' + pair[1]); 
	}
	const response = await axios.post(API_URL, museo, {
		headers: {
		  'Content-Type': 'multipart/form-data'
		}
	  });
	return response.data;
  },


  async actualizarMuseo(id, museo) {
	const response = await axios.put(API_URL + id, museo, {
		headers: {
		  'Content-Type': 'multipart/form-data'
		},
		withCredentials: true, 
	  });
	return response.data;
  },


  async eliminarMuseoPorId(id) {
	const response = await axios.delete(API_URL + id);
	return response.data;
  }
}

export default MuseoService;