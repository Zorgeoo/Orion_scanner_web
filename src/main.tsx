import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="pt-safe">
        <Header />
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);
