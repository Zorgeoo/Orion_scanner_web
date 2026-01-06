import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import { useEffect, useState } from "react";
import api from "./api/axios";

import { APIResponse } from "./types/APIResponse";
import { InputModel } from "./types/InputModel";

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

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // 📥 Setup receiver for user info from native app

    window.setUserInfo = (info: UserInfo) => {
      setUserInfo(info);

      if (info.token) {
        localStorage.setItem("token", info.token);
      }

      if (info.phoneNo && info.dbase?.dbName) {
        getModules(info.phoneNo, info.dbase?.dbName);
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

  const getModules = async (phone: string, dbase: string) => {
    try {
      const input = new InputModel("orion", "spLoad_Ph_PermittedModules");
      input.addParam("@phone", "nvarchar", 50, phone);
      input.addParam("@db_name", "nvarchar", 50, dbase);
      const res = await api.post<APIResponse>("action/exec_proc", { input });

      if (res.data.result) {
        setCount(res.data.result?.length);
      }
    } catch (error) {}
  };
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<HomePage userInfo={userInfo} count={count} />}
        />
        <Route
          path="/inventory"
          element={<FullscreenScanner userInfo={userInfo} />}
        />
      </Routes>
    </>
  );
}

export default App;
