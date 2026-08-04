import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

const MobileNav = ({
  user,
  userProfile,
  cart,
  logout,
  mobileMenuOpen,
  setMobileMenuOpen,
  getInitials,
}) => {
  return (
    <div className="md:hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-emerald-400"
          onClick={() => setMobileMenuOpen(false)}
        >
          Elixir Store
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition"
        >
          {mobileMenuOpen ? (
            <X className="text-white" size={26} />
          ) : (
            <Menu className="text-white" size={26} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        user={user}
        userProfile={userProfile}
        cart={cart}
        logout={logout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        getInitials={getInitials}
      />
    </div>
  );
};

export default MobileNav;
