import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authJwt.js";
import {
  signUp,
  logIn,
  logOut,
  deleteUser,
  updateUser,
  verifyUser,
  verEmail,
  obtenerUsuarioByCorreo,
  // recuperarContrasena
} from "../controllers/auth.controller.js";

const router = Router();

// Definir las rutas para los usuarios
router.post("/signup", upload.single("usr_foto"), signUp); // Registrarse
router.post("/login", logIn); // Iniciar sesión
router.post("/logout", logOut); // Cerrar sesión
router.post(
  "/update/:usr_correo",
  authMiddleware,
  upload.single("usr_foto"),
  updateUser
); // Actualizar datos de usuario
router.get("/verify", authMiddleware, verifyUser); // Obtener perfil de usuario
router.delete("/", deleteUser);
router.get("/", verEmail); // Verificar correo electrónico
router.get("/usuario/:usr_correo", authMiddleware, obtenerUsuarioByCorreo); // Obtener usuario por correo
// router.post("/recuperarContrasena", recuperarContrasena); // Recuperar contraseña

export default router;
