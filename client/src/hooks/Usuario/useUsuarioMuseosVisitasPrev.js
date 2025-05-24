import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Lista from "../../models/Usuario/Listas";

import { BACKEND_URL } from "../../constants/api";

export function useUsuarioMuseosVisitasPrev (listId) {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addVisita = useCallback(
    async (mus_id) => {
      try {
        setLoading(true);
        const endpoint = `${BACKEND_URL}/api/usuarios/visitas/${usr_correo}`;
        const response = await axios.post(endpoint, { mus_id });

        setVisitas((prev) => [
          ...prev, new Lista(response.data)
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error adding visita:", error);
        setError(error.message);
        setVisitas([]);
      } finally {
        setLoading(false);
      }
    }, [usr_correo]
  );

  const fetchVisitas = useCallback(
	async () => {
	  try {
	    setLoading(true);
	    const endpoint = `${BACKEND_URL}/api/usuarios/visitas/${usr_correo}`;
	    const response = await axios.get(endpoint);

	    setVisitas(response.data.data.items.map((lista) => new Lista(lista)))
	    setLoading(false);
	  } catch (error) {
	    console.error("Error fetching visitas:", error);
	    setError(error.message);
	    setVisitas([]);
	    throw error;
	  } finally {
	    setLoading(false);
	  }
	}, [listId]
  );

  useEffect(() => {
	fetchVisitas(listId);
	}, [fetchVisitas]);  

	const removeVisita = useCallback(
    async (mus_id) => {
      try {
        setLoading(true);
        const endpoint = `${BACKEND_URL}/api/usuarios/visitas/${encodeURIComponent(usr_correo)}/${encodeURIComponent(mus_id)}`;
        await axios.delete(endpoint);

        setVisitas((prev) => 
          prev.filter((item) => item.mus_id !== mus_id)
        );
        setLoading(false);
      } catch (error) {
        console.error("Error removing visita:", error);
        setError(error.message);
        setVisitas([]);
      } finally {
        setLoading(false);
      }
    }, [usr_correo]
  );

  return { 
	visitas, 
	loading, 
	error, 
	addVisita,
	fetchVisitas,
	removeVisita,
  };
};