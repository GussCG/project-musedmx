// Mostrar el rango que selecciono
const value = document.getElementById("rango-radio");
const input = document.getElementById("museos-range-ubicacion");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});