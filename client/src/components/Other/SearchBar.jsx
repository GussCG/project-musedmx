import { useState, useEffect, useRef } from "react";
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
  initialValue = "",
}) {
  // 1. Estado inicial con lazy initialization
  const [input, setInput] = useState(() => initialValue);

  // 2. Referencia para el valor inicial anterior
  const initialValueRef = useRef(initialValue);
  const inputRef = useRef(input);

  // 3. Efecto para sincronizar initialValue solo cuando cambia realmente
  useEffect(() => {
    if (initialValueRef.current !== initialValue) {
      initialValueRef.current = initialValue;
      setInput(initialValue);
      inputRef.current = initialValue;
    }
  }, [initialValue]);

  // 4. Efecto para sugerencias (optimizado)
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(suggestions);

  useEffect(() => {
    suggestionsRef.current = suggestions;
  }, [suggestions]);

  useEffect(() => {
    if (input.length > 0 && Array.isArray(suggestionsRef.current)) {
      const newFiltered = suggestionsRef.current.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
      );

      setFilteredSuggestions((prev) => {
        // Comparación profunda optimizada
        if (JSON.stringify(prev) !== JSON.stringify(newFiltered)) {
          return newFiltered;
        }
        return prev;
      });
    } else {
      setFilteredSuggestions([]);
    }
  }, [input]); // Eliminamos suggestions de las dependencias

  // 5. Validación (con chequeo de igualdad)
  const [isInputValid, setIsInputValid] = useState(false);
  const [error, setError] = useState(null);
  const searchRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-.,;:¡!¿?'()]+$/;

  useEffect(() => {
    const isValid = input.trim() !== "" && searchRegex.test(input);
    const newError =
      isValid || input.trim() === ""
        ? null
        : "Por favor, ingresa un término de búsqueda válido.";

    // Solo actualizar si hay cambios reales
    if (isInputValid !== isValid || error !== newError) {
      setIsInputValid(isValid);
      setError(newError);
    }
  }, [input, isInputValid, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInputValid) {
      onSearch?.(input);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
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

  const [activeIndex, setActiveIndex] = useState(-1);
  const activeItemRef = useRef(null);

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filteredSuggestions.length) {
        e.preventDefault();
        handleSuggestionClick(filteredSuggestions[activeIndex]);
      }
    }
  };

  useEffect(() => {
    if (input.length > 0 && Array.isArray(suggestionsRef.current)) {
      const newFiltered = suggestionsRef.current.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
      );
      console.log("Filtradas:", newFiltered); // <- añade esto

      setFilteredSuggestions((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newFiltered)) {
          setActiveIndex(-1);
          return newFiltered;
        }
        return prev;
      });
    } else {
      setFilteredSuggestions([]);
      setActiveIndex(-1);
    }
  }, [input]);

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
          onFocus={() => setShowSuggestions(true)}
          onBlur={handleInputBlur}
          autoComplete="off"
          onKeyDown={handleKeyDown}
        />
        {showSuggestions && (
          <ul className="suggestions-list">
            {error && <li className="error-message">{error}</li>}

            {filteredSuggestions.length > 0 && !error
              ? filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    ref={index === activeIndex ? activeItemRef : null}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      backgroundColor:
                        activeIndex === index ? "#f0f0f0" : "transparent",
                      fontWeight: activeIndex === index ? "bold" : "normal",
                    }}
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
