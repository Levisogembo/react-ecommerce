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
  page: 1,
  limit: 10,
  total: 0,
  totalCoupons: null,
  customerOrders: null,
  customerOrdersCount: 0,
  orderPage: 1,
  orderLimit:10,

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

  getCoupons: async (page, limit) => {
    set({ loading: true, page });
    try {
      const res = await restInstance.get("/analytics/coupons", {
        params: { page, limit },
      });
      const { coupons, total } = res.data;
      set({loading: false, totalCoupons: coupons, total})
    } catch (error) {
      set({loading: false, total: 0, page: 1, totalCoupons: null})
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
    }
  },

  getOrders: async (page, limit) => {
    set({ loading: true, orderPage: page });
    try {
      const res = await restInstance.get("/analytics/orders", {
        params: { page, limit },
      });
      const { customerOrders, customerOrdersCount } = res.data;
      set({loading: false, customerOrders, customerOrdersCount})
    } catch (error) {
      set({loading: false, customerOrdersCount: 0, orderPage: 1, customerOrders: null})
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
    }
  },
}));
