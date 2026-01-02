import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import { useEffect, useState } from "react";

export interface databaseModel {
  companyRegNo: string;
  server: string;
  dbName: string;
  companyName: string;
}

export interface UserInfo {
  phoneNo: string;
  token: string;
  dbase: databaseModel;
}
function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // 📥 Setup receiver for user info from native app

    window.setUserInfo = (info: UserInfo) => {
      console.log("✅ Received user info from native:", info);
      setUserInfo(info);

      // Store token in localStorage if needed
      if (info.token) {
        localStorage.setItem("authToen", info.token);
      }
    };

    if (window.webkit?.messageHandlers?.barcodeScanner) {
      window.webkit.messageHandlers.barcodeScanner.postMessage("reactReady");
    }

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
