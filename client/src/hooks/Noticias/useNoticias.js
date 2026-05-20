import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/api";

export const useNoticias = (mus_id = null) => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNoticias();
  }, [mus_id]);

  const fetchNoticias = async () => {
    try {
      setLoading(true);

      let url = `${BACKEND_URL}/api/noticias/museos/`;

      if (mus_id) {
        url += `mus_id=${mus_id}`;
      }

      const res = await axios.get(url);
      setNoticias(res.data);
    } catch (error) {
      console.error("Error fetching noticias:", error);
    } finally {
      setLoading(false);
    }
  };

  return { noticias, loading };
};
