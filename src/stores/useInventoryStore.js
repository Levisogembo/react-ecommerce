import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";


export const useInventoryStore = create((set, get) => ({
    categories: [],
    loading: false,

    fetchCategories: async () => {
        set({ loading: true })

        const query = `
            query GetAllCategories {
                getAllCategories {
                    categoryId
                    name
                }
            }
        `
        try {
            const res = await axios.post('', { query })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            set({ categories: res.data.data.getAllCategories, loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.errors?.[0]?.message || "Error in signup";
            toast.error(message)
        }
    }
})
)