import axios from "axios";

const API_URL = process.env.RECOMMENDATION_API_URL;

export default class Noticias {
  static async getNoticias() {
    try {
      const response = await axios.get(`${API_URL}/api/v1/noticias`);
      return response.data;
    } catch (error) {
      throw new Error("Error al obtener noticias");
      return [];
    }
  }

  static async getNoticiasPorMuseo(mus_id) {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/noticias/museos/${mus_id}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Error al obtener noticias por museo");
      return [];
    }
  }
}
