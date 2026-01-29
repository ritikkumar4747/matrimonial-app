import axios from "axios";
import { getApiUrl } from "../utils/apiConfig";

const API = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
