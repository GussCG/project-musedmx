import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { GoogleMapsContext } from "@vis.gl/react-google-maps";

const Circle = forwardRef(
  (
    { center, radius, animateOnMount = true, duration = 500, ...circleOptions },
    ref
  ) => {
    const circle = useRef(null);
    const map = useContext(GoogleMapsContext)?.map;
    const [currentRadius, setCurrentRadius] = useState(0);
    const animationRef = useRef(null);

    // Configuración inicial del círculo
    useEffect(() => {
      if (!map) return;

      circle.current = new google.maps.Circle({
        ...circleOptions,
        map,
        radius: animateOnMount ? 0 : radius,
      });

      if (animateOnMount) {
        animateRadius(radius);
      } else {
        setCurrentRadius(radius);
      }

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (circle.current) {
          circle.current.setMap(null);
        }
      };
    }, [map]);

    // Función para animar el radio
    const animateRadius = (targetRadius) => {
      const startTime = performance.now();
      const startRadius = currentRadius;

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);
        const newRadius =
          startRadius + (targetRadius - startRadius) * easedProgress;

        setCurrentRadius(newRadius);
        if (circle.current) {
          circle.current.setRadius(newRadius);
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Función de easing
    const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    // Actualizar centro si cambia
    useEffect(() => {
      if (circle.current && center) {
        circle.current.setCenter(center);
      }
    }, [center]);

    // Actualizar radio si cambia
    useEffect(() => {
      if (circle.current && radius !== currentRadius) {
        if (animateOnMount) {
          animateRadius(radius);
        } else {
          setCurrentRadius(radius);
          circle.current.setRadius(radius);
        }
      }
    }, [radius]);

    useImperativeHandle(ref, () => circle.current);

    return null;
  }
);

export default Circle;
