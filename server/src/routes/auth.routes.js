import { Router } from "express";
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/authJwt.js';
import { 
	signUp, 
	logIn,
	logOut,
	deleteUser,
	updateUser,
	verifyUser
} from "../controllers/auth.controller.js";

const router = Router();

// Definir las rutas para los usuarios
router.post("/signup", upload.single('usr_foto'), signUp); // Registrarse
router.post("/login", logIn); // Iniciar sesión
router.post("/logout", logOut); // Cerrar sesión
router.put("/update", authMiddleware, upload.single('usr_foto'), updateUser); // Actualizar datos de usuario
router.get("/verify", authMiddleware, verifyUser); // Obtener perfil de usuario
router.delete("/", deleteUser);

/* 
Nuevas rutas para el login y el logout
router.post("/", upload.single('usr_foto'), signUp); // Registrarse
router.post("/:id", logIn); // Iniciar sesión
router.get("/", logOut); // Cerrar sesión
router.delete("/", deleteUser); */

export default router;