import { create } from "zustand";
import { restInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    loading: false,
    total: 0,
    subTotal: 0,

    getCartItems: async () => {
        try {
            const res = await restInstance.get("/cart")
            if (res.data.errors) {
                toast.error(res.data.errors[0].message)
                return
            }
            //console.log(res.data);     
            set({cart: res.data})
            //get().calculateTotals()
        } catch (error) {
            set({ cart: [] })
            const message = error.message || "Error creating product"
            toast.error(message,{id:'cart-error'})
        }
    },

    addToCart: async ({ productId, description, name, price }) => {
        const productCart = { productId, description, name, price };
        //console.log(productCart);
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
            toast.success('Product added to cart',{id:'add-to-cart'})
            get().calculateTotals();
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
    }
}))