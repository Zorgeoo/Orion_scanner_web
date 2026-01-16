// import { useContext, useEffect } from "react";
// import { UserContext, UserInfo } from "./context/UserContext";
// import axios from "axios";
// import { Route, Routes } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import CountingListPage from "./pages/CountinListPage";
// import InventoryPage from "./pages/InventoryPage";
// import InventoryDetailPage from "./pages/InventoryDetailPage";
// import SerialListPage from "./pages/SerialListPage";
// import CountingPage from "./pages/CountingPage";
// import SearchByProductnamePage from "./pages/SearchByProductnamePage";
// import ProductPage from "./pages/ProductPage";

// declare global {
//   interface Window {
//     webkit?: {
//       messageHandlers: {
//         barcodeScanner: {
//           postMessage: (message: string) => void;
//         };
//       };
//     };
//     onBarcodeScanned?: (result: string) => void;
//     setUserInfo?: (userInfo: UserInfo) => void;
//     tokenRenewResolve?: (value?: void | PromiseLike<void>) => void;
//   }
// }

// const RootPage = () => {
//   const context = useContext(UserContext);
//   if (context == null) return;
//   const { userInfo, setUserInfo } = context;

//   useEffect(() => {
//     // 1️⃣ Setup receiver for native
//     window.setUserInfo = (info: UserInfo) => {
//       setUserInfo(info);
//       if (info.token) {
//         localStorage.setItem("authToken", info.token);
//         axios.defaults.headers.common["Authorization"] = `Bearer ${info.token}`;
//       }
//     };

//     // 2️⃣ Setup Axios interceptor
//     const interceptor = axios.interceptors.response.use(
//       (res) => res,
//       async (error) => {
//         const originalRequest = error.config;

//         if (
//           !originalRequest?._retry &&
//           error.response &&
//           [401, 403, 404].includes(error.response.status)
//         ) {
//           console.log(error.response);

//           originalRequest._retry = true;

//           await new Promise<void>((resolve) => {
//             window.tokenRenewResolve = resolve;
//             window.webkit?.messageHandlers.barcodeScanner.postMessage(
//               "tokenExpired"
//             );
//           });

//           const token = userInfo?.token || localStorage.getItem("authToken");
//           if (token) {
//             originalRequest.headers["Authorization"] = `Bearer ${token}`;
//             return axios(originalRequest);
//           }
//         }

//         return Promise.reject(error);
//       }
//     );

//     // 3️⃣ Notify native React is ready
//     window.webkit?.messageHandlers?.barcodeScanner.postMessage("reactReady");

//     return () => {
//       axios.interceptors.response.eject(interceptor);
//       delete window.setUserInfo;
//     };
//   }, []);

//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/toollogo" element={<CountingListPage />} />
//       <Route path="/inventory" element={<InventoryPage />} />
//       <Route path="/inventory/:groupNum" element={<InventoryDetailPage />} />
//       <Route
//         path="/toollogo/serialList/:groupNum"
//         element={<SerialListPage />}
//       />
//       <Route path="/toollogo/:countingId" element={<CountingPage />} />
//       <Route
//         path="/toollogo/:countingId/searchByProductName"
//         element={<SearchByProductnamePage />}
//       />
//       <Route
//         path="/toollogo/:countingId/:productId"
//         element={<ProductPage />}
//       />
//     </Routes>
//   );
// };

// export default RootPage;
import { useContext, useEffect, useRef } from "react";
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

let responseInterceptorId: number | null = null;
let setupDone = false;

const RootPage = () => {
  const context = useContext(UserContext);
  if (context == null) return;

  const { userInfo, setUserInfo } = context;
  const isRefreshingRef = useRef(false);
  const failedQueueRef = useRef<Array<(token: string) => void>>([]);

  useEffect(() => {
    // 1️⃣ Setup receiver for native
    window.setUserInfo = (info: UserInfo) => {
      console.log(
        "✅ setUserInfo called with token:",
        info.token?.substring(0, 10) + "..."
      );
      setUserInfo(info);
      if (info.token) {
        localStorage.setItem("authToken", info.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${info.token}`;

        // ✅ Resolve any pending token refresh
        if (window.tokenRenewResolve) {
          console.log("✅ Resolving token refresh");
          window.tokenRenewResolve();
        }

        // ✅ Process queued requests
        console.log(
          "✅ Processing queued requests:",
          failedQueueRef.current.length
        );
        failedQueueRef.current.forEach((callback) => {
          callback(info.token);
        });
        failedQueueRef.current = [];
      }
    };

    // 2️⃣ Only set up interceptor once
    if (!setupDone) {
      setupDone = true;
      console.log("🔧 Setting up axios interceptor");

      responseInterceptorId = axios.interceptors.response.use(
        (res) => res,
        async (error) => {
          const originalRequest = error.config as any;

          console.log(
            "❌ Intercepted error:",
            error.response?.status,
            error.response?.statusText
          );

          if (
            !originalRequest?._retry &&
            error.response &&
            [401, 403, 404].includes(error.response.status)
          ) {
            console.log("🔄 Starting token refresh process");
            originalRequest._retry = true;

            // ✅ If already refreshing, queue the request
            if (isRefreshingRef.current) {
              console.log("⏳ Already refreshing, queueing request");
              return new Promise<void>((resolve) => {
                failedQueueRef.current.push((token: string) => {
                  console.log("🔁 Retrying queued request with new token");
                  originalRequest.headers["Authorization"] = `Bearer ${token}`;
                  resolve();
                });
              }).then(() => axios(originalRequest));
            }

            // ✅ Start refresh
            isRefreshingRef.current = true;

            return new Promise<void>((resolve, reject) => {
              window.tokenRenewResolve = resolve;

              // Check if webkit is available
              if (!window.webkit?.messageHandlers?.barcodeScanner) {
                console.error("❌ webkit not available!");
                reject(new Error("Native bridge not available"));
                return;
              }

              console.log("📤 Sending tokenExpired message to native");
              try {
                window.webkit.messageHandlers.barcodeScanner.postMessage(
                  "tokenExpired"
                );
              } catch (err) {
                console.error("❌ Failed to send message:", err);
                reject(err);
              }
            })
              .then(() => {
                console.log("✅ Token refresh completed");
                const token = localStorage.getItem("authToken");
                if (token) {
                  originalRequest.headers["Authorization"] = `Bearer ${token}`;
                  console.log("🔁 Retrying original request");
                  return axios(originalRequest);
                }
                return Promise.reject(error);
              })
              .catch((err) => {
                console.error("❌ Token refresh failed:", err);
                return Promise.reject(err);
              })
              .finally(() => {
                isRefreshingRef.current = false;
              });
          }

          return Promise.reject(error);
        }
      );
    }

    // 3️⃣ Notify native React is ready
    if (window.webkit?.messageHandlers?.barcodeScanner) {
      console.log("📤 Notifying native: reactReady");
      window.webkit.messageHandlers.barcodeScanner.postMessage("reactReady");
    } else {
      console.warn("⚠️ webkit not available at startup");
    }

    return () => {
      delete window.setUserInfo;
    };
  }, [setUserInfo]);

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
