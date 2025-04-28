import { Router } from "express";
import { 
	signUp, 
	logIn,
	logOut,
	updateUser,
	deleteUser
} from "../controllers/auth.controller.js";

const router = Router();

// Definir las rutas para los usuarios
router.post("/auth/signup", signUp); // Registrarse
router.post("/auth/login", logIn); // Iniciar sesión
router.get("/auth/logout", logOut); // Cerrar sesión
router.put("/auth/update", updateUser); // Actualizar datos de usuario
router.delete("/auth/delete", deleteUser);


export default router;