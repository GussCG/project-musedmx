import { useState } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useNavigate } from "react-router-dom";
// Imagen de prueba
import museoImagen from "../../assets/images/others/museo-main-1.jpg";
import Icons from "../Other/IconProvider";
const { museoIcon } = Icons;

function CustomAdvancedMarker({ lat, lng, nombre, idMuseo }) {
  const [hovered, setHovered] = useState(false);
  const position = { lat, lng };
  const navigate = useNavigate();

  return (
    <AdvancedMarker
      position={position}
      title={nombre}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`custom-marker ${hovered ? "hovered" : ""}`}>
        <div className="marker-container">
          <img src={museoIcon} alt={nombre} className="custom-marker-image" />
        </div>

        <div className="marker-tail-border" />
        <div className="marker-tail" />
      </div>
    </AdvancedMarker>
  );
}

export default CustomAdvancedMarker;
