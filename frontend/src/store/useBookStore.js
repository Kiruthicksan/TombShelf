import { create } from "zustand";
import { api } from "../services/api";

export const useBookStore = create((set, get) => ({
  books: [],
  book: null,
  isLoading: true,
  error: false,

 fetchBooks: async (query = {}) => {
  set({ isLoading: true, error: null });

  try {
    const params = new URLSearchParams(query).toString();
    const response = await api.get(`/books?${params}`);
    set({ books: response.data.books, isLoading: false });
    return response.data.books
  } catch (error) {
    set({ error: error.response?.data?.message || error.message, isLoading: false });
  }
},


  fetchBook : async (id) => {
    set({isLoading : true, error : null})

    try {
        const response = await api.get(`/books/${id}`)
        set({book :response.data.book, isLoading : false})
        return response.data.book
    } catch (error) {
        set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  }
 }));
