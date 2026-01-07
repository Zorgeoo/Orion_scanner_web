import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import ToollogoPage from "./pages/CountinListPage";
import { UserProvider } from "./context/UserContext";
import CountingPage from "./pages/CountingPage";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<FullscreenScanner />} />
          <Route path="/toollogo" element={<ToollogoPage />} />
          <Route path="/toollogo/:countingId" element={<CountingPage />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
