import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { GoogleMapsContext } from "@vis.gl/react-google-maps";

// Center -> { lat: number, lng: number }
// Radius -> number se mide en metros
function useCircle({ center, radius, ...circleOptions }) {
  const circle = useRef(null);
  const map = useContext(GoogleMapsContext)?.map;

  useEffect(() => {
    if (!map) return;
    circle.current = new google.maps.Circle({ ...circleOptions, map });

    return () => {
      circle.current.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (circle.current && center) {
      circle.current.setCenter(center);
    }
  }, [center]);

  useEffect(() => {
    if (circle.current && radius) {
      circle.current.setRadius(radius);
    }
  }, [radius]);

  return circle.current;
}

const Circle = forwardRef((props, ref) => {
  const circle = useCircle(props);
  useImperativeHandle(ref, () => circle);
  return null;
});

export default Circle;
