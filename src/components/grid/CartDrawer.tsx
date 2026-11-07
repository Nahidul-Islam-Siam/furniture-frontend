"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/redux/service/orderApi";
import { useAppSelector } from "@/redux";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeDeliveryThreshold,
    freeDeliveryProgress,
    clearCart,
  } = useCart();

  const { user } = useAppSelector((state) => state.auth);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("");

  // Customer Checkout Details
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "customer@furniture.com");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [postalCode, setPostalCode] = useState("1212");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "sslcommerz">("cod");
  const [orderNote, setOrderNote] = useState("");

  if (!isCartOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter a phone number for delivery contact");
      return;
    }
    if (!street.trim()) {
      toast.error("Please enter your delivery street address");
      return;
    }

    try {
      const orderPayload = {
        customer: {
          name: name.trim(),
          email: email.trim() || `${phone.replace(/\D/g, "")}@furniture.com`,
          phone: phone.trim(),
        },
        items: cart.map((item) => ({
          product: item.product.id,
          name: item.product.title,
          price: item.product.priceNumber,
          quantity: item.quantity,
          image: item.product.images?.[0] || "",
        })),
        shippingAddress: {
          recipientName: name.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          postalCode: postalCode.trim() || "1200",
          country: "Bangladesh",
        },
        paymentMethod: paymentMethod,
        shippingFee: subtotal >= freeDeliveryThreshold ? 0 : 500,
        notes: orderNote,
      };

      const res = await createOrder(orderPayload as any).unwrap();

      if (res.success && res.data) {
        const orderNo = res.data.orderNumber || res.data._id.slice(-6).toUpperCase();
        setPlacedOrderNumber(orderNo);
        setOrderSuccess(true);
        clearCart();
        setStep("cart");
        toast.success(`Order #${orderNo} placed successfully!`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place order. Please verify your details.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === "checkout" && !orderSuccess && (
              <button
                onClick={() => setStep("cart")}
                className="p-1 -ml-1 text-neutral-500 hover:text-black rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            <h2 className="font-heading font-semibold text-lg text-neutral-900">
              {orderSuccess
                ? "Order Confirmed"
                : step === "checkout"
                ? "Delivery & Checkout"
                : `Your Cart (${cart.reduce((s, i) => s + i.quantity, 0)})`}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setOrderSuccess(false);
              setStep("cart");
            }}
            className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar (only on cart step) */}
        {step === "cart" && !orderSuccess && (
          <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100">
            <div className="flex justify-between items-center text-xs font-medium text-neutral-700 mb-1.5">
              {subtotal >= freeDeliveryThreshold ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Congratulations! Free Delivery inside Dhaka
                </span>
              ) : (
                <span>
                  Add{" "}
                  <span className="font-bold text-neutral-900">
                    Tk {(freeDeliveryThreshold - subtotal).toLocaleString()}
                  </span>{" "}
                  more for Free Delivery
                </span>
              )}
              <span className="text-neutral-500">{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  subtotal >= freeDeliveryThreshold ? "bg-emerald-600" : "bg-neutral-900"
                }`}
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {orderSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-neutral-900">
                Order Confirmed!
              </h3>
              <p className="font-semibold text-neutral-800">
                Order ID: <span className="text-black">#{placedOrderNumber}</span>
              </p>
              <p className="text-neutral-600 text-sm max-w-xs">
                Your order has been recorded into our system. Our delivery team will call your phone number within 24 hours to schedule assembly inside Dhaka.
              </p>
              <button
                onClick={() => {
                  setOrderSuccess(false);
                  setIsCartOpen(false);
                }}
                className="mt-4 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : step === "checkout" ? (
            /* Checkout Form Step */
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between">
                <span className="text-neutral-500">Items Total ({cart.length})</span>
                <span className="font-bold text-sm text-neutral-900">
                  Tk {subtotal.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-neutral-500" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahim Chowdhury"
                  className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" /> Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House number, Road, Area (e.g. House 14, Road 5, Dhanmondi)"
                  className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-xs"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="1212"
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-xs"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-medium text-neutral-700 mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === "cod"
                        ? "border-black bg-neutral-900 text-white"
                        : "border-neutral-200 hover:border-black bg-white text-neutral-800"
                    }`}
                  >
                    <span className="font-semibold text-xs">Cash on Delivery</span>
                    <span className={`text-[10px] mt-0.5 ${paymentMethod === "cod" ? "text-neutral-300" : "text-neutral-500"}`}>
                      Pay upon inspection
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("sslcommerz")}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === "sslcommerz"
                        ? "border-black bg-neutral-900 text-white"
                        : "border-neutral-200 hover:border-black bg-white text-neutral-800"
                    }`}
                  >
                    <span className="font-semibold text-xs">Online Payment</span>
                    <span className={`text-[10px] mt-0.5 ${paymentMethod === "sslcommerz" ? "text-neutral-300" : "text-neutral-500"}`}>
                      bKash / Cards
                    </span>
                  </button>
                </div>
              </div>
            </form>
          ) : cart.length === 0 ? (
            /* Empty Cart */
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-800">
                Your cart is empty
              </h3>
              <p className="text-neutral-500 text-sm max-w-xs">
                Explore our curated collection of ergonomic chairs and motorized standing desks.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div className="divide-y divide-neutral-100">
              {cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-md bg-neutral-50 border border-neutral-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {item.product.category}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Stepper */}
                      <div className="flex items-center border border-neutral-200 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-semibold text-neutral-900 font-sans">
                          Tk {(item.product.priceNumber * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && !orderSuccess && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50 space-y-4">
            {step === "cart" ? (
              <>
                {/* Special Instructions Note */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Order Note / Special Assembly Instructions:
                  </label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Floor number, lift availability, or preferred delivery timing..."
                    className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    rows={2}
                  />
                </div>

                {/* Subtotal */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-sm text-neutral-600">
                    <span>Subtotal:</span>
                    <span className="font-heading font-bold text-lg text-neutral-900">
                      Tk {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Taxes & assembly inside Dhaka included.
                  </p>
                </div>

                {/* Go To Checkout Button */}
                <button
                  onClick={() => setStep("checkout")}
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-medium text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Proceed to Delivery Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-600">Total Payable ({paymentMethod.toUpperCase()}):</span>
                  <span className="font-heading font-bold text-xl text-neutral-900">
                    Tk {(subtotal + (subtotal >= freeDeliveryThreshold ? 0 : 500)).toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isCreatingOrder}
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-medium text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-75"
                >
                  {isCreatingOrder ? (
                    <span>Placing Order in Database...</span>
                  ) : (
                    <span>Confirm Order • Tk {(subtotal + (subtotal >= freeDeliveryThreshold ? 0 : 500)).toLocaleString()}</span>
                  )}
                </button>
              </>
            )}

            {/* Badges */}
            <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-neutral-400">
              <span>Cash on Delivery</span>
              <span>•</span>
              <span>Free Assembly</span>
              <span>•</span>
              <span>Warranty Backed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
