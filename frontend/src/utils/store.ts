import axios from "axios";
import { trimQuotes } from "./trim-quotes";

export const authApi = axios.create({
  baseURL: "https://film-booking-app.onrender.com",
});

authApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${trimQuotes(token)}`;
    } else {
      config.headers["Authorization"] = "";
      return Promise.reject(new Error("No token found"));
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
