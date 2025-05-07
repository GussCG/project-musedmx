import { useState } from "react";
import MuseoService from "../../services/MuseoService";

export const useMuseo = () => {
  const [error, setError] = useState(null);

  // Registrar Museo
  const registrarMuseo = async (museo) => {
	setError(null);
	try {
	  const response = await MuseoService.registrarMuseo(museo);
	  return response;
	} catch (error) {
	  setError(error);
	  return null;
	} finally {
	  setError(null);
	}
  };

  // Editar Museo
  const editarMuseo = async (museo) => {
	setError(null);
	try {
	  const response = await MuseoService.editarMuseo(museo);
	  return response;
	} catch (error) {
	  setError(error);
	  return null;
	} finally {
	  setError(null);
	}
  };
  return { registrarMuseo, editarMuseo, error };
};

export default useMuseo;