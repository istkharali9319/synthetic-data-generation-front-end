import { createContext, useContext, useEffect, useState } from "react";

import { login as loginRequest } from "../api/synthiq";

const STORAGE_KEY = "synthiq-auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (auth) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [auth]);

  async function login(credentials) {
    const response = await loginRequest(credentials);
    setAuth(response);
    return response;
  }

  function logout() {
    setAuth(null);
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticated: Boolean(auth?.access_token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
