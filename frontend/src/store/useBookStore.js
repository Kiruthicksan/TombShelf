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
      return response.data.books;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  fetchBook: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get(`/books/${id}`);
      set({ book: response.data.book, isLoading: false });
      return response.data.book;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  createBook: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const form = new FormData();
      for (const key in data){
        if(Array.isArray(data[key])){
          data[key].forEach(item => {
            form.append(key, item);
          })
        }else{
          form.append(key,data[key])
        }
      }
      const response = await api.post("/books", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        books: [...state.books, response.data.book],
        isLoading: false,
        error: null,
      }));
      return response.data.book;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          error.message ||
          "Error while publishing Book",
        isLoading: false,
      });
    }
  },

  updateBook: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const form = new FormData();
      for (const key in data) {
        if (Array.isArray(data[key])) {
         
          data[key].forEach(item => {
            form.append(key, item); 
          });
        } else {
          form.append(key, data[key]);
        }
      }
      const response = await api.put(`/books/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        books: state.books.map((book) =>
          book._id === id ? response.data.book : book
        ),
        isLoading: false,
        error: null,
      }));

      return response.data.book;
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          error.message ||
          "Error while updating book",
        isLoading: false,
      });
    }
  },

  deleteBook: async (bookId) => {
    set({ isLoading: true, error: null });

    try {
      await api.delete(`/books/${bookId}`);

      set((state) => ({
        books: state.books.filter((book) => book._id !== bookId),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
        set({
      error: error?.response?.data?.message || error.message || "Error deleting book",
      isLoading: false,
    });
    }
  },
}));
