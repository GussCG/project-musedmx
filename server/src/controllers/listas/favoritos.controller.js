import Lista from '../../models/listas.model.js';
import { handleHttpError } from '../../helpers/httpError.js';

export const getFavoritos = async (req, res) => {
  try {
	const { fav_usr_correo } = req.body;
	console.log(fav_usr_correo);

    const favoritos = await Lista.find("favoritos", fav_usr_correo);
	if (!favoritos) {
	  return res.status(404).json({ message: 'Favoritos not found' });
	}
    res.json(favoritos);
  } catch (error) {
    handleHttpError(res, "ERROR_GET_FAVORITOS", error);
  }
};

export const addFavorito = async (req, res) => {
  try {
	const { 
		fav_usr_correo, 
		fav_mus_id 
	} = req.body;

	console.log(fav_usr_correo, fav_mus_id);

	const favorito = await Lista.add("favoritos", { fav_usr_correo, fav_mus_id });
	if (!favorito) {
	  return res.status(404).json({ message: 'Favorito not found' });
	}
	res.status(201).json(favorito);
  } catch (error) {
	handleHttpError(res, "ERROR_ADD_FAVORITO", error);
  }
};

export const deleteFavorito = async (req, res) => {
  try {
	const { 
		fav_usr_correo, 
		fav_mus_id 
	} = req.body;

	const favorito = await Lista.delete("favoritos", {fav_usr_correo, fav_mus_id});
	if (!favorito) {
	  return res.status(404).json({ message: 'Favorito not found' });
	}
	res.json({
		success: true,
		message: 'Favorito deleted successfully',
		favorito
	});
  } catch (error) {
	handleHttpError(res, "ERROR_DELETE_FAVORITO", error);
  }
};