import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

/* ================== GLOBAL AXIOS SETUP ================== */
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

/* ======================================================== */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Load auth from localStorage */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  /* LOGIN */
  const login = async (data) => {
    const res = await axios.post("/api/auth/login", data);

    setUser(res.data.user);
    setToken(res.data.token);

    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res.data.token}`;
  };

  /* REGISTER */
  const register = async (data) => {
    const res = await axios.post("/api/auth/register", data);

    setUser(res.data.user);
    setToken(res.data.token);

    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res.data.token}`;
  };

  /* LOGOUT */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
