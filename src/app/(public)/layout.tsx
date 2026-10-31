"use client";

import { useState } from "react";
import { Navbar } from "@/components/grid/Navbar";
import { Footer } from "@/components/grid/Footer";
import { CartDrawer } from "@/components/grid/CartDrawer";
import { SearchModal } from "@/components/grid/SearchModal";
import { QuickViewModal } from "@/components/grid/QuickViewModal";
import { CartProvider } from "@/context/CartContext";
import { QuickViewProvider } from "@/context/QuickViewContext";

export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <CartProvider>
      <QuickViewProvider>
        <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-black selection:text-white">
          <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
          <main className="flex-grow">{children}</main>
          <Footer />
          {/* Interactive Drawers & Modals */}
          <CartDrawer />
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
          <QuickViewModal />
        </div>
      </QuickViewProvider>
    </CartProvider>
  );
}

