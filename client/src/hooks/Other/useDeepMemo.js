import { useRef } from "react";
import isEqual from "lodash/isEqual";

export default function useDeepMemo(value) {
  const ref = useRef();
  const signal = useRef(0);

  if (!isEqual(ref.current, value)) {
    ref.current = value;
    signal.current += 1; // fuerza rerender controlado si cambia el valor real
  }

  return ref.current;
}
