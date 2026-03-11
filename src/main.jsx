import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
// configuration de l'internationalisation
import "@/i18n";
// styles globaux de l'application
import "@/styles/index.css";

/**
 * Point d'entree principal de l'application React
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
