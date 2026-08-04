import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Lock,
  LogIn,
  UserPlus,
  User,
  KeyRound,
  LogOut,
  ChevronDown,
} from "lucide-react";

const DesktopNav = ({
  user,
  userProfile,
  cart,
  logout,
  dropdownOpen,
  setDropdownOpen,
  dropdownRef,
  getInitials,
}) => {
  return (
    <div className="hidden md:flex justify-between items-center">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-emerald-400 flex items-center"
      >
        Elixir E-commerce
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-4">
        <Link
          to="/"
          className="text-gray-300 hover:text-emerald-400 transition"
        >
          Home
        </Link>

        {user && (
          <Link to="/cart" className="relative group">
            <ShoppingCart
              className="inline-block mr-1 group-hover:text-emerald-400"
              size={20}
            />

            <span>Cart</span>

            <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs">
              {cart.length}
            </span>
          </Link>
        )}

        {user?.role === "ADMIN" && (
          <Link
            to="/secret-dashboard"
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md flex items-center"
          >
            <Lock size={18} className="mr-1" />
            Dashboard
          </Link>
        )}

        {user?.role === "USER" && (
          <Link
            to="/customer-dashboard"
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md flex items-center"
          >
            <Lock size={18} className="mr-1" />
            Dashboard
          </Link>
        )}

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg px-3 py-1.5"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-semibold text-emerald-300">
                {getInitials(userProfile)}
              </div>

              <span className="text-sm text-gray-300">
                {userProfile?.firstName || userProfile?.email}
              </span>

              <ChevronDown
                size={14}
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                {/* User Info */}

                <div className="px-4 py-3 border-b border-gray-700 flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-sm font-semibold text-emerald-300">
                    {getInitials(userProfile)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-white text-sm truncate">
                      {userProfile?.firstName} {userProfile?.lastName}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {userProfile?.email}
                    </p>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <User size={15} />
                    View Profile
                  </Link>

                  <Link
                    to="/change-password"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <KeyRound size={15} />
                    Change Password
                  </Link>

                  <div className="border-t border-gray-700 my-2" />

                  <button
                    onClick={() => {
                      logout(user);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/40 w-full text-left"
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
            <Link
              to="/signup"
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center"
            >
              <UserPlus className="mr-2" size={18} />
              Sign Up
            </Link>

            <Link
              to="/login"
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              <LogIn className="mr-2" size={18} />
              Login
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default DesktopNav;
