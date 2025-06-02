import Museo from "../models/museo.model.js";
import { handleHttpError } from "../helpers/httpError.js";
import { formatMuseoImageName } from "../utils/formatNombreArchivos.js";
import { uploadToAzure } from "../utils/azureUpload.js";
import sharp from "sharp";
import { deleteFromAzure } from "../utils/azureDelete.js";

export const getMuseos = async (req, res) => {
  try {
    const { search, tipo, tipos, alcaldias, sort, limit, page, isMapView } =
      req.query;

    // Limpieza de parámetros
    const cleanParams = {
      search: search && search !== "null" ? search : null,
      tipos: tipos ? tipos.split(",") : [],
      alcaldias: alcaldias ? alcaldias.split(",") : [],
      sort: sort || null,
      limit: isMapView === "true" ? null : limit ? parseInt(limit) : 12,
      page: isMapView === "true" ? null : page ? parseInt(page) : 1,
      isMapView: isMapView === "true",
    };

    // Si el tipo es "3" (populares), se establece un límite de 10 y se elimina la paginación por el momento que no hay logica para obtener museos populares
    if (tipo === "3") {
      cleanParams.limit = 10;
      cleanParams.page = 1;

      if (cleanParams.isMapView) {
        cleanParams.limit = 10;
        cleanParams.page = null;
      }
    }

    const result = await Museo.findAll(cleanParams);

    // Estructura de respuesta consistente
    const response = {
      success: true,
      data: {
        items: result.items,
        totalItems: result.totalItems,
        pagination: {
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          itemsPerPage: result.itemsPerPage,
        },
      },
    };

    res.json(response);
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

export const getMuseosNombresDescripciones = async (req, res) => {
  try {
    const museos = await Museo.findAllNamesAndDescriptions({});
    res.json({
      success: true,
      count: museos.length,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_NOMBRES_DESCRIPCIONES", error);
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
    const { limit } = req.query;
    const galeria = await Museo.findGaleriaById({ id: id, limit });
    res.json({
      success: true,
      id,
      galeria,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_GALERIA_ID", error);
  }
};

export const getHorariosById = async (req, res) => {
  try {
    const { id } = req.params;
    const horarios = await Museo.findHorariosById({ id: id });

    res.json({
      success: true,
      id,
      horarios,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_HORARIOS_ID", error);
  }
};

export const getRedesById = async (req, res) => {
  try {
    const { id } = req.params;
    const redes = await Museo.findRedesById({ id: id });

    res.json({
      success: true,
      id,
      redes,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_REDES_ID", error);
  }
};

export const getResenasById = async (req, res) => {
  try {
    const { id } = req.params;
    const resenas = await Museo.findResenasById({ id: id });

    res.json({
      success: true,
      id,
      resenas,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_RESENAS_ID", error);
  }
};

export const createMuseo = async (req, res) => {
  try {
    const {
      mus_nombre,
      mus_calle,
      mus_num_ext,
      mus_colonia,
      mus_cp,
      mus_alcaldia,
      mus_descripcion,
      mus_fec_ap,
      mus_tematica,
      mus_g_latitud,
      mus_g_longitud,
      galeria = [],
      horarios_precios = [],
      redes_sociales,
    } = req.body;

    console.log("req.body", req.body);

    let mus_foto = null;
    if (req.file) {
      const nombreMuseoFormateado = formatMuseoImageName(mus_nombre);
      console.log(mus_nombre);
      console.log("Nombre museo formateado:", nombreMuseoFormateado);
      const blobName = `${nombreMuseoFormateado}/${nombreMuseoFormateado}_Main.jpg`;

      const bufferJpg = await sharp(req.file.buffer)
        .jpeg({ quality: 85 })
        .toBuffer();

      const urlBlob = await uploadToAzure(
        "imagenes-museos",
        bufferJpg,
        blobName,
        "image/jpeg"
      );

      console.log("URL Blob:", urlBlob);
      mus_foto = urlBlob;
    }

    const museo = await Museo.create({
      mus_nombre,
      mus_calle,
      mus_num_ext,
      mus_colonia,
      mus_cp,
      mus_alcaldia,
      mus_descripcion,
      mus_fec_ap,
      mus_tematica,
      mus_foto,
      mus_g_latitud,
      mus_g_longitud,
      galeria,
      horarios_precios,
      redes_sociales,
    });
    res.json({
      success: true,
      museo,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_CREATE_MUSEO", error);
  }
};

export const updateMuseo = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el museo existente
    const museoExistente = await Museo.findById({ id: id });
    if (!museoExistente) {
      return res.status(404).json({
        success: false,
        message: "Museo no encontrado",
      });
    }

    const camposActualizados = {};

    if (req.body?.mus_nombre)
      camposActualizados.mus_nombre = req.body.mus_nombre;
    if (req.body?.mus_calle) camposActualizados.mus_calle = req.body.mus_calle;
    if (req.body?.mus_num_ext)
      camposActualizados.mus_num_ext = req.body.mus_num_ext;
    if (req.body?.mus_colonia)
      camposActualizados.mus_colonia = req.body.mus_colonia;
    if (req.body?.mus_cp) camposActualizados.mus_cp = req.body.mus_cp;
    if (req.body?.mus_alcaldia)
      camposActualizados.mus_alcaldia = req.body.mus_alcaldia;
    if (req.body?.mus_descripcion)
      camposActualizados.mus_descripcion = req.body.mus_descripcion;
    if (req.body?.mus_fec_ap)
      camposActualizados.mus_fec_ap = req.body.mus_fec_ap;
    if (req.body?.mus_tematica)
      camposActualizados.mus_tematica = req.body.mus_tematica;
    if (req.body?.mus_g_latitud)
      camposActualizados.mus_g_latitud = req.body.mus_g_latitud;
    if (req.body?.mus_g_longitud)
      camposActualizados.mus_g_longitud = req.body.mus_g_longitud;
    // redes_sociales llega como string JSON, hay que parsear
    if (req.body?.redes_sociales) {
      try {
        camposActualizados.redes_sociales = JSON.parse(req.body.redes_sociales);
      } catch {
        camposActualizados.redes_sociales = req.body.redes_sociales;
      }
    }

    if (req.file) {
      const nombreMuseoFormateado = formatMuseoImageName(
        museoExistente.mus_nombre
      );
      console.log(museoExistente.mus_nombre);
      console.log("Nombre museo formateado:", nombreMuseoFormateado);
      const blobName = `${nombreMuseoFormateado}/${nombreMuseoFormateado}_Main.jpg`;

      const bufferJpg = await sharp(req.file.buffer)
        .jpeg({ quality: 85 })
        .toBuffer();

      const urlBlob = await uploadToAzure(
        "imagenes-museos",
        bufferJpg,
        blobName,
        "image/jpeg"
      );

      console.log("URL Blob:", urlBlob);
      camposActualizados.mus_foto = urlBlob;
    }

    // Si no se han proporcionado campos para actualizar, devolver un error
    if (Object.keys(camposActualizados).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron campos para actualizar",
      });
    }

    const museo = await Museo.update({ id, museoData: camposActualizados });

    res.json({
      success: true,
      museo,
      message: "Museo actualizado correctamente",
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_MUSEO", error);
  }
};

export const getMuseosPopulares = async (req, res) => {
  try {
    const { top_n } = req.query;
    const museos = await Museo.findPopulares({
      top_n: top_n ? parseInt(top_n) : 5,
    });
    res.json({
      success: true,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_POPULARES", error);
  }
};

export const getMuseosSugeridosByCorreo = async (req, res) => {
  try {
    const { correo } = req.params;
    const { top_n } = req.query;
    const museos = await Museo.findSugeridosByCorreo({
      correo,
      top_n: top_n ? parseInt(top_n) : 5,
    });

    res.json({
      success: true,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_SUGERIDOS", error);
  }
};

export const getMuseosSimilaresById = async (req, res) => {
  try {
    const { id } = req.params;
    const { top_n } = req.query;

    const museos = await Museo.findSimilaresById({
      id,
      top_n: top_n ? parseInt(top_n) : 5,
    });

    res.json({
      success: true,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_SIMILARES", error);
  }
};

export const getMuseosCercaById = async (req, res) => {
  try {
    const { id } = req.params;
    const { top_n } = req.query;

    const museos = await Museo.findCercaById({
      id,
      top_n: top_n ? parseInt(top_n) : 5,
    });

    res.json({
      success: true,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_CERCA", error);
  }
};

export const getMuseosAsociacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { top_n } = req.query;

    const museos = await Museo.findAsociacionById({
      id,
      top_n: top_n ? parseInt(top_n) : 5,
    });

    res.json({
      success: true,
      museos,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_GET_MUSEOS_ASOCIACION", error);
  }
};

export const updateHorarioByDia = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia, updateData } = req.body;

    if (!dia || !updateData) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos para actualizar el horario",
      });
    }

    // Actualizar el horario por día
    const updatedHorario = await Museo.updateHorarioByDia({
      id,
      dia,
      horarioData: updateData,
    });

    res.json({
      success: true,
      message: "Horario actualizado correctamente",
      updatedHorario,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPDATE_HORARIO_BY_DIA", error);
  }
};

export const addByDia = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia } = req.body;

    console.log("DIA", dia);
    console.log("ID", id);

    if (!dia) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos para agregar el día",
      });
    }

    // Agregar el día
    const addedDia = await Museo.addByDia({ id, dia });

    res.json({
      success: true,
      message: "Día agregado correctamente",
      addedDia,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_ADD_BY_DIA", error);
  }
};

export const deleteByDia = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia } = req.body;

    console.log("DIA", dia);
    console.log("ID", id);

    if (!dia) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos para eliminar el día",
      });
    }

    // Eliminar el día
    const deletedDia = await Museo.deleteByDia({ id, dia });

    res.json({
      success: true,
      message: "Día eliminado correctamente",
      deletedDia,
    });
  } catch (error) {
    handleHttpError(res, "ERROR_DELETE_BY_DIA", error);
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

export const uploadFotosGaleria = async (req, res) => {
  try {
    const { id } = req.params;
    const { galeria } = req.body;

    // Verificar si el museo existe
    const museo = await Museo.findById({ id });
    if (!museo) {
      return res.status(404).json({
        success: false,
        message: "Museo no encontrado",
      });
    }

    let ultimoIndex = 0;
    const fotos = await Museo.findGaleriaById({ id });

    if (fotos && fotos.length > 0) {
      const indices = fotos.map((foto) => {
        const url = foto.gal_foto;
        const nombreArchivo = decodeURIComponent(
          new URL(url).pathname.split("/").pop()
        );
        // Extraer el último número antes de la extensión
        const match = nombreArchivo.match(/_(\d+)(?=\.\w+$)/);
        return match ? parseInt(match[1]) : 0;
      });

      ultimoIndex = Math.max(...indices);
    }

    const urlFotos = [];
    if (req.files) {
      const nombreMuseoFormateado = formatMuseoImageName(museo.mus_nombre);
      const containerName = "imagenes-museos";

      for (const [index, file] of req.files.entries()) {
        const bufferJpg = await sharp(file.buffer)
          .jpeg({ quality: 80 })
          .toBuffer();
        const nuevoIndex = ultimoIndex + index + 1; // Incrementar el índice
        const blobName = `${nombreMuseoFormateado}/${nombreMuseoFormateado}_${nuevoIndex}.jpg`;

        const url = await uploadToAzure(
          containerName,
          bufferJpg,
          blobName,
          "image/jpeg"
        );
        urlFotos.push(url);
      }
    }

    const galeriaActualizada = await Museo.addFotosGaleria({
      id,
      galeria: urlFotos,
    });
    res.json({
      success: true,
      message: "Fotos de galería subidas correctamente",
    });
  } catch (error) {
    handleHttpError(res, "ERROR_UPLOAD_FOTOS_GALERIA", error);
  }
};

export const eliminarFotoGaleria = async (req, res) => {
  try {
    const { id, galFotoId } = req.params;

    // Verificar si el museo existe
    const museo = await Museo.findById({ id });
    if (!museo) {
      return res.status(404).json({
        success: false,
        message: "Museo no encontrado",
      });
    }

    // Verificar que la foto de galería existe
    const fotoGaleria = await Museo.findFotoGaleriaById({ id: galFotoId });
    if (!fotoGaleria || fotoGaleria.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Galería no encontrada",
      });
    }

    const containerName = "imagenes-museos";
    const fotoUrl = fotoGaleria.galeria.gal_foto;
    const blobNameEncoded = new URL(fotoUrl).pathname.replace(
      /^\/[^\/]+\//,
      ""
    );
    const blobName = decodeURIComponent(blobNameEncoded);

    const eliminado = deleteFromAzure(containerName, blobName);
    if (eliminado) {
      await Museo.deleteFotoGaleriaById({ id, galFotoId });
      res.json({
        success: true,
        message: "Foto de galería eliminada correctamente",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar la foto de galería",
      });
    }
  } catch (error) {
    handleHttpError(res, "ERROR_ELIMINAR_FOTO_GALERIA", error);
  }
};
