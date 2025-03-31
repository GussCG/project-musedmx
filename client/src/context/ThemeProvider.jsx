import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [toggleCount, setToggleCount] = useState(
    Number(localStorage.getItem("toggleCount")) || 0
  );

  const [isRetroMode, setIsRetroMode] = useState(
    localStorage.getItem("theme") === "retro"
  );

  useEffect(() => {
    const theme = isRetroMode ? "retro" : isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    localStorage.setItem("toggleCount", toggleCount);
  }, [isDarkMode, isRetroMode, toggleCount]);

  const toggleTheme = () => {
    const newCount = toggleCount + 1;
    setToggleCount(newCount);

    // Se activa el modo retro despues de 30 toggles
    if (isRetroMode) {
      setIsRetroMode(false);
      setToggleCount(0);
      setIsDarkMode(true);
    } else if (newCount == 30) {
      setIsDarkMode(false);
      setIsRetroMode(true);
      console.log("Easter egg activado");
    } else {
      setIsDarkMode(!isDarkMode);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleTheme, isRetroMode, toggleCount }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
