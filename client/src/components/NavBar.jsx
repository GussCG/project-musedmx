import React, { use, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ErrorCampo from "./ErrorCampo";

import Icons from "./IconProvider";
import axios from "axios";
const { IoSearch } = Icons;

function NavBar() {
  // Para el input de busqueda
  const [input, setInput] = useState("");
  const [museumSuggestions, setMuseumSuggestions] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Sugerencias de museos (nombres de museos)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const museosResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/museos/nombres`
        );
        setMuseumSuggestions(museosResponse.data.museos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Validacion de la busqueda (solo letras, espacios y algunos caracteres especiales, sin numeros ni simbolos ni en blanco)
  const searchRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-.,;:¡!¿?']+$/;

  useEffect(() => {
    if (input.length > 0) {
      // Creamos las sugerencias combinando los nombres de museos y las tematicas
      const sugerenciasNombres = museumSuggestions.map(
        (museo) => museo.mus_nombre
      );

      const allSuggestions = [...sugerenciasNombres];

      const filteredSuggestions = allSuggestions.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
      );

      setSugerencias(filteredSuggestions);
      setShowSugerencias(filteredSuggestions.length > 0);
    } else {
      setSugerencias([]);
      setShowSugerencias(false);
    }
  }, [input, museumSuggestions]);

  const validateInput = (value) => {
    if (!value.trim() || !searchRegex.test(value)) {
      return "Por favor, ingresa un término de búsqueda válido.";
    }

    return null; // Sin errores
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateInput(input);

    if (validationError) {
      setError(validationError); // Establecer el error si hay uno
      return;
    }

    setError(null); // Limpiar el error si hay un término válido
    // Redirigir a la página de museos con el término de búsqueda
    navigate(`/Museos/busqueda?search=${encodeURIComponent(input)}`);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    const validationError = validateInput(value);

    if (value.length > 0 && validationError) {
      setError(validationError); // Establecer el error si hay uno
    } else {
      setError(null); // Limpiar el error si no hay error
    }

    setInput(value);
  };

  const highlightMatchedText = (text) => {
    if (!input.trim()) return text;

    const escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapar caracteres especiales

    const parts = [];
    let lastIndex = 0;
    const regex = new RegExp(escapedInput, "gi");
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Texto antes del match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Texto coincidente (resaltado)
      parts.push(
        <span key={match.index} className="highlighted-text">
          {match[0]}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // Texto restante después del último match
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSugerencias(false); // Ocultar las sugerencias al seleccionar una
    setError(null); // Limpiar el error al seleccionar una sugerencia

    // Redirigir a la página de museos con el término de búsqueda
    navigate(`/Museos/busqueda?search=${encodeURIComponent(suggestion)}`);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSugerencias(false); // Ocultar las sugerencias después de un breve retraso
    }, 200); // Ajusta el tiempo según sea necesario
  };

  return (
    <motion.div
      className="nav-bar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        <button type="submit">
          <IoSearch />
        </button>
        <div className="search-container">
          <input
            type="text"
            name="search"
            id="search"
            value={input}
            placeholder="Buscar Museos de ..."
            onChange={handleInputChange}
            onFocus={() => input.length > 0 && setShowSugerencias(true)}
            onBlur={handleInputBlur}
            autoComplete="off"
          />
          {showSugerencias && sugerencias.length > 0 && (
            <ul className="suggestions-list">
              {sugerencias.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {highlightMatchedText(suggestion)}
                </li>
              ))}
            </ul>
          )}
          {error && (
            <AnimatePresence mode="wait">
              <motion.div
                className="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                key="error-message"
              >
                {error}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </form>
    </motion.div>
  );
}

export default NavBar;
