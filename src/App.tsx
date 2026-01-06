import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";
import { useEffect, useState } from "react";
import api from "./api/axios";

import { APIResponse } from "./types/APIResponse";
import { InputModel } from "./types/InputModel";
import axios from "axios";

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
  const [token, setToken] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const getModules = async (phone: string, dbase: string) => {
    setCount(11);
    try {
      const input = new InputModel("orion", "spLoad_Ph_PermittedModules");
      input.addParam("@phone", "nvarchar", 50, phone);
      input.addParam("@db_name", "nvarchar", 50, dbase);
      const res = await api.post<APIResponse>("action/exec_proc", { input });

      if (res.data.is_succeeded) {
        // setCount(res.data.result?.length);
        setCount(77);
      } else {
        setCount(66);
      }
    } catch (error: unknown) {
      setCount(99);
      if (axios.isAxiosError(error)) {
        // Axios error: you can inspect response
        if (error.response) {
          // Server responded with a status code out of 2xx range
          setErrorMsg(
            `Error ${error.response.status}: ${JSON.stringify(
              error.response.data
            )}`
          );
        } else if (error.request) {
          // Request was made but no response received
          setErrorMsg("No response received from server");
        } else {
          // Something happened setting up the request
          setErrorMsg(`Axios setup error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        // Generic JS error
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unexpected error occurred");
      }

      console.log(error); // <-- this will give full stack trace in console
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

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
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
      </Routes>
    </>
  );
}

export default App;
