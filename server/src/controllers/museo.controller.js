import Museo from "../models/museo.model.js";
import { handleHttpError } from "../helpers/httpError.js";

export const getMuseos = async (req, res) => {
  try {
    // const { limit = 10, page = 1, search = "" } = req.query;
    // const pageNumber = parseInt(page, 10);
    // const offset = (pageNumber - 1) * limit;

    const { search = "" } = req.query;
    const [museos, total] = await Promise.all([
      Museo.findAll({ search }),
      Museo.countAll({ search }),
    ]);
    res.json({
      success: true,
      count: museos.length,
      museos,
      total,
      // currentPage: pageNumber,
      // totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS", error);
  }
};

export const getMuseosNombres = async (req, res) => {
  try {
    const museos = await Museo.findAllNames({});
    res.json({
      success: true,
      count: museos.length,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_NOMBRES", error);
  }
};

export const getMuseoById = async (req, res) => {
  try {
    const { id } = req.params;
    const museo = await Museo.findById({ id: id });
    res.json({
      success: true,
      id,
      museo,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEO_ID", error);
  }
};

export const getGaleriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const galeria = await Museo.findGaleriaById({ id: id });
    res.json({
      success: true,
      id,
      galeria,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_GALERIA_ID", error);
  }
};

export const createMuseo = async (req, res) => {
  try {
	// Comprobar lo que se recibe en el body
	console.log(req.body);
	let {
		mus_nombre,
		mus_calle,
		mus_num_ext,
		mus_colonia,
		mus_cp,
		mus_alcaldia,
		mus_fec_ap,
		mus_descripcion,
		mus_tematica,
		mus_g_latitud,
		mus_g_longitud,
	} = req.body;

	const mus_foto = req.file ? req.file.filename : null;
	
    const museo = await Museo.create({
		mus_nombre,
		mus_calle,
		mus_num_ext,
		mus_colonia,
		mus_cp,
		mus_alcaldia,
		mus_fec_ap,
		mus_descripcion,
		mus_tematica,
		mus_g_latitud,
		mus_g_longitud,
		mus_foto,
	});
    res.status(201).json({
	  success: true,
	  message: "Museo creado",
	  museo,
	});
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_MUSEO", error);
  }
};

// Aqui van más funciones para los museos
export const updateMuseo = async (req, res) => {
	try{ 
		const museo = await Museo.updateMuseo(req.params.id, req.body);
		if (!museo) {
			return res.status(404).json({
				success: false,
				message: "Museo no encontrado",
			});
		}
		res.json({
			success: true,
			museo,
		});
	} catch (error) {
		handleHttpError(res, "ERROR_UPDATE_MUSEO", error);
	}
};

export const deleteMuseo = async (req, res) => {
	try {
		const museo = await Museo.deleteMuseo(req.body.mus_id);
		if (!museo) {
			return res.status(404).json({
				success: false,
				message: "Museo no encontrado",
			});
		}
		res.json({
			success: true,
			message: "Museo eliminado",
			museo,
		});
	} catch (error) {
		handleHttpError(res, "ERROR_DELETE_MUSEO", error);
	}
};