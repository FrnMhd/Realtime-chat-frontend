import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_BASE,
});

export function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default instance;
