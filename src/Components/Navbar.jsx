import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Lock, LogIn, UserPlus, User, KeyRound, LogOut, ChevronDown } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'
import { useCartStore } from '../stores/useCartStore'

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const { user, logout } = useUserStore()
    const { cart } = useCartStore()

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getInitials = (user) => {
        if (!user) return 'U'
        const first = user.firstName?.[0] || ''
        const last = user.lastName?.[0] || ''
        return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
    }

    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex flex-wrap justify-between items-center'>
                    <Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
                        E-commerce
                    </Link>

                    <nav className='flex flex-wrap items-center gap-4'>
                        <Link to='/' className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
                            Home
                        </Link>

                        {user && (
                            <Link to='/cart' className='relative group'>
                                <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                <span className='hidden sm:inline'>Cart</span>
                                <span className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'>
                                    {cart.length}
                                </span>
                            </Link>
                        )}

                        {user && user.role === 'ADMIN' && (
                            <Link className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center' to='/secret-dashboard'>
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                        )}

                        {user && user.role === 'USER' && (
                            <Link className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center' to='/customer-dashboard'>
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                        )}

                        {user ? (
                            <div className='relative' ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className='flex items-center gap-2 bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg px-3 py-1.5 transition duration-200'
                                >
                                    {/* avatar initials */}
                                    <div className='w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-semibold text-emerald-300 flex-shrink-0'>
                                        {getInitials(user)}
                                    </div>
                                    <span className='hidden sm:inline text-sm text-gray-300'>
                                        {user.firstName || user.email}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* dropdown menu */}
                                {dropdownOpen && (
                                    <div className='absolute right-0 top-[calc(100%+8px)] w-56 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl z-50'>

                                        {/* user info */}
                                        <div className='px-4 py-3 border-b border-gray-700 flex items-center gap-3'>
                                            <div className='w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-sm font-semibold text-emerald-300 flex-shrink-0'>
                                                {getInitials(user)}
                                            </div>
                                            <div className='min-w-0'>
                                                <p className='text-sm font-medium text-white truncate'>
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                                            </div>
                                        </div>

                                        {/* menu items */}
                                        <div className='p-1.5'>
                                            <Link
                                                to='/profile'
                                                onClick={() => setDropdownOpen(false)}
                                                className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150'
                                            >
                                                <User size={15} />
                                                View profile
                                            </Link>
                                            <Link
                                                to='/change-password'
                                                onClick={() => setDropdownOpen(false)}
                                                className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150'
                                            >
                                                <KeyRound size={15} />
                                                Change password
                                            </Link>

                                            <div className='border-t border-gray-700 my-1.5' />

                                            <button
                                                onClick={() => { logout(user); setDropdownOpen(false) }}
                                                className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950 hover:bg-opacity-40 w-full text-left transition duration-150'
                                            >
                                                <LogOut size={15} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out' to='/signup'>
                                    <UserPlus className='mr-2' size={18} />
                                    Sign Up
                                </Link>
                                <Link className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out' to='/login'>
                                    <LogIn className='mr-2' size={18} />
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Navbar