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
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log("got response");
    return res;
  },
  (error) => {
    if (
      error.response.status === 404 ||
      error.response.status === 401 ||
      error.response.status === 403
    ) {
      console.log("do something");
    }
    return Promise.reject(error);
  }
);

export default api;
