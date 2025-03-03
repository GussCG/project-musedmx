import React, { useState, forwardRef } from "react";

const MenuSort = forwardRef(({ sortBy, onSortChange }, ref) => {
  const [selectedSort, setSelectedSort] = useState(sortBy);

  const handleSort = (value) => {
    setSelectedSort(value);
    onSortChange(value); // Para enviar el valor seleccionado al componente padre
  };

  return (
    <div className="menu-sort-container" ref={ref}>
      <div className="menu-sort-item">
        <label htmlFor="sort-alf">A-Z</label>
        <label className="filtro-rad">
          <input
            type="radio"
            name="sort-filter"
            id="sort-alf"
            checked={selectedSort === "name"}
            onChange={() => handleSort("name")}
          />
          <span className="radio-filter-span"></span>
        </label>
      </div>
      <div className="menu-sort-item">
        <label htmlFor="sort-calif">Calificación</label>
        <label className="filtro-rad">
          <input
            type="radio"
            name="sort-filter"
            id="sort-calif"
            checked={selectedSort === "rating"}
            onChange={() => handleSort("rating")}
          />
          <span className="radio-filter-span"></span>
        </label>
      </div>
      <div className="menu-sort-item">
        <label htmlFor="sort-dist">Distancia</label>
        <label className="filtro-rad">
          <input
            type="radio"
            name="sort-filter"
            id="sort-dist"
            checked={selectedSort === "distance"}
            onChange={() => handleSort("distance")}
          />
          <span className="radio-filter-span"></span>
        </label>
      </div>
      <div className="menu-sort-item">
        <button className="menu-sort-button" onClick={() => handleSort("")}>
          Limpiar
        </button>
      </div>
    </div>
  );
});

export default MenuSort;
