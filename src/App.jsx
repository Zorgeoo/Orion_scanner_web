import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScanPage from "./pages/ScanPage";
import BarcodeScanner from "./pages/Zxing";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/zxing" element={<BarcodeScanner />} />
      </Routes>
    </>
  );
}

export default App;
