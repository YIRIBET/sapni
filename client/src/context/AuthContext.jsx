import React from "react";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const parseToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const payload = parseToken(storedToken);
      if (payload) {
        setToken(storedToken);
        setUser(payload);
      }
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    const payload = parseToken(newToken);

    if (!payload) return;

    setToken(newToken);
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}