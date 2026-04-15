import toast from "react-hot-toast";
import { create } from "zustand";
import { restInstance, graphqlInstance } from "../lib/axios";


export const useInventoryStore = create((set, get) => ({
    categories: [],
    loading: false,
    products: [],
    page:1,
    limit: 10,
    total:0,

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
            set((previousState) => ({
                products: [...previousState.products, res.data],
            }))

            toast.success("Product created successfully")
            set({ loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error creating product"
            toast.error(message)
        }

    },

    deleteProduct: async (productId) => {

    },

    toggleFeaturedProduct: async () => {

    },

    fetchAllProducts: async (page = 1, limit = 10) => {
        set({ loading: true })

        const query = `
            query GetManyProduct($page: Float!, $limit: Float!) {
            getManyProducts(page: $page, limit: $limit) {
                products {
                    productId
                    name
                    description
                    brand
                    price
                    quantity
                    isFeatured
                    reservedQuantity
                    category {
                        categoryId
                        name
                    }
                    images {
                        imageId
                        fileName
                        filepath
                    }
                }
                total
            }
        }
    `
        const variables = { page, limit }

        try {
            const res = await graphqlInstance.post('', { query, variables })

            if (res.data.errors) {
                throw new Error(res.data.errors[0].message)
            }

            const {products, total }  = res.data.data.getManyProducts

            set({ products, loading: false })

        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error fetching products"
            toast.error(message)
        }
    },

    createCategory: async ({name, description}) => {
        set({loading: true})
        const query = `
            mutation CreateCategory($categoryInput: createCategoryInput!){
                createCategory(categoryInput: $categoryInput){
                    categoryId
                    name
                    description
                }           
            }
        `
        const variables = {
            categoryInput: {name, description}
        }
        //console.log(variables);
        
        try {
            const res = graphqlInstance.post('',{query,variables})
            if (res.data.errors) {
                throw new Error(res.data.errors[0].message)
            }
            console.log(res.data);
            
            set({loading: false})
            toast.success('Category created successfully')
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error fetching categories"
            toast.error(message)
        }
    }
})
)