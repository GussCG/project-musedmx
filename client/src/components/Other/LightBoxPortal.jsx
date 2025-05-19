// LightBoxPortal.jsx
import ReactDOM from "react-dom";

function LightBoxPortal({ children }) {
  const el = document.getElementById("lightbox-root");
  return el ? ReactDOM.createPortal(children, el) : null;
}

export default LightBoxPortal;
