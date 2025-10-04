// store/useOrderStore.js
import { create } from "zustand";
import { api } from "@/services/api";

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // Fetch all orders for logged-in user
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/orders");
      set({ orders: data.orders || [], loading: false });
      return data.orders
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch orders",
        loading: false,
      });
    }
  },
  

  // Fetch single order by ID
  fetchOrderById: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      set({ currentOrder: data.order, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch order",
        loading: false,
      });
    }
  },

  // Create a new order
  createOrder: async (items, shippingAddress) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/orders", { items, shippingAddress });

      // after creating, fetch full order details
      const { data: populated } = await api.get(`/orders/${data.order._id}`);

      set((state) => ({
        orders: [populated.order, ...state.orders],
        currentOrder: populated.order,
        loading: false,
      }));

      return populated.order;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create order",
        loading: false,
      });
      throw error; // let frontend handle toast
    }
  },

  // Clear current order (for cleanup on page leave)
  clearCurrentOrder: () => set({ currentOrder: null }),

  // store/useOrderStore.js
updateOrderStatus: async (orderId, status) => {
  set({ loading: true });
  try {
    const { data } = await api.put(`/admin/orders/${orderId}/status`, { status });
    set((state) => ({
      orders: state.orders.map((o) =>
        o._id === orderId ? { ...o, status: data.order.status } : o
      ),
      loading: false,
    }));
  } catch (error) {
    set({
      error: error.response?.data?.message || "Failed to update order status",
      loading: false,
    });
  }
},

fetchAllOrders: async () => {
  set({ loading: true, error: null });
  try {
    const { data } = await api.get("/admin/orders"); // your admin route
    set({ orders: data.orders || [], loading: false });
  } catch (error) {
    set({
      error: error.response?.data?.message || "Failed to fetch all orders",
      loading: false,
    });
  }
},


}));
