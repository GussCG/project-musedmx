// Archivo para crear las funciones del usuario que se van a pasar del Frontend al Backend

import axios from 'axios';

// Funcion para Iniciar Sesion
export const iniciarSesion = async (usuario) => {
    return await axios.post('http://localhost:3000/api/usuarios/iniciar-sesion', usuario)
}