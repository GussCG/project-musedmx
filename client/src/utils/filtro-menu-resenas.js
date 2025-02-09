// PARA MENU FILTRO RESEÑAS
const calificacionmenu = document.getElementById('calificacion-menu');
const fechamenu = document.getElementById('fecha-menu');

const botonCalificacion = document.getElementById('calificacion-button');
const botonFecha = document.getElementById('fecha-button');

// Obtener los elementos del filtro
const checkboxCalificacion = document.getElementsByName('stars-chk');
const checkboxFecha = document.getElementsByName('fecha-filter');


// Al dar click se muestra o se esconde el menu de calificacion
// Tambien se cambia la imagen del boton a (+) o (-)
botonCalificacion.addEventListener('click', () => {

    // esconderMenu(fechamenu);
    botonFecha.src = '../images/mas-icon.png';

    if (calificacionmenu.style.display === 'none' || calificacionmenu.style.display === '') {
        calificacionmenu.style.display = 'block';
        botonCalificacion.src = '../images/menos-icon.png';
    } else {
        calificacionmenu.style.display = 'none';
        botonCalificacion.src = '../images/mas-icon.png';
    }
});

// Al dar click se muestra o se esconde el menu de fecha
// Tambien se cambia la imagen del boton a (+) o (-)
botonFecha.addEventListener('click', () => {

    // esconderMenu(calificacionmenu);
    botonCalificacion.src = '../images/mas-icon.png';

    if (fechamenu.style.display === 'none' || fechamenu.style.display === '') {
        fechamenu.style.display = 'block';
        botonFecha.src = '../images/menos-icon.png';
    } else {
        fechamenu.style.display = 'none';
        botonFecha.src = '../images/mas-icon.png';
    }
});

// Al dar click en el boton de limpiar se deseleccionan todos los checkbox
// Boton para limpiar los filtros
const botonLimpiar = document.getElementById('limpiar-button');
botonLimpiar.addEventListener('click', () => {
    borrarFiltros();
});

// Mostrar el menu de filtros y poner un fondo opaco
const botonFiltro = document.getElementById('filtrar-button');
botonFiltro.addEventListener('click', () => {
    mostrarFiltros();
});


// Si se da clic en el boton de cerrar se regresa el menu de filtros a su posicion original y se quita el fondo opaco
const botonCerrar = document.getElementById('filtro-menu-close-button');
botonCerrar.addEventListener('click', () => {
    cerrarFiltros();    
});

function mostrarFiltros() {
    const filtroMenu = document.getElementById('filtro-menu');
    const fondoOpaco = document.getElementById('fondo-opaco');

    filtroMenu.style.transform = 'translateX(0)';
    fondoOpaco.style.display = 'block';
}

function borrarFiltros() {
    // Limpiamos los checkboxes de calificacion
    checkboxCalificacion.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Limpiamos los checkboxes de fecha
    checkboxFecha.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function cerrarFiltros() {
    const filtroMenu = document.getElementById('filtro-menu');
    const fondoOpaco = document.getElementById('fondo-opaco');
    filtroMenu.style.transform = 'translateX(100%)';
    fondoOpaco.style.display = 'none';
    calificacionmenu.style.display = 'none';
    fechamenu.style.display = 'none';
    botonCalificacion.src = '../images/mas-icon.png';
    botonFecha.src = '../images/mas-icon.png';
    borrarFiltros();
}

function esconderMenu(menu) {
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    }
}
