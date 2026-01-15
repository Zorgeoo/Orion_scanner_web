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

          await new Promise<void>((resolve) => {
            window.tokenRenewResolve = resolve;
            window.webkit?.messageHandlers.barcodeScanner.postMessage(
              "tokenExpired"
            );
          });

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
  }, [setUserInfo, userInfo]);

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
