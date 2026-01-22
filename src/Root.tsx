import { useContext, useEffect } from "react";
import { UserContext, UserInfo } from "./context/UserContext";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CountingListPage from "./pages/CountinListPage";
import InventoryPage from "./pages/InventoryPage";
import InventoryDetailPage from "./pages/InventoryDetailPage";
import SerialListPage from "./pages/SerialListPage";
import CountingPage from "./pages/CountingPage";
import SearchByProductnamePage from "./pages/SearchByProductnamePage";
import ProductPage from "./pages/ProductPage";
import api from "./api/axios";
import { showToast } from "./utils/toast";

declare global {
  interface Window {
    webkit?: {
      messageHandlers: {
        barcodeScanner: {
          postMessage: (message: string) => void;
        };
      };
    };
    onBarcodeScanned?: (result: string) => void;
    setUserInfo?: (userInfo: UserInfo) => void;
    tokenRenewResolve?: (value?: void | PromiseLike<void>) => void;
  }
}

const RootPage = () => {
  const context = useContext(UserContext);
  if (context == null) return;
  const { userInfo, setUserInfo } = context;

  useEffect(() => {
    // 1️⃣ Setup receiver for native
    window.setUserInfo = (info: UserInfo) => {
      setUserInfo(info);
      if (info.token) {
        localStorage.setItem("authToken", info.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${info.token}`;
      }
    };

    // 2️⃣ Setup Axios interceptor
    const interceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.code === "ERR_NETWORK" ||
          !error.response ||
          error.message === "Network Error"
        ) {
          showToast.error("Интернэт холболтоо шалгана уу");
          return Promise.reject(error);
        }
        if (error.response && [401, 403, 404].includes(error.response.status)) {
          console.log(error.response);

          originalRequest._retry = true;

          await new Promise<void>((resolve) => {
            window.tokenRenewResolve = resolve;
            // window.webkit?.messageHandlers.barcodeScanner.postMessage(
            //   "tokenExpired"
            // );
            if (window.webkit?.messageHandlers?.barcodeScanner) {
              // iOS
              window.webkit.messageHandlers.barcodeScanner.postMessage(
                "tokenExpired"
              );
            } else if ((window as any).barcodeScanner) {
              // Android
              (window as any).barcodeScanner.postMessage("tokenExpired");
            }
          });

          const token = userInfo?.token || localStorage.getItem("authToken");
          if (token) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    if (window.webkit?.messageHandlers?.barcodeScanner) {
      // iOS
      window.webkit.messageHandlers.barcodeScanner.postMessage("reactReady");
    } else if ((window as any).barcodeScanner) {
      // Android
      (window as any).barcodeScanner.postMessage("reactReady");
    } else {
      alert("it is not mobile device");
    }

    return () => {
      api.interceptors.response.eject(interceptor);
      delete window.setUserInfo;
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/toollogo" element={<CountingListPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/inventory/:groupNum" element={<InventoryDetailPage />} />
      <Route
        path="/toollogo/serialList/:groupNum"
        element={<SerialListPage />}
      />
      <Route path="/toollogo/:countingId" element={<CountingPage />} />
      <Route
        path="/toollogo/:countingId/searchByProductName"
        element={<SearchByProductnamePage />}
      />
      <Route
        path="/toollogo/:countingId/:productId"
        element={<ProductPage />}
      />
    </Routes>
  );
};

export default RootPage;
