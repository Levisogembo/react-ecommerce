import { create } from "zustand";
import { graphqlInstance, restInstance } from "../lib/axios";
import toast from "react-hot-toast";
import dayjs from 'dayjs';

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    loading: false,
    subTotal: 0,
    //coupon: null,
    personalCoupon: null,
    publicCoupons: [],
    allCoupons: [],
    page: 1,
    limit: 10,
    total: 0,
    totalCoupons: 0,
    validating: false,
    discountAmount: 0,
    isCouponApplied: false,
    recommendations: [],
    checkoutStep: 'idle',
    checkoutRequestId: null,
    orderId: null,
    orderNumber: null,
    pollingInterval: null,
    paymentError: null,

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
        const filepath = images[0].filepath
        const productCart = { productId, description, name, unitPrice: price, fileName, filepath };
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
            return sum + item.unitPrice * item.quantity
        }, 0)

        let total = subTotal
        let discountAmount = 0
        
        if (coupon && get().isCouponApplied) {
            if (coupon.discountType === 'percentage') {
                discountAmount = Math.round((coupon.discountValue / 100) * subTotal)

            } else if (coupon.discountType === 'fixed') {
                discountAmount = Math.min(coupon.discountValue, subTotal)
            }

            total = Math.max(0, subTotal - discountAmount)  // never go below 0
        }
       
        set({ total, subTotal, discountAmount })
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
                    discountPercentage:
                        discountType === 'percentage'
                            ? discountValue
                            : 0,
                },
                discountAmount,
                isCouponApplied: true,
                validating: false
            })

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
    },

    //payments integration
    initiateCheckout: () => {
        const { cart } = get()

        if (!cart.length) {
            toast.error('Your cart is empty')
            return
        }
        set({ checkoutStep: 'selecting', paymentError: null })
    },

    selectMpesa: () => {
        set({ checkoutStep: 'mpesa', paymentError: null })
    },

    initiateMpesaPayment: async ({ phone, query }) => {
        //console.log(query);
        const { total, coupon, isCouponApplied, cart, discountAmount } = get()
        const cleanedPhone = get().formatPhone(phone)
        if (!cleanedPhone) {
            toast.error('Invalid phone number please try again')
            return
        }
        set({ checkoutStep: 'processing', paymentError: null })
        const mutation = `
           mutation CreateNewOrder($orderPayload: createOrderInput!){
                createNewOrder (orderPayload: $orderPayload){
                    orderId
                    orderNumber
                    total
                    status
                    mpesaCheckoutRequestId
                    message
                }
            }
        `
        const items = cart.map((item) => {
            const { name, filepath, fileName, description, ...data } = item
            return data
        })

        const variables = {
            orderPayload: {
                total,
                phoneNumber: cleanedPhone,
                paymentMethod: "MPESA",
                items,
                couponId: isCouponApplied && coupon ? coupon.couponId : null,
                billingAddress: query,
                discountAmount
            }
        }
        //console.log(variables);

        try {
            const res = await graphqlInstance.post('', { query: mutation, variables })
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                set({
                    checkoutStep: 'idle',
                    paymentError: 'Failed to initiate MPesa payment. Please try again.'
                })
                return
            }
            const order = res.data.data.createNewOrder
            //console.log('Order response:', order)  // debug

            const { orderId, orderNumber } = order
            //console.log('orderId:', orderId)
            if (!orderId) {
                set({
                    checkoutStep: 'failed',
                    paymentError: 'Failed to initiate MPesa payment. Please try again.'
                })
                return
            }
            set({ orderId, orderNumber })
            //poll for payment status
            get().startPolling(orderId)
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to initiate payment'
            set({ checkoutStep: 'failed', paymentError: message })
            toast.error(message)
        }
    },

    startPolling: (orderId) => {
        // clear any existing interval first
        const existingInterval = get().pollingInterval
        if (existingInterval) clearInterval(existingInterval)

        // timeout after 2 minutes
        const timeout = setTimeout(() => {
            get().stopPolling()
            set({
                checkoutStep: 'failed',
                paymentError: 'Payment confirmation timed out. Please try again.'
            })
            toast.error('Payment timed out. Please try again.')
        }, 120000)

        const interval = setInterval(async () => {
            try {
                const currentCheckoutId = get().orderId
                console.log('Polling with ID:', currentCheckoutId)

                if (!currentCheckoutId) {
                    console.error('No checkoutRequestId available — stopping poll')
                    clearTimeout(timeout)
                    get().stopPolling()
                    get().handlePaymentFailure('Payment session lost. Please try again.')
                    return
                }

                const res = await restInstance.get(`/mpesa/status/${orderId}`)
                const { status, message } = res.data

                console.log('Poll response:', { status, message })

                if (status === 'success') {
                    clearTimeout(timeout)
                    get().stopPolling()
                    //get().handlePaymentSuccess()
                    set({ checkoutStep: 'success' })
                    return
                }

                if (status === 'failed') {
                    clearTimeout(timeout)
                    get().stopPolling()
                    get().handlePaymentFailure(message || 'Payment failed. Please try again.')
                    return
                }

            } catch (error) {
                console.error('Polling error:', error.message, error.response?.status)
                // don't stop polling on network errors — just log and continue
            }
        }, 5000)

        set({ pollingInterval: interval })
    },

    // stop polling — clear the interval
    stopPolling: () => {
        const interval = get().pollingInterval
        if (interval) {
            clearInterval(interval)
            set({ pollingInterval: null })
        }
    },


    handlePaymentSuccess: async () => {
        // clear cart and coupon locally
        set({
            cart: [],
            coupon: null,
            isCouponApplied: false,
            discountAmount: 0,
            checkoutStep: 'idle',
            total: 0,
            subTotal: 0,
            checkoutRequestId: null,
            orderId: null,
            paymentError: null,
            personalCoupon: null
        })

        try {
            await restInstance.delete('/cart/clear')
        } catch (error) {
            set({ checkoutStep: 'idle' })
            console.error('Failed to clear cart on backend:', error.message)
        }

        get().calculateTotals()
        //toast.success('Payment confirmed! Your order has been placed.')
    },

    // payment failed — reset and show error
    handlePaymentFailure: (message) => {
        set({
            checkoutStep: 'failed',
            paymentError: message || 'Payment failed please try again',
            checkoutRequestId: null
        })
        toast.error(message || 'Payment failed please try again')
    },

    // cancel checkout — go back to idle
    cancelCheckout: () => {
        get().stopPolling()
        set({
            checkoutStep: 'idle',
            checkoutRequestId: null,
            paymentError: null
        })
    },

    // go back to payment selection
    backToSelection: () => {
        get().stopPolling()
        set({
            checkoutStep: 'selecting',
            checkoutRequestId: null,
            paymentError: null
        })
    },

    formatPhone: (phone) => {
        const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '')

        // already in 254 format
        if (/^2547\d{8}$/.test(cleaned) || /^2541\d{8}$/.test(cleaned)) {
            return cleaned
        }

        // starts with 07 → convert to 2547
        if (/^07\d{8}$/.test(cleaned)) {
            return `254${cleaned.substring(1)}`
        }

        // starts with 01 → convert to 2541
        if (/^01\d{8}$/.test(cleaned)) {
            return `254${cleaned.substring(1)}`
        }

        // invalid
        return null
    },

    getAllCoupons: async (page, limit) => {
        set({ loading: true, page })
        try {
            const res = await restInstance.get(`/coupon/all?page=${page}&limit=${limit}`)
            if (res.data.errors) {
                set({ loading: false })
                toast.error(res.data.errors[0].message)
                return
            }
            const { coupons, total } = res.data
            set({ loading: false, allCoupons: coupons, totalCoupons: total })
        } catch (error) {
            set({ loading: false, allCoupons: [], totalCoupons: 0 })
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Error creating coupon"

            toast.error(message)
        }
    },

    toggleActiveCoupon: async (couponId) => {
        set({ loading: true })
        set((state) => ({
            allCoupons: state.allCoupons.map((coupon) =>
                coupon.couponId === couponId
                    ? { ...coupon, isActive: !coupon.isActive }
                    : coupon
            ),
        }))

        try {
            const res = await restInstance.patch(`/coupon/activate/${couponId}`)
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            set({ loading: false })
            toast.success('Coupon status activated successfully')
        } catch (error) {
            set({ loading: false})
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Error creating coupon"

            toast.error(message)
        }

    },

    editCoupon: async (couponId, payload) => {
        set({ loading: true })
        try {
            if (payload.expirationDate) {
                const isBeforeToday = dayjs(payload.expirationDate).isBefore(dayjs().startOf('day'))
                if (isBeforeToday) {
                    toast.error("Coupon expiration date cannot be a date before today")
                    return
                }
            }
            if (payload.discountType && payload.discountType !== 'fixed' && payload.discountValue && payload.discountValue > 100) {
                toast.error("Coupon discount percentage cannot be more than 100%")
                return
            }
            const cleanedPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, value]) => {
                    return (
                        value !== undefined &&
                        value !== null &&
                        value !== ''
                    );
                })
            );

            const res = await restInstance.patch(`/coupon/update/${couponId}`, cleanedPayload)
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
            }
            set((previousState) => ({
                allCoupons: previousState.allCoupons.map((coupon) =>
                    coupon.couponId === res.data.couponId ? res.data : coupon
                ),
            }))
            toast.success('Coupon updated successfully')
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

    deleteCoupon: async (couponId) => {
        set({ loading: true })
        try {
            const res = await restInstance.delete(`/coupon/delete/${couponId}`)
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            set((previousState) => {
                const newCoupons = previousState.allCoupons.filter((item) => item.couponId !== couponId)
                return { allCoupons: newCoupons }
            })
            toast.success("Coupon deleted successfully")
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
}))