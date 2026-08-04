import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const { user, logout, userProfile } = useUserStore();
  const { cart } = useCartStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (userProfile) => {
    if (!userProfile) return "U";

    const first = userProfile.firstName?.[0] || "";
    const last = userProfile.lastName?.[0] || "";

    return (
      (first + last).toUpperCase() ||
      userProfile.email?.[0]?.toUpperCase() ||
      "U"
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-emerald-800 z-50">
      <div className="container mx-auto px-4 py-3">

        <DesktopNav
          user={user}
          userProfile={userProfile}
          cart={cart}
          logout={logout}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          dropdownRef={dropdownRef}
          getInitials={getInitials}
        />

        <MobileNav
          user={user}
          userProfile={userProfile}
          cart={cart}
          logout={logout}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          getInitials={getInitials}
        />

      </div>
    </header>
  );
};

export default Navbar;