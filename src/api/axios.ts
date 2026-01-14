import axios from "axios";
// const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: `https://embainuu.mn/TestApi/`,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
