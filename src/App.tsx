import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";

import { UserProvider } from "./context/UserContext";
import CountingPage from "./pages/CountingPage";
import CountingListPage from "./pages/CountinListPage";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<FullscreenScanner />} />
          <Route path="/toollogo" element={<CountingListPage />} />
          <Route path="/toollogo/:countingId" element={<CountingPage />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
