import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const collectionLinks = [
    { label: "All Chairs", href: "/collections/chair" },
    { label: "All Tables & Desks", href: "/collections/table" },
    { label: "Elevating Desk Series", href: "/collections/table" },
    { label: "Sofa Collection", href: "/collections/sofa" },
    { label: "Storage & Credenzas", href: "/collections/storage" },
    { label: "Steelcase Executive Chairs", href: "/collections/chair" },
    { label: "All Collections", href: "/collections" },
  ];

  return (
    <>
      {/* Main Navigation Bar */}
      <header
        className={`w-full transition-all duration-300 z-40 ${
          isHome
            ? isScrolled
              ? "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 py-3.5 text-neutral-900"
              : "fixed top-0 left-0 right-0 bg-gradient-to-b from-black/55 via-black/25 to-transparent py-4 sm:py-5 border-none text-white"
            : "sticky top-0 bg-white border-b border-neutral-100 py-3.5 text-neutral-900 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile hamburger & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-1.5 bg-transparent border-0 outline-none cursor-pointer transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/80"
                  : "text-neutral-800 hover:text-black"
              }`}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Exact Orange GRID Badge Logo */}
            <Link
              to="/"
              className="flex items-center group no-underline hover:no-underline"
              aria-label="GRID Furniture"
            >
              {!logoLoadFailed ? (
                <img
                  src="/images/logo.png"
                  alt="GRID"
                  className="h-10 sm:h-9 w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
                  onError={() => setLogoLoadFailed(true)}
                />
              ) : (
                <div className="bg-[#e07548] text-white font-black italic tracking-wider text-base sm:text-lg px-3.5 py-1 rounded-lg select-none shadow-sm">
                  GRID
                </div>
              )}
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-[15px] font-normal tracking-[0.015em]">
            {/* All Collection Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setCollectionDropdownOpen(true)}
              onMouseLeave={() => setCollectionDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => navigate("/collections")}
                className={`bg-transparent border-0 outline-none cursor-pointer flex items-center gap-1 transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/85"
                    : "text-neutral-900 hover:text-black"
                }`}
              >
                <span>All Collection</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              {collectionDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-neutral-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {collectionLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="block px-5 py-2.5 text-sm text-neutral-800 hover:text-black hover:bg-neutral-50 font-normal no-underline hover:no-underline transition-colors"
                      onClick={() => setCollectionDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/collections/table"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-black"
              }`}
            >
              Elevating Desk Series
            </Link>

            <Link
              to="/pages/grid-studio"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-black"
              }`}
            >
              Grid Studio
            </Link>

            <a
              href="https://www.youtube.com/channel/UCerNlR7eZVNTqn_Z90t-Tjg/videos"
              target="_blank"
              rel="noopener noreferrer"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-black"
              }`}
            >
              Videos
            </a>

            <Link
              to="/blog"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-black"
              }`}
            >
              Articles
            </Link>

            <Link
              to="/about"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-black"
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-black"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right: User, Search, Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* 1. Account / User Profile */}
            <Link
              to="/login"
              className={`p-1.5 rounded-full transition-colors no-underline hover:no-underline ${
                isTransparent
                  ? "text-white hover:text-white/80 hover:bg-white/10"
                  : "text-neutral-800 hover:text-black hover:bg-neutral-100"
              }`}
              title="Customer Login"
              aria-label="User Account"
            >
              <User className="w-5 h-5 stroke-[1.6]" />
            </Link>

            {/* 2. Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className={`p-1.5 rounded-full bg-transparent border-0 outline-none cursor-pointer transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/80 hover:bg-white/10"
                  : "text-neutral-800 hover:text-black hover:bg-neutral-100"
              }`}
              title="Search products"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.6]" />
            </button>

            {/* 3. Shopping Bag / Cart with red notification dot */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className={`p-1.5 rounded-full bg-transparent border-0 outline-none cursor-pointer transition-colors relative ${
                isTransparent
                  ? "text-white hover:text-white/80 hover:bg-white/10"
                  : "text-neutral-900 hover:text-black hover:bg-neutral-100"
              }`}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
                {/* Red dot badge matching screenshot */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#e24434] rounded-full ring-[1.5px] ring-white shadow-sm flex items-center justify-center"
                  aria-label={
                    totalItems > 0 ? `${totalItems} items in cart` : "Cart"
                  }
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <div className="bg-[#e07548] text-white font-black italic tracking-wider text-base px-3 py-1 rounded-md">
                  GRID
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-transparent border-0 outline-none cursor-pointer text-neutral-500 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <div className="p-5 space-y-4 font-sans text-base">
                <div className="border-b border-neutral-100 pb-3">
                  <div className="font-semibold text-neutral-900 mb-2">
                    Collections
                  </div>
                  <div className="pl-3 space-y-2.5 text-sm text-neutral-600">
                    {collectionLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="block hover:text-black py-1 no-underline hover:no-underline"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  to="/collections/table"
                  className="block text-neutral-800 font-medium hover:text-black py-1 no-underline hover:no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Elevating Desk Series
                </Link>
                <Link
                  to="/pages/grid-studio"
                  className="block text-neutral-800 font-medium hover:text-black py-1 no-underline hover:no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Grid Studio
                </Link>
                <a
                  href="https://www.youtube.com/channel/UCerNlR7eZVNTqn_Z90t-Tjg/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-neutral-800 font-medium hover:text-black py-1 no-underline hover:no-underline"
                >
                  Videos
                </a>
                <Link
                  to="/blog"
                  className="block text-neutral-800 font-medium hover:text-black py-1 no-underline hover:no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Articles
                </Link>
                <Link
                  to="/about"
                  className="block text-neutral-800 font-medium hover:text-black py-1 no-underline hover:no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-neutral-800 font-medium hover:text-black py-1 no-underline hover:no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="block text-neutral-800 font-medium hover:text-black pt-2 border-t border-neutral-100 no-underline hover:no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In / Account
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-800">
                GRID Furniture Bangladesh
              </p>
              <p>Hotline: +880 1700-009947</p>
              <p>Delivery all over Bangladesh</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
