import axios from "axios";
// const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: "https://server.orion.mn/ORION_WebAPI/",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
