import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import { useEffect, useState } from "react";

import ToollogoPage from "./pages/ToollogoPage";
import { getModules, ModuleModel } from "./api/services";

export interface databaseModel {
  companyRegNo: string;
  server: string;
  dbName: string;
  companyName: string;
}

export interface UserInfo {
  phoneNo: string;
  token: string;
  dbase?: databaseModel;
}

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [modules, setModules] = useState<ModuleModel[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // 📥 Setup receiver for user info from native app

    window.setUserInfo = (info: UserInfo) => {
      setUserInfo(info);
      if (info.token) {
        localStorage.setItem("authToken", info.token);
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

  useEffect(() => {
    if (!userInfo) return;

    const fetchModules = async () => {
      setIsLoading(true);
      const result = await getModules(
        userInfo.phoneNo,
        userInfo.dbase?.dbName || ""
      );
      setModules(result);
      setIsLoading(false);
    };

    fetchModules();
  }, [userInfo]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<HomePage isLoading={isLoading} modules={modules} />}
        />
        <Route
          path="/inventory"
          element={<FullscreenScanner userInfo={userInfo} />}
        />
        <Route path="/toollogo" element={<ToollogoPage />} />
      </Routes>
    </>
  );
}

export default App;
