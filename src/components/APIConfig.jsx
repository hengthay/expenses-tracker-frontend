import axios from "axios";
import { isTokenExpired } from "./helper/isTokenExpired";

const API = `${import.meta.env.VITE_BASE_URL}`;

const API_BASE_URL = `${API}/api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': "application/json",
    "Accept": "application/json"
  }
});

// check every request api
axiosInstance.interceptors.request.use((config) => {
  const userData = localStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const token = parsedUserData?.token;

  if(token && isTokenExpired(token)) {
    localStorage.removeItem("userData");
    return Promise.reject(new Error('Token expired!'));
  }

  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})

export { axiosInstance, API_BASE_URL };