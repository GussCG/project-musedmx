import ReactDOM from "react-dom";

function PopupPortal({ children }) {
  const el = document.getElementById("popup-root");
  return el ? ReactDOM.createPortal(children, el) : null;
}

export default PopupPortal;
