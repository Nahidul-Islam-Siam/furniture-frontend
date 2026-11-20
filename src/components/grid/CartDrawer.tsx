"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    selectedCart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    toggleItemSelection,
    selectAllItems,
    subtotal,
    selectedItemsCount,
    freeDeliveryThreshold,
    freeDeliveryProgress,
  } = useCart();

  if (!isCartOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const allSelected = cart.length > 0 && cart.every((i) => i.selected !== false);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-neutral-900 leading-tight">
                Your Shopping Cart
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                {selectedItemsCount} of {totalItemsCount} items selected
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
            title="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            /* Empty Cart View */
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-semibold text-lg text-neutral-800">
                  Your cart is empty
                </h3>
                <p className="text-neutral-500 text-xs max-w-xs">
                  Discover our precision-engineered custom furniture, ergonomic setups, and CNC laser cut art.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div>
              {/* Select All Toggle Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100 text-xs text-neutral-600">
                <label className="flex items-center gap-2 cursor-pointer select-none font-medium hover:text-black">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => selectAllItems(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black accent-black cursor-pointer"
                  />
                  <span>Select All ({cart.length})</span>
                </label>
                <span className="text-[11px] text-neutral-400 font-medium">
                  {selectedCart.length} selected for checkout
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {cart.map((item) => {
                  const isItemSelected = item.selected !== false;
                  return (
                    <div
                      key={item.id}
                      className={`py-4 first:pt-0 last:pb-0 flex items-center gap-3 transition-opacity ${
                        isItemSelected ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      {/* Checkbox per item */}
                      <input
                        type="checkbox"
                        checked={isItemSelected}
                        onChange={() => toggleItemSelection(item.product.id)}
                        className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black accent-black shrink-0 cursor-pointer"
                        title="Select this item for checkout"
                      />

                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1">
                              {item.product.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-neutral-400 hover:text-red-600 transition-colors shrink-0 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            {item.product.category}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Stepper */}
                          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                              title="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-xs sm:text-sm font-bold text-neutral-900 font-sans">
                              Tk {(item.product.priceNumber * item.quantity).toLocaleString("en-BD")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50/90 space-y-4">
            {/* Subtotal & Free Assembly Note */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-600 font-medium">Subtotal:</span>
                <span className="font-heading font-black text-xl text-neutral-900">
                  Tk {subtotal.toLocaleString("en-BD")}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Nationwide shipping & delivery calculated at secure checkout.
              </p>
            </div>

            {/* Direct Link to Dedicated Full Checkout Page (Option 1) */}
            <Link
              href="/checkout"
              onClick={(e) => {
                if (selectedCart.length === 0) {
                  // If none explicitly selected, select all before navigating
                  selectAllItems(true);
                }
                setIsCartOpen(false);
              }}
              className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.99]"
            >
              <span>
                Proceed to Checkout ({selectedCart.length > 0 ? selectedCart.length : cart.length}{" "}
                {(selectedCart.length > 0 ? selectedCart.length : cart.length) === 1
                  ? "item"
                  : "items"}
                )
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-neutral-500 text-center font-medium">
              <div className="flex flex-col items-center gap-1 p-1 bg-white rounded-lg border border-neutral-100 shadow-2xs">
                <Truck className="w-3.5 h-3.5 text-neutral-700" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1 bg-white rounded-lg border border-neutral-100 shadow-2xs">
                <Wrench className="w-3.5 h-3.5 text-neutral-700" />
                <span>Free Assembly</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1 bg-white rounded-lg border border-neutral-100 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Factory Warranty</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
