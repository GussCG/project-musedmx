let eye = document.getElementById('eye');
let password = document.getElementById('login-frm-password');

import eyeOpenIcon from '../assets/icons/eye-opened-icon.png';
import eyeClosedIcon from '../assets/icons/eye-closed-icon.png';

// Cambiar el tipo de input para mostrar la contraseña
// Abre o cierra el ojo con una imagen (eye-opened-icon.png)
export function openEye() {
    if (password.type == 'password') {
        password.type = 'text';
        eye.src = eyeOpenIcon;
    } else {
        password.type = 'password';
        eye.src = eyeClosedIcon;
    }
}