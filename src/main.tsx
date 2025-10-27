import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header.js";
import Sidebar from "./components/Sidebar.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <div className="pt-16">
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);
