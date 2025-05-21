import Lista from '../../models/listas.model.js';
import { handleHttpError } from '../../helpers/httpError.js';

export const getQv = async (req, res) => {
  try {
	const { qv_usr_correo } = req.body;
	console.log(qv_usr_correo);

	const qv = await Lista.find("quiero_visitar", qv_usr_correo);
	if (!qv) {
	  return res.status(404).json({ message: 'Quiero visitar not found' });
	}
	res.json(qv);
  } catch (error) {
	handleHttpError(res, "ERROR_GET_QV", error);
  }
};

export const addQv = async (req, res) => {
  try {
	const { 
		qv_usr_correo, 
		qv_mus_id 
	} = req.body;

	console.log(qv_usr_correo, qv_mus_id);

	const qv = await Lista.add("quiero_visitar", { qv_usr_correo, qv_mus_id });
	if (!qv) {
	  return res.status(404).json({ message: 'Quiero visitar not found' });
	}
	res.status(201).json(qv);
  } catch (error) {
	handleHttpError(res, "ERROR_ADD_QV", error);
  }
};

export const deleteQv = async (req, res) => {
  try {
	const { 
		qv_usr_correo, 
		qv_mus_id 
	} = req.body;

	const qv = await Lista.delete("quiero_visitar", {qv_usr_correo, qv_mus_id});
	if (!qv) {
	  return res.status(404).json({ message: 'Quiero visitar not found' });
	}
	res.json({
		success: true,
		message: 'Quiero visitar deleted successfully',
		qv
	});
  } catch (error) {
	handleHttpError(res, "ERROR_DELETE_QV", error);
  }
};