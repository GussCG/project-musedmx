import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import buscarimg from "../assets/icons/buscar-icon.png";

function NavBar() {
  // Para el input de busqueda
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/Museos?search=${encodeURIComponent(input)}`);
  };

  return (
    <div className="nav-bar">
      <form onSubmit={handleSubmit}>
        <button type="submit">
          <img src={buscarimg} alt="Buscar" />
        </button>
        <input
          type="text"
          name="search"
          id="search"
          value={input}
          placeholder="Buscar Museos de ..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}

export default NavBar;
