import { create } from "zustand";
import { graphqlInstance, restInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCategoryStore = create((set, get) => ({
    categoryProducts: [],
    loading: false,
    featuredProducts: [],
    page: 1,
    limit: 10,
    orders: [],
    total: 0,

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
    },

    getFeaturedProducts: async () => {
        set({ loading: true })
        try {
            const res = await restInstance.get('/product/featured')
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            set({ loading: false, featuredProducts: res.data })
        } catch (error) {
            set({ loading: false, featuredProducts: [] })
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Error creating coupon"

            toast.error(message)
        }
    },

    getAllOrders: async (page, limit) => {
        set({ loading: true, page })
        const query = `
            query GetAllOrders ($page: Int!, $limit: Int! ) {
                getAllOrders (page: $page, limit: $limit) {
                    orders {
                        orderId
                        orderNumber
                        paymentMethod
                        createdAt
                        paidAt
                        status
                        total
                        isRefunded
                    }
                    total
                }
            }
        `
        const variables = { page, limit}
        try {
            const res = await graphqlInstance.post('', { query, variables })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            const { orders, total } = res.data.data.getAllOrders

            set({ loading: false, orders, total })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error fetching products"
            toast.error(message)
        }
    }
}))