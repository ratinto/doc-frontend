import React, { createContext, useState, useEffect } from "react";
import { setAuthToken } from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  useEffect(() => {
    setAuthToken(accessToken);
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }, [accessToken]);

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};