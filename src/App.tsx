import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { UserContext, UserInfo, UserProvider } from "./context/UserContext";
import CountingPage from "./pages/CountingPage";
import CountingListPage from "./pages/CountinListPage";
import ProductPage from "./pages/ProductPage";
import { Bounce, ToastContainer } from "react-toastify";
import { ProductContextProvider } from "./context/ProductContext";
import SearchByProductnamePage from "./pages/SearchByProductnamePage";
import SerialListPage from "./pages/SerialListPage";
import InventoryPage from "./pages/InventoryPage";
import InventoryDetailPage from "./pages/InventoryDetailPage";
import { useContext, useEffect } from "react";
import axios from "axios";

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
function App() {
  const userContext = useContext(UserContext);
  if (userContext == null) return;
  const { userInfo, setUserInfo } = userContext;

  useEffect(() => {
    // 1️⃣ Setup receiver for native
    window.setUserInfo = (info: UserInfo) => {
      setUserInfo(info);
      if (info.token) {
        localStorage.setItem("authToken", info.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${info.token}`;
      }
    };

    // 2️⃣ Setup interceptor
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (
          !originalRequest?._retry &&
          error.response &&
          [401, 403, 404].includes(error.response.status)
        ) {
          originalRequest._retry = true;

          // Notify native to renew token
          await new Promise<void>((resolve) => {
            window.tokenRenewResolve = resolve;
            window.webkit?.messageHandlers.barcodeScanner.postMessage(
              "tokenExpired"
            );
          });

          // Retry with new token
          const token = userInfo?.token || localStorage.getItem("authToken");
          if (token) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    // 3️⃣ Notify native React is ready
    window.webkit?.messageHandlers?.barcodeScanner.postMessage("reactReady");

    return () => {
      axios.interceptors.response.eject(interceptor);
      delete window.setUserInfo;
    };
  }, []);

  return (
    <>
      <UserProvider>
        <ProductContextProvider>
          <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            pauseOnHover
            pauseOnFocusLoss
            rtl={false}
            transition={Bounce}
            theme="colored"
            toastStyle={{
              width: "360px",
              maxWidth: "80vw",
              borderRadius: "12px",
              padding: "12px",
            }}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/toollogo" element={<CountingListPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route
              path="/inventory/:groupNum"
              element={<InventoryDetailPage />}
            />
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
        </ProductContextProvider>
      </UserProvider>
    </>
  );
}

export default App;
