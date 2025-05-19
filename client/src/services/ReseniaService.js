import axios from "axios";

const API_URL = "http://localhost:3000/api/reviews/";

const ReseniaService = {
  // Registrar reseña
  async registrarResenia(resenia) {
    const response = await axios.post(API_URL, resenia, {
      headers: {
		  'Content-Type': 'multipart/form-data'
		}
	  });
    return response.data;
  },

  // Editar reseña
  async editarResenia(resenia) {
    const response = await axios.put(API_URL, resenia, {
      headers: {
		  'Content-Type': 'multipart/form-data'
		},
		withCredentials: true,
	  }, id);
    return response.data;
  },

  // Eliminar reseña
  async eliminarResenia(resenia) {
	const response = await axios.delete(API_URL, {
	  data: resenia,
	  headers: {
		  'Content-Type': 'multipart/form-data'
		},
		withCredentials: true,
	  }, id);
    return response.data;
  },

  // Obtener todas las reseñas
  async obtenerResenias() {
	const response = await axios.get(API_URL);
	return response.data;
  },

  // Obtener reseñas por museo
  async obtenerReseniasPorMuseo(id) {
	const response = await axios.get(API_URL + id);
	return response.data;
  },
};

export default ReseniaService;
