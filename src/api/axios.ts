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
  (res) => res,
  async (error) => {
    console.log("Interceptor triggered", error.response?.status);
    return Promise.reject(error);
  }
);
export default api;
