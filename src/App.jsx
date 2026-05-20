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
import ForgotPassword from "./Pages/ForgotPassword"
import PasswordReset from "./Pages/PasswordReset"
import PublicLayout from "./layouts/PublicLayout"
import GuestRoute from "./layouts/GuestRoute"
import AppLayout from "./layouts/AppLayout"
import ProtectedRoute from "./Components/ProtectedRoute"

function App() {
  // const [count, setCount] = useState(0)
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

          {/*PUBLIC ROUTES*/}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset" element={<PasswordReset />} />
          </Route>

          {/*GUEST ROUTES*/}
          <Route element={<GuestRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Route>
          </Route>

          {/*AUTHENTICATED ROUTES*/}
          <Route element={<AppLayout />}>

            {/*USER PROTECTED*/}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
            </Route>

            {/*ADMIN*/}
            <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
              <Route path="/secret-dashboard" element={<AdminPage />} />
            </Route>

            {/*CUSTOMER*/}
            <Route element={<ProtectedRoute allowedRole="USER" />}>
              <Route
                path="/customer-dashboard"
                element={<CustomerPage />}
              />
            </Route>

          </Route>

        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
