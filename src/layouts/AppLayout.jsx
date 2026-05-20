import { useEffect } from "react"
import { useCartStore } from "../stores/useCartStore"
import { useUserStore } from "../stores/useUserStore"
import { Outlet } from "react-router-dom"

const AppLayout = () => {
    const { checkAuth, googleRedirect, user } = useUserStore()
    const { getCartItems, getMyCoupon, getPublicCoupons } = useCartStore()

    useEffect(() => {
        checkAuth()
        googleRedirect()
    }, [])

    useEffect(() => {
        getPublicCoupons()
        if (user) {
            getCartItems()
            getMyCoupon()    
        }
    }, [getCartItems, user])

    return <><Outlet/></>
}
export default AppLayout