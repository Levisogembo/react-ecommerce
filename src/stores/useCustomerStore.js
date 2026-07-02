import { create } from "zustand";
import { restInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCustomerStore = create((set, get) => ({
  orders: null,
  totalOrders: 0,
  completed: null,
  completedOrders: 0,
  totalRevenue: 0,
  coupons: null,
  couponCount: 0,
  loading: false,

  getDashboardData: async () => {
    set({ loading: true });
    try {
      const res = await restInstance.get("/analytics/customer");
      const {
        orders,
        totalOrders,
        completed,
        completedOrders,
        totalRevenue,
        coupons,
        couponCount,
      } = res.data;
      set({
        orders,
        totalOrders,
        completed,
        completedOrders,
        totalRevenue,
        coupons,
        couponCount,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        orders: null,
        totalOrders: 0,
        completed: null,
        completedOrders: 0,
        totalRevenue: 0,
        coupons: null,
        couponCount: 0,
      });
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
    }
  },
}));
