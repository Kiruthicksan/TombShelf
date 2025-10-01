import { create } from "zustand";
import { api } from "@/services/api"; // adjust the path to your api.js file

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/cart");
      set({ cart: data.cart, loading: false }); // notice data.cart
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch cart", loading: false });
    }
  },

  addToCart: async (bookId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/items", { bookId, quantity });
      set({ cart: data.cart, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to add to cart", loading: false });
    }
  },

  
  removeFromCart: async (bookId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.delete(`/items/${bookId}`);
      set({ cart: data.cart, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to remove from cart", loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.delete("/items");
      set({ cart: data.cart, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to clear cart", loading: false });
    }
  },

   updateCartItemQuantity: async (bookId, quantity) => {
    if (quantity < 1) return;
    set({ loading: true, error: null });
    try {
      const { data } = await api.put(`/items/${bookId}`, { quantity });
      set({ cart: data.cart, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update quantity",
        loading: false,
      });
    }
  },

  isInCart: (bookId) => {
    const { cart } = get();
    return cart?.items?.some((item) => item.bookId?._id === bookId);
  },

  getItemQuantity: (bookId) => {
    const { cart } = get();
    const item = cart?.items?.find((item) => item.bookId?._id === bookId);
    return item?.quantity || 0;
  },
}));

