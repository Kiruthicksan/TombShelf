import { api } from "@/services/api";
import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],
  isloading: false,
  error: null,

  fetchCart: async () => {
    set({ isloading: true, error: null });
    try {
      const response = await api.get("/cart");
      set({ cart: response.data.cart, isloading: false });
      return response.data.cart;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createOrUpdateCart: async (items) => {
    set({isloading : true, error: null })
    try{
        const response = await api.post("/cart", {items})
        set({cart : response.data.cart, isloading : false})
        return response.data.cart
    }catch(error){
         set({
        error: error.response?.data?.message || error.message,
        isloading: false,
      });
    }
  },
  updateCartItem : async (bookId, quantity) => {
    set ({isloading : true, error : null})
    try {
        const response = await api.put(`cart/${bookId}`, {quantity})
        set({cart : response.data.cart, isloading :false})
        return response.data.cart
    } catch (error) {
        set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  }
}));
