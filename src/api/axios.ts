import axios from "axios";
// const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: `https://embainuu.mn/TestApi/`,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Success (2xx, 3xx)
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log("got response");
    window.webkit?.messageHandlers.barcodeScanner.postMessage("success");
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    // only handle if not already retried
    if (
      !originalRequest._retry &&
      error.response &&
      [401, 403, 404].includes(error.response.status)
    ) {
      originalRequest._retry = true;

      console.log("Token expired, notifying native...");
      // Notify native to get new token
      await new Promise((resolve) => {
        window.tokenRenewResolve = resolve; // temporary callback for native
        window.webkit?.messageHandlers.barcodeScanner.postMessage(
          "tokenExpired"
        );
      });

      // Native should send new token via JS, e.g.
      // window.setUserInfo({ token: "NEW_TOKEN" });
      // and call window.tokenRenewResolve() when ready

      // Update the token in headers
      window.setUserInfo; // assume native sets window.userToken
      originalRequest.headers["Authorization"] = `Bearer ${token}`;

      // Retry the request
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
