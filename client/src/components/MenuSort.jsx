import React, { useState, forwardRef } from "react";

import { motion } from "framer-motion";

const MenuSort = forwardRef(({ sortBy, onSortChange }, ref) => {
  const [selectedSort, setSelectedSort] = useState(sortBy);

  const handleSort = (value) => {
    setSelectedSort(value);
    onSortChange(value); // Para enviar el valor seleccionado al componente padre
  };

  return (
    <motion.div
      className="menu-sort-container"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="menu-sort-item">
        <label htmlFor="sort-alf">Z-A</label>
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
        <label htmlFor="sort-calif">Mejor Calificación</label>
        <label className="filtro-rad">
          <input
            type="radio"
            name="sort-filter"
            id="sort-best-calif"
            checked={selectedSort === "best-rating"}
            onChange={() => handleSort("best-rating")}
          />
          <span className="radio-filter-span"></span>
        </label>
      </div>
      <div className="menu-sort-item">
        <label htmlFor="sort-calif">Peor Calificación</label>
        <label className="filtro-rad">
          <input
            type="radio"
            name="sort-filter"
            id="sort-worst-calif"
            checked={selectedSort === "worst-rating"}
            onChange={() => handleSort("worst-rating")}
          />
          <span className="radio-filter-span"></span>
        </label>
      </div>
      {/* <div className="menu-sort-item">
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
      </div> */}
      <div className="menu-sort-item">
        <button className="menu-sort-button" onClick={() => handleSort("")}>
          Limpiar
        </button>
      </div>
    </motion.div>
  );
});

export default MenuSort;
