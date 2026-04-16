import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api, saveToken, clearToken, ApiError } from "@/lib/api";

export type UserRole = "admin" | "operador" | "usuario";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAs: (role: UserRole) => Promise<void>;
  logout: () => void;
  hasPermission: (minRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ROLE_LEVEL: Record<UserRole, number> = { admin: 3, operador: 2, usuario: 1 };

const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  admin:    { email: "admin@salnutra.com",    password: "admin123" },
  operador: { email: "operador@salnutra.com", password: "operador123" },
  usuario:  { email: "usuario@salnutra.com",  password: "usuario123" },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<User>("/api/auth/me")
      .then(setUser)
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await api.post<{ token: string; user: User }>("/api/auth/login", {
        email,
        password,
      });
      saveToken(result.token);
      setUser(result.user);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return false;
      throw err;
    }
  }, []);

  const loginAs = useCallback(async (role: UserRole): Promise<void> => {
    const { email, password } = DEMO_CREDENTIALS[role];
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (minRole: UserRole) => !!user && ROLE_LEVEL[user.role] >= ROLE_LEVEL[minRole],
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAs, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
