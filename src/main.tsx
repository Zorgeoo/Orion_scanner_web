import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { HashRouter } from "react-router-dom";
import Header from "./components/Header.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <div className="app-root">
        <Header />
        <main className="app-content">
          <App />
        </main>
      </div>
    </HashRouter>
  </StrictMode>
);
