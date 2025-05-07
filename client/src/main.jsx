import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import AppWrapper from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </StrictMode>
);
