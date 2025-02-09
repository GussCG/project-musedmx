let eyeButton = document.getElementById('eye');
let eyeButton2 = document.getElementById('eye2');
let password = document.getElementById('signin-frm-password');
let password2 = document.getElementById('signin-frm-repassword');

import eyeOpenIcon from '../assets/icons/eye-opened-icon.png';
import eyeClosedIcon from '../assets/icons/eye-closed-icon.png';

// Cambiar el tipo de input para mostrar la contraseña
// Abre o cierra el ojo con una imagen (eye-opened-icon.png)
eyeButton.onclick = function () {
    if (password.type == 'password') {
        password.type = 'text';
        eyeButton.src = eyeOpenIcon;
    } else {
        password.type = 'password';
        eyeButton.src = eyeClosedIcon;
    }
}

eyeButton2.onclick = function () {
    if (password2.type == 'password') {
        password2.type = 'text';
        eyeButton2.src = eyeOpenIcon;
    } else {
        password2.type = 'password';
        eyeButton2.src = eyeClosedIcon;
    }
}

// Validar el costo, si la opcion es siempre con costo o a veces gratis, se activa el input del rango de costo
const costo = document.getElementById("registros-frm-costo");
const rango = document.getElementById("registros-frm-rango-costo");
costo.addEventListener("change", (event) => {
  if (event.target.value === "Siempre con costo" || event.target.value === "A veces gratis") {
    rango.disabled = false;
  } else {
    rango.disabled = true;
    rango.value = 0;
    value.textContent = rango.value;
  }
});

// Mostrar el rango que selecciono
const value = document.getElementById("rango-valor");
const input = document.getElementById("registros-frm-rango-costo");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});

// Si el usuario selecciona una foto se cambia la imagen de la foto de perfil
const foto = document.getElementById("registros-frm-foto");
const img = document.getElementById("foto-preview");
foto.addEventListener("change", (event) => {
  img.src = URL.createObjectURL(event.target.files[0]);
});

// Bloquear a 3 tematicas en el formulario el usuario no puede seleccionar mas de 3
// Obtenemos las tematicas seleccionadas name: signin-frm-tematica
const tematicas = document.getElementsByName("signin-frm-tematica");
const maxTematicas = 3;

// Contamos cuantas tematicas selecciono el usuario
let count = 0;
tematicas.forEach((tematica) => {
  tematica.addEventListener("change", (event) => {
    if (event.target.checked) {
      count++;
    } else {
      count--;
    }

    if (count > maxTematicas) {
      event.target.checked = false;
      count--;
    }
  });

  tematica.addEventListener("click", (event) => {
    if (event.target.checked && count === maxTematicas) {
      alert("Solo puedes seleccionar 3 tematicas");
    }
  });
});

// Validamos las contraseña y la confirmacion de la contraseña
// Si son iguales se pinta de verde y se activa el boton de registro
const btn = document.getElementById("signin-btn");
if (password && password2) {
  password2.addEventListener("input", (event) => {
    if (password.value == null || password.value === "") {
      password2.style.borderColor = "black";
      password.style.borderColor = "black";
      document.getElementById("signin-btn").disabled = true;
    } else if (password.value === password2.value && password2.value.length > 0) {
      password2.style.borderColor = "green";
      password.style.borderColor = "green";
      document.getElementById("signin-btn").disabled = false;
    } else {
      password2.style.borderColor = "red";
      password.style.borderColor = "red";
      document.getElementById("signin-btn").disabled = true;
    }
  });
  password.addEventListener("input", (event) => {
    if (password.value == null || password.value === "") {
      password2.style.borderColor = "black";
      password.style.borderColor = "black";
      document.getElementById("signin-btn").disabled = true;
    } else if (password.value === password2.value && password.value.length > 0) {
      password2.style.borderColor = "green";
      password.style.borderColor = "green";
      document.getElementById("signin-btn").disabled = false;
    } else {
      password2.style.borderColor = "red";
      password.style.borderColor = "red";
      document.getElementById("signin-btn").disabled = true;
    }
  });
} 
