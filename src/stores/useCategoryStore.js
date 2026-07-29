import { create } from "zustand";
import { graphqlInstance, restInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCategoryStore = create((set, get) => ({
  categoryProducts: [],
  loading: false,
  featuredProducts: [],
  categoryLoading: false,
  page: 1,
  limit: 10,
  orders: [],
  total: 0,

  getProductsByCategory: async (categoryName) => {
    set({ categoryLoading: true });
    try {
      const res = await restInstance.get(`/product/category/${categoryName}`);
      if (res.data.errors) {
        toast.error(res.data.errors[0].message);
        return;
      }
      const products = res.data.total > 0 ? res.data.products : [];
      set({ categoryProducts: products, categoryLoading: false });
    } catch (error) {
      set({ categoryLoading: false });
      const message = error.message || "Error creating product";
      toast.error("No product found for this category");
    }
  },

  createCoupon: async (newCoupon) => {
    set({ loading: true });
    try {
      if (
        newCoupon.discountType &&
        newCoupon.discountType !== "fixed" &&
        newCoupon.discountValue
      ) {
        if (newCoupon.discountValue > 100) {
          toast.error("Coupon discount percentage cannot be more than 100%");
          return;
        }
      }
      const res = await restInstance.post("/coupon/create", newCoupon);
      if (res.data.errors) {
        toast.error(res.data.errors[0].message);
        return;
      }
      toast.success("Coupon created successfully");
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error creating coupon";

      toast.error(message);
    }
  },

  getFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await restInstance.get("/product/featured");
      if (res.data.errors) {
        toast.error(res.data.errors[0].message);
        return;
      }
      set({ loading: false, featuredProducts: res.data });
    } catch (error) {
      set({ loading: false, featuredProducts: [] });
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error creating coupon";

      toast.error(message);
    }
  },

  getAllOrders: async (page, limit, searchOptions) => {
    set({ loading: true, page });
    const query = `
            query GetAllOrders ($page: Int!, $limit: Int!, $searchOptions: searchOrdersInput!) {
                getAllOrders (page: $page, limit: $limit, searchOptions: $searchOptions) {
                    orders {
                        orderId
                        orderNumber
                        paymentMethod
                        createdAt
                        billingAddress
                        mpesaCheckoutRequestId
                        transactionId
                        paidAt
                        status
                        total
                        isRefunded
                        user {
                            userId
                            firstName
                            lastName
                        }
                        payments {
                          paymentId
                          mpesaNumber
                        }
                        orderItems {
                           orderItemId
                           quantity
                           unitPrice
                           Product {
                             productId
                             name
                           }
                        }
                    }
                    total
                }
            }
        `;
    const variables = {
      page,
      limit,
      searchOptions: searchOptions || {
        orderNumber: "",
        status: "",
        paymentMethod: "",
        paidFrom: "",
        paidUntil: "",
        year: "",
      },
    };
    try {
      const res = await graphqlInstance.post("", { query, variables });
      if (res.data.errors) {
        toast.error(res.data.errors[0].message);
        return;
      }
      const { orders, total } = res.data.data.getAllOrders;

      set({ loading: false, orders, total });
    } catch (error) {
      set({ loading: false });
      const message = error.message || "Error fetching products";
      toast.error(message);
    }
  },

  getExcelSheet: async (filters) => {
    set({ loading: true });
    try {
      const res = await restInstance.get("/orders/export", {params:filters, responseType: 'blob'});
      const blob = new Blob (
        [res.data],
        {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      )
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "orders.xlsx"
      document.body.append(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || "Could not download excel file";
      toast.error(message);
    }
  },
}));
