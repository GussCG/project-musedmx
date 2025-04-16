import { createContext, useState, useContext } from "react";

const ViewModeContext = createContext();

export const ViewModeProvider = ({ children }) => {
  const [isMapView, setIsMapView] = useState(false);

  return (
    <ViewModeContext.Provider value={{ isMapView, setIsMapView }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = () => {
  return useContext(ViewModeContext);
};
