import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import AppWrapper from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
);
