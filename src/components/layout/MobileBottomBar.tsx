"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAppSelector } from "@/redux";

interface MobileBottomBarProps {
  onOpenSearch: () => void;
}

export function MobileBottomBar({ onOpenSearch }: MobileBottomBarProps) {
  const pathname = usePathname();
  const { cart, setIsCartOpen } = useCart();
  const { user } = useAppSelector((state) => state.auth);

  // Hide on admin routes or when inside product image zoom
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 py-1.5 px-3 flex items-center justify-around lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe"
    >
      {/* Home */}
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition-colors select-none ${
          pathname === "/" ? "text-neutral-950 font-black" : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        <Home className={`size-5 ${pathname === "/" ? "stroke-[2.2]" : "stroke-[1.6]"}`} />
        <span>Home</span>
      </Link>

      {/* Collections / Catalog */}
      <Link
        href="/collections"
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition-colors select-none ${
          pathname?.startsWith("/collections") ? "text-neutral-950 font-black" : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        <Layers className={`size-5 ${pathname?.startsWith("/collections") ? "stroke-[2.2]" : "stroke-[1.6]"}`} />
        <span>Catalog</span>
      </Link>

      {/* Search Trigger */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors select-none cursor-pointer"
        aria-label="Search furniture catalog"
      >
        <Search className="size-5 stroke-[1.6]" />
        <span>Search</span>
      </button>

      {/* Cart with Live Count Badge */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold text-neutral-500 hover:text-neutral-900 transition-colors select-none relative cursor-pointer"
        aria-label={`Open shopping cart with ${totalCartCount} items`}
      >
        <div className="relative">
          <ShoppingBag className="size-5 stroke-[1.6]" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-neutral-950 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-2xs">
              {totalCartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      {/* Account / Dashboard */}
      <Link
        href={user ? "/dashboard" : "/login"}
        className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition-colors select-none ${
          pathname?.startsWith("/dashboard") || pathname === "/login"
            ? "text-neutral-950 font-black"
            : "text-neutral-500 hover:text-neutral-900"
        }`}
      >
        <User className={`size-5 ${pathname?.startsWith("/dashboard") || pathname === "/login" ? "stroke-[2.2]" : "stroke-[1.6]"}`} />
        <span>{user ? "Account" : "Sign In"}</span>
      </Link>
    </nav>
  );
}

export default MobileBottomBar;

