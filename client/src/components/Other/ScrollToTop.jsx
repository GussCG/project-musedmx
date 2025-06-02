import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const scrollToTop = () => {
  // Función para desplazar la ventana a la parte superior
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll a la parte superior cada vez que cambia la ruta
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
