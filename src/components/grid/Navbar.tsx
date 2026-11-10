"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  MessageCircle,
} from "lucide-react";
import { UEFLogo } from "../ui/UEFLogo";
import { useAppSelector } from "@/redux";
import { getClientCookie, getHomeRouteForRole, isJwtTokenValid, parseJwtPayload } from "@/lib/authCookies";

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);
  const [accountHref, setAccountHref] = useState("/login");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = accessToken || getClientCookie("accessToken") || getClientCookie("token");
    if (token && isJwtTokenValid(token)) {
      const payload = parseJwtPayload(token);
      setAccountHref(
        getHomeRouteForRole(user?.role || payload?.role || getClientCookie("role"))
      );
    } else {
      setAccountHref("/login");
    }
  }, [user?.role, accessToken, pathname]);

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const collectionLinks = [
    { label: "All Furniture Collections", href: "/collections" },
    { label: "Gaming & Workstation Desks", href: "/collections/table" },
    { label: "CNC Laser Cut Metal Furniture", href: "/collections/table" },
    { label: "Executive Office Desks", href: "/collections/table" },
    { label: "Metal Storage & Slotted Racks", href: "/collections/storage" },
    { label: "Ergonomic & Office Chairs", href: "/collections/chair" },
    { label: "Custom Fabrication & Gates", href: "/contact" },
  ];

  return (
    <>
      {/* Main Navigation Bar */}
      <header
        className={`w-full transition-all duration-300 z-40 ${
          isHome
            ? isScrolled
              ? "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 py-3 text-neutral-900"
              : "fixed top-0 left-0 right-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent py-4 border-none text-white"
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

            {/* Unique Engineering & Furniture Logo Component */}
            <Link
              href="/"
              className="flex items-center group no-underline hover:no-underline"
              aria-label="Unique Engineering & Furniture"
            >
              <UEFLogo
                variant={isTransparent ? "light" : "dark"}
                size="md"
                showText={true}
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-sans text-[14px] font-medium tracking-[0.015em]">
            {/* All Collection Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setCollectionDropdownOpen(true)}
              onMouseLeave={() => setCollectionDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => router.push("/collections")}
                className={`bg-transparent border-0 outline-none cursor-pointer flex items-center gap-1 transition-colors ${
                  isTransparent
                    ? "text-white hover:text-white/85"
                    : "text-neutral-900 hover:text-cyan-700"
                }`}
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              {collectionDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-neutral-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {collectionLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block px-5 py-2.5 text-xs sm:text-sm text-neutral-800 hover:text-cyan-700 hover:bg-cyan-50 font-medium no-underline hover:no-underline transition-colors"
                      onClick={() => setCollectionDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/collections/table"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-cyan-700"
              }`}
            >
              Gaming &amp; Desks
            </Link>

            <Link
              href="/collections/storage"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-cyan-700"
              }`}
            >
              Metal Racks
            </Link>

            <Link
              href="/about"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-cyan-700"
              }`}
            >
              About UEF
            </Link>

            <Link
              href="/contact"
              className={`py-2 no-underline hover:no-underline transition-colors ${
                isTransparent
                  ? "text-white hover:text-white/85"
                  : "text-neutral-800 hover:text-cyan-700"
              }`}
            >
              Custom Order
            </Link>
          </nav>

          {/* Right: User, Search, Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* 1. Account / User Profile */}
            <Link
              href={accountHref}
              className={`p-1.5 rounded-full transition-colors no-underline hover:no-underline ${
                isTransparent
                  ? "text-white hover:text-white/80 hover:bg-white/10"
                  : "text-neutral-800 hover:text-black hover:bg-neutral-100"
              }`}
              title={
                accountHref === "/admin"
                  ? "Admin Portal"
                  : accountHref === "/dashboard"
                  ? "Customer Dashboard"
                  : "Sign In"
              }
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
              title="Search furniture &amp; metal products"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.6]" />
            </button>

            {/* 3. Shopping Bag / Cart */}
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
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-600 rounded-full ring-[1.5px] ring-white shadow-sm flex items-center justify-center"
                  aria-label={
                    totalItems > 0 ? `${totalItems} items in cart` : "Cart"
                  }
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            {/* Header with UEF Logo & Close */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <UEFLogo size="sm" variant="dark" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100 bg-transparent border-0 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Phone & WhatsApp Quick Bar */}
            <div className="bg-slate-900 text-white p-3 flex flex-col gap-1 text-xs">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Direct Hotline &amp; WhatsApp:
              </div>
              <a
                href="https://wa.me/8801755348053"
                className="font-bold text-cyan-400 flex items-center gap-1.5 no-underline hover:text-cyan-300"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>+880 1755-348053</span>
              </a>
            </div>

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg no-underline transition-colors"
              >
                All Furniture Collections
              </Link>

              <Link
                href="/collections/table"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg no-underline transition-colors"
              >
                Gaming &amp; Workstations
              </Link>

              <Link
                href="/collections/storage"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg no-underline transition-colors"
              >
                Metal Racks &amp; Channels
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg no-underline transition-colors"
              >
                About UEF Factory
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg no-underline transition-colors"
              >
                Custom Size Order
              </Link>
            </div>

            {/* Bottom Admin & Contact button */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex flex-col gap-2">
              <a
                href="https://www.facebook.com/uniqueengineeringfurniture"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center py-2 px-4 rounded-lg bg-blue-600 text-white font-medium text-xs no-underline hover:bg-blue-700"
              >
                Follow on Facebook (8.7K)
              </a>
              <Link
                href={accountHref}
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 px-4 rounded-lg border border-neutral-300 text-neutral-800 font-medium text-xs no-underline hover:bg-neutral-100"
              >
                {accountHref === "/admin"
                  ? "Admin Portal"
                  : accountHref === "/dashboard"
                  ? "My Dashboard"
                  : "Sign In / Register"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
