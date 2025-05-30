import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface ApiResponse {
  success: boolean;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async (storedToken: string, storedUser: User | null) => {
    try {
      const response = await axios.get<ApiResponse>(
        "http://localhost:5000/api/users/me",
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      // Use the admin status from the API response
      const userData = {
        ...response.data.user,
        isAdmin: Boolean(response.data.user.isAdmin),
      };

      console.log("Token verification - Response:", response.data);
      console.log("Token verification - User data:", userData);
      console.log("Token verification - Admin status:", userData.isAdmin);

      setUser(userData);
      setToken(storedToken);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUserStr = localStorage.getItem("user");

      if (storedToken && storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr);
          console.log("Initial stored user:", storedUser);
          console.log("Initial admin status:", storedUser.isAdmin);

          // First set the stored user to prevent flashing
          setUser({
            ...storedUser,
            isAdmin: Boolean(storedUser.isAdmin),
          });
          setToken(storedToken);

          // Then verify the token while preserving admin status
          await verifyToken(storedToken, storedUser);
        } catch (error) {
          console.error("Error initializing auth:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    const userWithAdmin = {
      ...userData,
      isAdmin: Boolean(userData.isAdmin),
    };
    console.log("Login - User data:", userWithAdmin);
    console.log("Login - Admin status:", userWithAdmin.isAdmin);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userWithAdmin));
    setToken(newToken);
    setUser(userWithAdmin);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
