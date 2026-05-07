import { Navigate, Route, Routes } from "react-router-dom"
import Homepage from "./Pages/Homepage"
import Signup from "./Pages/Signup"
import Login from "./Pages/Login"
import Navbar from "./Components/Navbar"
import AdminPage from "./Pages/AdminPage"
import { Toaster } from "react-hot-toast"
import { useUserStore } from "./stores/useUserStore"
import { useCartStore } from './stores/useCartStore'
import { useEffect } from "react"
import LoadingSpinner from "./Components/loadingSpinner"
import CategoryPage from "./Pages/CategoryPage"
import CartPage from "./Pages/CartPage"
import CustomerPage from "./Pages/CustomerPage"

function App() {
  // const [count, setCount] = useState(0)
  const { checkingAuth, checkAuth, googleRedirect } = useUserStore()
  const { getCartItems, getMyCoupon, getPublicCoupons, publicCoupons } = useCartStore()

  useEffect(() => {
    googleRedirect()
    checkAuth()

  }, [])
  const { user } = useUserStore()

  useEffect(() => {
    if (user) {
      getCartItems()
      getMyCoupon()
      getPublicCoupons()
    }
  },[getCartItems,user])
  

  if (checkingAuth) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/signup" element={user ? <Navigate to={'/'} /> : <Signup />}></Route>
          <Route path="/login" element={user ? <Navigate to={'/'} /> : <Login />}></Route>
          <Route path="/secret-dashboard" element={user && user.role === 'ADMIN' ? <AdminPage /> : <Navigate to={'/login'} />}></Route>
          <Route path="/customer-dashboard" element={user && user.role === 'USER' ? <CustomerPage /> : <Navigate to={'/login'} />}></Route>
          <Route path="/category/:category" element={<CategoryPage />}></Route>
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to={'/login'}/>}></Route>
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
