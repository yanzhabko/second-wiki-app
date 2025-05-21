import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../utils/parseJWT";
import { api } from "../utils/server";
import toast from "react-hot-toast";
import type { PropsWithChildren } from "react";

export interface AuthContextProps {
  role: string;
  username: string;
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
}

const AuthContext = createContext<{
  user: AuthContextProps | null;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    role?: string
  ) => Promise<void>;
}>(null!);

const getInitialState = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const decodedToken = parseJwt(token);
  const username = decodedToken?.sub;
  const role = decodedToken?.role || "User";

  if (!username || !role) {
    return null;
  }

  return {
    role,
    username,
  };
};

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<AuthContextProps | null>(getInitialState);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setAuth(null);
    navigate("/");
  };

  const login = async (username: string, password: string) => {
    try {
      const { data } = await api.post(
        "/auth/token",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", data.role);

      const decodedToken = parseJwt(data.access_token);
      setAuth({
        role: decodedToken?.role || "User",
        username: decodedToken?.sub || username,
      });

      setAuth({
        role: data.role,
        username: username,
      });
      toast.success("Ви успішно увійшли!.");
      if (data.user_role === "admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      const error = err as ApiError;

      if (error?.response?.data?.detail) {
        toast.error(`Вхід не вдався: ${error.response.data.detail}`);
      } else if (error?.message) {
        console.error("Login failed:", error.message);
        toast.error("Невірні облікові дані");
      } else {
        console.error("Login failed:", error);
        toast.error("Помилка під час входу");
      }
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await api.post("/auth/register", {
        username,
        password,
      });

      toast.success("Реєстрація успішна! Будь ласка, увійдіть.");
      navigate("/singin");
    } catch (err: unknown) {
      const error = err as ApiError;

      if (error?.response?.data?.detail) {
        toast.error(`Реєстрація не вдалася: ${error.response.data.detail}`);
      } else if (error?.message) {
        console.error("Registration failed:", error.message);
        toast.error("Невірні облікові дані");
      } else {
        console.error("Registration failed:", error);
        toast.error("Помилка під час реєстрації");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user: auth, logout, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
