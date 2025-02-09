const checkboxCalificacion2 = document.getElementsByName('stars-chk');

// Efecto de las estrellas si se selecciona una mayor se seleccionan las anteriores y si se selecciona una menor se deseleccionan las siguientes despues de la seleccionada pero no la seleccionada y si se selecciona la misma se deseleccionan todas
checkboxCalificacion2.forEach((checkbox, index) => {
    checkbox.addEventListener('click', () => {
        checkboxCalificacion2.forEach((checkbox, index2) => {
            index2 <= index ? checkbox.checked = true : checkbox.checked = false;
        })
    })
});