import { create } from "zustand";
import { api } from "../services/api.js";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: null,
  error: null,

  register: async (userName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/register", {
        userName,
        email,
        password,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post("/auth/login", { email, password });

      // Check if the login was successful based on your API's response structure
      if (response.data && response.data.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response.data.user; // only return on success
      } else {
        throw new Error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";

      set({
        user: null,
        isAuthenticated: false,
        error: errorMessage,
        isLoading: false,
      });

      throw new Error(errorMessage);
    }
  },

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/users/profile");
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    }
  },

  updateUser: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put("/users/profile", payload);
      set({
        user: response.data.user,
        isLoading: false,
        error: null,
      });

      return response.data.user;
    } catch (error) {
      const errorMesage =
        error.response.data.message || error.message || "Update Failed";
      set({ error: errorMesage, isLoading: false });
    }
    throw new Error(errorMessage);
  },

  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  },

  hasAnyrole: (roles = []) => {
    const { user } = get();
    return roles.includes(user?.role);
  },

  isReader: () => get().user?.role === "reader",
  isPublisher: () => get().user?.role === "publisher",
  isAdmin: () => get().user?.role === "admin",
}));
