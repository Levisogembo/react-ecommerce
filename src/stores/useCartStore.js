import { create } from "zustand";
import { restInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    loading: false,
    total: 0,
    subTotal: 0,
    coupon: null,
    personalCoupon: null,
    publicCoupons: [],
    validating: false,
    discountAmount: 0,
    isCouponApplied: false,
    recommendations: [],

    getCartItems: async () => {
        try {
            const res = await restInstance.get("/cart")
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            //console.log(res.data);     
            set({ cart: res.data })
            get().calculateTotals()
        } catch (error) {
            set({ cart: [] })
            const message = error.message || "Error creating product"
            toast.error(message, { id: 'cart-error' })
        }
    },

    addToCart: async ({ productId, description, name, price, images }) => {
        const fileName = images[0].fileName
        const productCart = { productId, description, name, price, fileName };
        //console.log(productCart);, 
        try {
            const res = await restInstance.post('/cart', productCart)
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            set((previousState) => {
                const existingItem = previousState.cart.find(
                    (item) => item.productId === productId
                );

                const newCart = existingItem
                    ? previousState.cart.map((item) =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                    : [...previousState.cart, { ...productCart, quantity: 1 }];

                return { cart: newCart };
            });
            toast.success('Product added to cart', { id: 'add-to-cart' })
            get().calculateTotals();
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error creating product"
            toast.error(message)
        }
    },

    removeFromCart: async (productId) => {
        try {
            const res = await restInstance.delete(`/cart/delete/${productId}`)
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            set((previousState) => {
                const newCart = previousState.cart.filter((item) => item.productId !== productId)
                return { cart: newCart }
            })
            get().calculateTotals()
            toast.success("Product removed successfully")
        } catch (error) {
            set({ cart: [] })
            const message = error.message || "Error removing product"
            toast.error(message, { id: 'cart-error' })
        }
    },

    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
            get().removeFromCart(productId)
            return
        }
        try {
            const res = await restInstance.patch(`/cart/update/${productId}`, { quantity })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            set((prevState) => ({
                cart: prevState.cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
            }));
            get().calculateTotals();
            toast.success("Cart updated successfully", { id: 'cart-updates' })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error creating product"
            toast.error(message)
        }
    },

    calculateTotals: () => {
        const { cart, coupon } = get()
        const subTotal = cart.reduce((sum, item) => {
            return sum += item.price * item.quantity
        }, 0)
        let total = subTotal
        if (coupon) {
            const discount = subTotal * (coupon.discountPercentage / 100)
            total = subTotal - discount
        }
        set({ total, subTotal })
    },

    getRecommendations: async () => {
        set({ loading: true })
        try {
            const res = await restInstance.get("/cart/recommendations")
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            set({ recommendations: res.data })
            set({ loading: false })
        } catch (error) {
            set({ loading: false })
            const message = error.message || "Error loading recommendations"
            toast.error(message)
        }
    },

    getMyCoupon: async () => {
        try {
            const res = await restInstance.get('/coupon/my-coupon')
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            set({ personalCoupon: res.data })
        } catch (error) {
            set({ personalCoupon: null })
            const message = error.message || "Error loading coupons"
            toast.error(message)
        }
    },

    getPublicCoupons: async () => {
        try {
            const res = await restInstance.get('/coupon/public')
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            set({ publicCoupons: res.data })
        } catch (error) {
            set({ publicCoupons: [] })
            const message = error.message || "Error loading coupons"
            toast.error(message)
        }
    },

    validateCoupon: async (code, cartTotal) => {
        if (!code.trim()) {
            toast.error('Please enter a coupon code')
            return
        }
    
        set({ validating: true })
    
        try {
            const res = await restInstance.post('/coupon/validate', {
                code,
                cartTotal
            })
    
            const { couponId, code: validatedCode, discountType, discountValue, discountAmount, finalAmount } = res.data
            set({
                coupon: {
                    couponId,
                    code: validatedCode,
                    discountType,
                    discountValue,
                    discountPercentage: discountType === 'percentage' ? discountValue : 0,
                },
                isCouponApplied: true,
                discountAmount,
                total: finalAmount,
                validating: false
            })
    
            // recalculate totals with the new coupon
            get().calculateTotals()
    
            toast.success(`Coupon "${validatedCode}" applied successfully`)
    
        } catch (error) {
            set({ validating: false })
            const message = error.response?.data?.message || 'Invalid coupon code'
            toast.error(message)
        }
    },
    
    removeCoupon: () => {
        set({
            coupon: null,
            isCouponApplied: false,
            discountAmount: 0,
        })
        // recalculate totals without coupon
        get().calculateTotals()
    
        toast.success('Coupon removed')
    }
}))