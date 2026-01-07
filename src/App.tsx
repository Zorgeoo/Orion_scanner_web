import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import { useEffect, useState } from "react";
import api from "./api/axios";

import { InputModel } from "./types/InputModel";
import ToollogoPage from "./pages/ToollogoPage";
import { BaseResponse } from "./types/BaseResponse";

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

export type ModuleModel = [string, string];

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [modules, setModules] = useState<ModuleModel[] | null>(null);

  const getModules = async () => {
    try {
      const input = new InputModel("orion", "spLoad_Ph_PermittedModules");
      input.addParam("@phone", "nvarchar", 50, "91112892");
      input.addParam("@db_name", "nvarchar", 50, "OF_BuyantRashaan_Test");
      const res = await api.post<BaseResponse<ModuleModel[]>>(
        "action/exec_proc",
        input
      );
      console.log(res);

      if (res.data.is_succeeded && res.data.result) {
        setModules(res.data.result);
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

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
    if (userInfo?.phoneNo && userInfo.dbase?.dbName) {
      getModules();
    }
  }, [userInfo]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage modules={modules} />} />
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
