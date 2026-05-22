import { create } from "zustand";
import { restInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCategoryStore = create((set, get) => ({
    categoryProducts: [],
    loading: false,

    getProductsByCategory: async (categoryName) => {
        set({ loading: false })
        try {
            const res = await restInstance.get(`/product/category/${categoryName}`)
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            const products = res.data.total > 0 ? res.data.products : []
            set({ categoryProducts: products, loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error creating product"
            toast.error("No product found for this category")
        }
    },

    createCoupon: async (newCoupon) => {
        set({ loading: true })
        try {
            const res = await restInstance.post('/coupon/create', newCoupon)
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            toast.success("Coupon created successfully")
            set({ loading: false })

        } catch (error) {
            set({ loading: false })
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Error creating coupon"

            toast.error(message)
        }
    }
}))