import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Icons from "./IconProvider";
const { IoSearch, CgClose, IoMdArrowDropdown } = Icons;

function SearchBar({
  placeholder = "Buscar...",
  suggestions = [],
  onSearch,
  onSuggestionSelect,
  showNoResults = false,
  searchIcon = true,
}) {
  // Para el input de busqueda
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);
  const [error, setError] = useState(null); // Estado para manejar errores

  // Validacion de la busqueda (solo letras, espacios y algunos caracteres especiales, sin numeros ni simbolos ni en blanco)
  const searchRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-.,;:¡!¿?'()]+$/;

  useEffect(() => {
    if (input.length > 0 && Array.isArray(suggestions)) {
      const sugerenciasNombres = suggestions.map((museo) => museo.mus_nombre);
      const allSuggestions = [...sugerenciasNombres];
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true); // Mostrar sugerencias automáticamente al escribir
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, suggestions]);

  useEffect(() => {
    if (input.trim() === "") {
      setError(null);
      setIsInputValid(false);
    } else if (!searchRegex.test(input)) {
      setError("Por favor, ingresa un término de búsqueda válido.");
      setIsInputValid(false);
    } else {
      setError(null);
      setIsInputValid(true);
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInputValid) {
      onSearch?.(input);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
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
    onSuggestionSelect?.(suggestion);
    setInput("");
    setShowSuggestions(false);
    setFilteredSuggestions([]); // Limpiar las sugerencias después de la selección
    setError(null);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false); // Ocultar las sugerencias después de un breve retraso
    }, 200); // Ajusta el tiempo según sea necesario
  };

  const handleClearInput = () => {
    setInput("");
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setError(null);
  };

  const toggleShowSuggestions = () => {
    setShowSuggestions((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit}>
      {searchIcon && (
        <button type="submit" disabled={!isInputValid}>
          <IoSearch />
        </button>
      )}
      <div className="search-container">
        <input
          type="text"
          value={input}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(input.length > 0)}
          onBlur={handleInputBlur}
          autoComplete="off"
        />
        {showSuggestions && (
          <ul className="suggestions-list">
            {error && <li className="error-message">{error}</li>}

            {filteredSuggestions.length > 0 && !error
              ? filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {highlightMatchedText(suggestion)}
                  </li>
                ))
              : !error && (
                  <li className="no-suggestions">No hay sugerencias</li>
                )}
          </ul>
        )}
        {showNoResults &&
          showSuggestions &&
          filteredSuggestions.length === 0 && (
            <motion.div
              className="no-results"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              key="no-results-message"
            >
              No se encontraron resultados
            </motion.div>
          )}
      </div>
      <div className="button-container">
        <button type="button" onClick={handleClearInput}>
          <CgClose />
        </button>
        <button type="button" onClick={toggleShowSuggestions}>
          <IoMdArrowDropdown
            style={{
              transform: showSuggestions ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
