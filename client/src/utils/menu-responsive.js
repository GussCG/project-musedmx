// Obtenemos el boton cerrar
const boton = document.getElementById('menu-button');
// Obtenemos el menu
const menu = document.getElementById('menu-responsive');

boton.addEventListener('click', () => {
    boton.classList.toggle('close');
    menu.classList.toggle('show');
});

