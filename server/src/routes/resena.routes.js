import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authJwt.js";
import {
  getResenasById,
  getResenasPendientes,
  getResenasFoto,
  aprobarResena,
  getResenasByMuseo,
  getResenasModAll,
  getResenasModByMuseo,
  getResenasByCorreo,
  eliminarResena,
  registrarResena,
  editarResena,
  eliminarFotoResena,
} from "../controllers/resena.controller.js";

const router = Router();

const resenaUploads = upload.fields([
  { name: "entradaBoleto", maxCount: 1 },
  { name: "fotos", maxCount: 5 },
]);

router.get("/detalle/:id", getResenasById);
router.get("/pendientes", getResenasPendientes);
router.get("/detalle/:id/fotos", getResenasFoto);

// Para obtener todas las reseñas de usuarios
router.get("/usuario/all/:correo", getResenasByCorreo);
router.delete("/usuario/delete/:id", eliminarResena);
router.post(
  "/usuario/registrar/:museoId",
  resenaUploads,
  authMiddleware,
  registrarResena
);
router.post(
  "/usuario/editar/:resenaId",
  authMiddleware,
  upload.array("fotos", 10),
  editarResena
); // Asumiendo que esta ruta es para editar una reseña
router.delete("/usuario/eliminar-foto/:resenaId/:fotoId", eliminarFotoResena);

// Para obtener reseñas por museo
router.get("/museo/:museoId", getResenasByMuseo);

// Para obtener todas las reseñas de mods
router.get("/mod/all", getResenasModAll);
// Para obtener reseñas de mods por museo
router.get("/mod/museo/:museoId", getResenasModByMuseo);
router.post("/mod/aprobar/:resenaId", aprobarResena);

export default router;
