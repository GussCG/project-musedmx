import Lista from '../../models/listas.model.js';
import { handleHttpError } from '../../helpers/httpError.js';

export const getVisitas = async (req, res) => {
  try {
	const { vi_usr_correo } = req.body;
	console.log(vi_usr_correo);

	const vi = await Lista.find("visitas", vi_usr_correo);
	if (!vi) {
	  return res.status(404).json({ message: 'Visitas not found' });
	}
	res.json(vi);
  } catch (error) {
	handleHttpError(res, "ERROR_GET_VI", error);
  }
};

export const addVisita = async (req, res) => {
  try {
	const { 
		vi_usr_correo, 
		vi_mus_id, 
		vi_fechahora
	} = req.body;

	console.log(vi_usr_correo, vi_mus_id, vi_fechahora);

	const vi = await Lista.add("visitas", { vi_usr_correo, vi_mus_id, vi_fechahora });
	if (!vi) {
	  return res.status(404).json({ message: 'Visita not found' });
	}
	res.status(201).json(vi);
  } catch (error) {
	handleHttpError(res, "ERROR_ADD_VI", error);
  }
};

export const deleteVisita = async (req, res) => {
  try {
	const { 
		vi_usr_correo, 
		vi_mus_id 
	} = req.body;

	const vi = await Lista.delete("visitas", {vi_usr_correo, vi_mus_id});
	if (!vi) {
	  return res.status(404).json({ message: 'Visita not found' });
	}
	res.json({
		success: true,
		message: 'Visita deleted successfully',
		vi
	});
  } catch (error) {
	handleHttpError(res, "ERROR_DELETE_VI", error);
  }
};