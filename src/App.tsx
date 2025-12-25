import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import { useEffect, useState } from "react";

export interface UserInfo {
  token: string;
  username: string;
}
function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // 📥 Setup receiver for user info from native app

    window.setUserInfo = (info: UserInfo) => {
      console.log("✅ Received user info from native:", info);
      setUserInfo(info);

      if (window.webkit?.messageHandlers?.barcodeScanner) {
        window.webkit.messageHandlers.barcodeScanner.postMessage("reactReady");
      }

      // Store token in localStorage if needed
      if (info.token) {
        localStorage.setItem("authToen", info.token);
      }
    };

    // Cleanup
    return () => {
      delete window.setUserInfo;
    };
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage userInfo={userInfo} />} />
        <Route
          path="/inventory"
          element={<FullscreenScanner userInfo={userInfo} />}
        />
      </Routes>
    </>
  );
}

export default App;
