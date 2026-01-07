import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import { useEffect, useState } from "react";
import api from "./api/axios";

import { InputModel } from "./types/InputModel";
import axios from "axios";
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

interface Modules {
  moduleCode: string;
  moduleName: string;
}
function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [modules, setModules] = useState<Modules[] | null>(null);

  const getModules = async () => {
    try {
      const input = new InputModel("orion", "spLoad_Ph_PermittedModules");
      input.addParam("@phone", "nvarchar", 50, "91112892");
      input.addParam("@db_name", "nvarchar", 50, "OF_BuyantRashaan_Test");
      const res = await api.post<BaseResponse<Modules[]>>(
        "action/exec_proc",
        input
      );
      console.log(res);

      if (res.data.is_succeeded && res.data.result) {
        setCount(res.data.result?.length);
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
        setToken(true);
      }

      // if (info.phoneNo && info.dbase?.dbName) {
      //   getModules(info.phoneNo, info.dbase?.dbName);
      // }
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
        <Route
          path="/"
          element={
            <HomePage
              getModules={getModules}
              token={token}
              error={errorMsg}
              userInfo={userInfo}
              count={count}
            />
          }
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
