import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import ScanResult from "./pages/ScanResult";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<FullscreenScanner />} />
        <Route path="/scan-result" element={<ScanResult />} />
      </Routes>
    </>
  );
}

export default App;
