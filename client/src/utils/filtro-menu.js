// Esconde los elementos cuando se de click en ( - ) y se muestran cuando se de click en ( + ) con animacion de deslizamiento
const tematica = document.getElementById('tematica');
const alcaldia = document.getElementById('alcaldia');

const botonTematica = document.getElementById('tematica-button');
const botonAlcaldia = document.getElementById('alcaldia-button');

// Obtenemos todos los elementos de los filtros
const tematicaCheckboxes = document.getElementsByName('tematica-filter');
const alcaldiaCheckboxes = document.getElementsByName('alcaldia-filter');

// Mostramos el rango de precios
const rangoPrecio = document.getElementById('rango-precio');
const range = document.getElementById('rango-costo');

// Al dar click se muestra o se esconde el menu de tematica
// Tambien se cambia la imagen del boton a (+) o (-)
botonTematica.addEventListener('click', () => {

    esconderMenu(alcaldia);
    botonAlcaldia.src = '../images/mas-icon.png';

    if (tematica.style.display === 'none' || tematica.style.display === '') {
        tematica.style.display = 'block';
        botonTematica.src = '../images/menos-icon.png';
    } else {
        tematica.style.display = 'none';
        botonTematica.src = '../images/mas-icon.png';
    }
});

// Al dar click se muestra o se esconde el menu de alcaldia
// Tambien se cambia la imagen del boton a (+) o (-)
botonAlcaldia.addEventListener('click', () => {

    esconderMenu(tematica);
    botonTematica.src = '../images/mas-icon.png';

    if (alcaldia.style.display === 'none' || alcaldia.style.display === '') {
        alcaldia.style.display = 'block';
        botonAlcaldia.src = '../images/menos-icon.png';
    } else {
        alcaldia.style.display = 'none';
        botonAlcaldia.src = '../images/mas-icon.png';
    }
});

range.addEventListener('input', () => {
    rangoPrecio.textContent = range.value;
});

// Boton de Borrar para limpiar los filtros
const botonBorrar = document.getElementById('borrar-button');
botonBorrar.addEventListener('click', () => {
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
    // Limpiamos los checkboxes de tematica
    tematicaCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Limpiamos los checkboxes de alcaldia
    alcaldiaCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Limpiamos el rango de precios
    range.value = 0;
    rangoPrecio.textContent = 0;
}

function cerrarFiltros() {
    const filtroMenu = document.getElementById('filtro-menu');
    const fondoOpaco = document.getElementById('fondo-opaco');
    filtroMenu.style.transform = 'translateX(100%)';
    fondoOpaco.style.display = 'none';
    tematica.style.display = 'none';
    alcaldia.style.display = 'none';
    botonTematica.src = '../images/mas-icon.png';
    botonAlcaldia.src = '../images/mas-icon.png';
    borrarFiltros();
}

// Funcion para esconder un menu cuando se de click en otro menu
function esconderMenu(menu) {
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    }
}