import toast from "react-hot-toast";
import { create } from "zustand";
import { restInstance, graphqlInstance } from "../lib/axios";


export const useInventoryStore = create((set, get) => ({
    categories: [],
    categoryOptions: [],
    loading: false,
    products: [],
    page: 1,
    categoryPage: 1,
    categoryLimit: 10,
    limit: 10,
    total: 0,
    categoryTotal: 0,

    fetchCategories: async (categoryPage, categoryLimit) => {
        set({ loading: true, categoryPage })

        const query = `
            query GetAllCategories ($page: Float!, $limit: Float!) {
                getAllCategories (page: $page, limit: $limit) {
                    category {
                        categoryId
                        name
                        description
                    }
                    total
                }
            }
        `
        const variables = { page: categoryPage, limit: categoryLimit }
        try {
            const res = await graphqlInstance.post('', { query, variables })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            const { category, total } = res.data.data.getAllCategories
            //console.log(category);

            set({ categories: category, categoryTotal: total, loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.errors?.[0]?.message || "Error in fetching categories ";
            toast.error(message)
        }
    },

    fetchCategoryOptions: async () => {
        const query = `
            query GetCategoryOptions {
                getCategoryOptions {
                    categoryId
                    name
                }
            }
        `
        try {
            const res = await graphqlInstance.post('', { query })

            if (res.data.errors) {
                throw new Error(res.data.errors[0].message)
            }

            set({ categoryOptions: res.data.data.getCategoryOptions })

        } catch (error) {
            const message = error.message || "Error fetching category options"
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

    updateProduct: async (productId, updatePayload) => {
        //console.log(updatePayload);

        set({ loading: true })
        try {
            const formData = new FormData()
            Object.entries(updatePayload).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
            const res = await restInstance.patch(`/product/update/${productId}`, formData)
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            //replace the existing product with the new updated product
            set((previousState) => ({
                products: previousState.products.map((product) =>
                    product.productId === res.data.productId ? res.data : product
                ),
            }))
            toast.success('Product updated successfully')
            set({ loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error updating product"
            toast.error(message)
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true })
        const mutation = `
            mutation DeleteProduct($productId: String!){
                deleteProduct(productId: $productId)
            }
        `
        const variables = { productId }
        try {
            const res = await graphqlInstance.post('', { query: mutation, variables })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            set((previousState) => ({
                products: previousState.products.filter((product) => product.productId !== productId)
            }))
            toast.success('Product deleted successfully')
            set({ loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error updating product"
            toast.error(message)
        }
    },

    deleteCategory: async (categoryId) => {
        set({ loading: true })
        const mutation = `
            mutation DeleteCategory($categoryId: String!){
                deleteCategory(categoryId: $categoryId)
            }
        `
        const variables = { categoryId }
        try {
            const res = await graphqlInstance.post('', { query: mutation, variables })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            set((previousState) => ({
                categoryOptions: previousState.categoryOptions.filter((category) => category.categoryId !== categoryId),
                categories: previousState.categories.filter((category) => category.categoryId !== categoryId)
            }))
            toast.success('Category deleted successfully')
            set({ loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error updating category"
            toast.error(message)
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true })
        let states
        set((state) => ({
            states: state,

            products: state.products.map((product) =>
                product.productId === productId
                    ? { ...product, isFeatured: !product.isFeatured }
                    : product
            ),
        }));
        console.log(states);


        const mutation = `
            mutation ToggleProduct($productId: String!){
                toggleProduct(productId: $productId)
            }
        `
        const variables = { productId }
        try {
            const res = await graphqlInstance.post('', { query: mutation, variables })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }

            set({ loading: false })
            toast.success('Product toggled successfully')
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error updating product"
            toast.error(message)
        }

    },

    fetchAllProducts: async (page, limit) => {
        set({ loading: true, page })

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
                    soldQuantity
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

            const { products, total } = res.data.data.getManyProducts

            set({ products, total, loading: false })

        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error fetching products"
            toast.error(message)
        }
    },

    createCategory: async ({ name, description }) => {
        set({ loading: true })
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
            categoryInput: { name, description }
        }
        //console.log(variables);

        try {
            const res = await graphqlInstance.post('', { query, variables })
            if (res.data.errors) {
                throw new Error(res.data.errors[0].message)
            }
            set((previousState) => ({
                categories: [...previousState.categories, res.data.data.createCategory],
                categoryOptions: [...previousState.categoryOptions, res.data.data.createCategory],
            }))
            set({ loading: false })
            toast.success('Category created successfully')
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error fetching categories"
            toast.error(message)
        }
    },

    updateCategory: async (categoryId, updatePayload) => {
        set({ loading: true })
        const mutation = `
            mutation UpdateCategory ($categoryId: String!, $updateCategoryInput: updateCategoryInput!){
                updateCategory (categoryId: $categoryId, updateCategoryInput: $updateCategoryInput){
                    categoryId
                    name
                    description
                }
            }
        `
        const categoryPayload = Object.fromEntries(
            Object.entries(updatePayload).filter(([_, value]) => {
              return (
                value !== undefined &&
                value !== null &&
                !(typeof value === 'string' && value.trim() === '')
              );
            })
          )
          console.log(categoryPayload);
          
        const variables = {
            categoryId,
            updateCategoryInput: categoryPayload
        }

        try {
            const res = await graphqlInstance.post('', { query: mutation, variables })
            if (res.data.errors) {
                throw new Error(res.data.errors[0].message)
            }
            const updatedCategory = res.data.data.updateCategory

            
            if (!updatedCategory) {
                throw new Error('Update failed — no data returned')
            }
            set((previousState) => ({
                categories: previousState.categories.map((cat) =>
                    cat.categoryId === categoryId ? updatedCategory : cat
                ),
                categoryOptions: previousState.categoryOptions.map((cat) =>
                    cat.categoryId === categoryId ? updatedCategory : cat
                )
            }))
            set({ loading: false })
            toast.success('Category updated successfully')
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error fetching categories"
            toast.error(message)
        }
    }
})
)