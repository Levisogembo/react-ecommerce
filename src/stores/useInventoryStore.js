import toast from "react-hot-toast";
import { create } from "zustand";
import { restInstance, graphqlInstance } from "../lib/axios";


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
            const res = await graphqlInstance.post('', { query })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            set({ categories: res.data.data.getAllCategories, loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.errors?.[0]?.message || "Error in signup";
            toast.error(message)
        }
    },

    createProduct: async (newProduct) => {
        set({ loading: true })

        try {
            const formData = new FormData()
            formData.append('file', newProduct.file)
            formData.append('name', newProduct.name)
            formData.append('description', newProduct.description)
            formData.append('brand', newProduct.brand)
            formData.append('price', newProduct.price)
            formData.append('quantity', newProduct.quantity)
            formData.append('category', newProduct.category)
            // for (let [key, value] of formData.entries()) {
            //     console.log(key, value)
            // }
            const res = await restInstance.post('/product/create', formData)
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            toast.success("Product created successfully")
            set({ loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error creating product"
            toast.error(message)
        }

    }
})
)