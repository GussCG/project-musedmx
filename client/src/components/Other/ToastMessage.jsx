import { useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToastMessage({
  tipo = "info",
  mensaje,
  position,
  onClose = () => {},
}) {
  useEffect(() => {
    if (!mensaje) return;

    toast[tipo](mensaje, {
      position: position || "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
      className: `musedmx-toast ${tipo}`,
      onClose: onClose,
    });
  }, [mensaje, tipo, position, onClose]);

  return null;
}

export default ToastMessage;
