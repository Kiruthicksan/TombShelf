import { create } from "zustand";
import { api } from "../services/api.js";

export const useAuthStore = create((set) => ({
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
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
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

  logout : async () => {
    try {
      await api.post('/auth/logout')
      set({
        user: null,
        isAuthenticated: false
      })
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    }
  }
}));


