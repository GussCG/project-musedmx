import Icons from "./IconProvider";
const { MdKeyboardDoubleArrowDown } = Icons;

function ScrollIndicator({ ...props }) {
  return (
    <div
      className="scroll-indicator"
      style={props.style}
      title="Desplázate hacia abajo para ver más contenido"
    >
      <div className="scroll-indicator-icon">
        <MdKeyboardDoubleArrowDown />
      </div>
    </div>
  );
}

export default ScrollIndicator;
