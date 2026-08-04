import { Link } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Lock,
  User,
  UserPlus,
  LogIn,
  LogOut,
  KeyRound,
} from "lucide-react";

const MobileMenu = ({
  user,
  userProfile,
  cart,
  logout,
  mobileMenuOpen,
  setMobileMenuOpen,
  getInitials,
}) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
      }`}
    >
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
        {/* User Information */}
        {user && (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-gray-700">
              <div className="w-11 h-11 rounded-full bg-emerald-800 flex items-center justify-center text-sm font-semibold text-emerald-300">
                {getInitials(userProfile)}
              </div>

              <div className="min-w-0">
                <p className="text-white font-medium truncate">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>

                <p className="text-xs text-gray-400 truncate">
                  {userProfile?.email}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Navigation */}

        <div className="flex flex-col p-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700 text-gray-200 transition"
          >
            <Home size={20} />
            Home
          </Link>

          {user && (
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-700 text-gray-200 transition"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} />
                Cart
              </div>

              <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1">
                {cart.length}
              </span>
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/secret-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700 text-gray-200 transition"
            >
              <Lock size={20} />
              Dashboard
            </Link>
          )}

          {user?.role === "USER" && (
            <Link
              to="/customer-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700 text-gray-200 transition"
            >
              <Lock size={20} />
              Dashboard
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700 text-gray-200 transition"
              >
                <User size={20} />
                View Profile
              </Link>

              <Link
                to="/change-password"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700 text-gray-200 transition"
              >
                <KeyRound size={20} />
                Change Password
              </Link>

              <div className="border-t border-gray-700 my-2" />

              <button
                onClick={() => {
                  logout(user);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-900/30 text-red-400 transition text-left w-full"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700 text-gray-200 transition"
              >
                <UserPlus size={20} />
                Sign Up
              </Link>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-700 text-gray-200 transition"
              >
                <LogIn size={20} />
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
