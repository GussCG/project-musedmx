import Icons from "./IconProvider";
const { FaChevronDown } = Icons;

function ScrollIndicator({ color }) {
  return (
    <div
      className="scroll-indicator"
      title="Desplázate hacia abajo para más información"
      {...(color && { style: { borderColor: color } })}
    >
      <FaChevronDown className="scroll-icon" {...(color && { color })} />
    </div>
  );
}

export default ScrollIndicator;
