import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import ToollogoPage from "./pages/ToollogoPage";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<FullscreenScanner />} />
          <Route path="/toollogo" element={<ToollogoPage />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
