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
            const updatedCategory = res.data.total ? res.data.total : res.data
            set({ categoryProducts: updatedCategory, loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error creating product"
            toast.error("No product found for this category")
        }
    }
}))