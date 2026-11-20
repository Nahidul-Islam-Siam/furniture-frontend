"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  Loader2,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useAppSelector } from "@/redux";
import {
  useCreateOrderMutation,
  useInitiateSSLCommerzMutation,
} from "@/redux/service/orderApi";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    freeDeliveryThreshold,
    freeDeliveryProgress,
    clearCart,
  } = useCart();
  const { user } = useAppSelector((state) => state.auth);

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [initiateSSLCommerz, { isLoading: isInitiatingSSL }] =
    useInitiateSSLCommerzMutation();

  // Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [postalCode, setPostalCode] = useState("1212");
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "sslcommerz">("cod");

  // Shipping calculation
  const isFreeShipping = subtotal >= freeDeliveryThreshold;
  const deliveryCharge = isFreeShipping
    ? 0
    : city.toLowerCase().includes("dhaka")
    ? 150
    : 350;
  const totalAmount = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty. Please add products first.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error("Please enter a valid 11-digit Bangladesh phone number");
      return;
    }

    if (!street.trim()) {
      toast.error("Please enter your full delivery address");
      return;
    }

    try {
      const orderPayload = {
        customer: {
          name: name.trim(),
          email:
            email.trim() ||
            `${cleanPhone.replace(/\D/g, "")}@uniqueengineeringbd.com`,
          phone: cleanPhone,
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
          phone: cleanPhone,
          street: street.trim(),
          city: city.trim(),
          postalCode: postalCode.trim() || "1200",
          country: "Bangladesh",
        },
        paymentMethod: paymentMethod,
        shippingFee: deliveryCharge,
        notes: orderNote,
      };

      const res = await createOrder(orderPayload as any).unwrap();

      if (res.success && res.data) {
        const orderId = res.data._id;
        const orderNo =
          res.data.orderNumber || res.data._id.slice(-6).toUpperCase();

        if (paymentMethod === "sslcommerz") {
          toast.loading("Redirecting to SSLCommerz Payment Gateway...");
          try {
            const sslRes = await initiateSSLCommerz(orderId).unwrap();
            if (sslRes?.data?.gatewayUrl) {
              clearCart();
              window.location.href = sslRes.data.gatewayUrl;
              return;
            }
          } catch (sslErr: any) {
            toast.error(
              sslErr?.data?.message ||
                "Payment gateway unavailable. Order saved as Cash on Delivery."
            );
          }
        }

        // Cash on delivery or local success
        clearCart();
        toast.success(`Order #${orderNo} placed successfully!`);
        router.push(`/checkout/success?orderNumber=${encodeURIComponent(orderNo)}`);
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          "Failed to place order. Please review your address and contact details."
      );
    }
  };

  const isSubmitting = isCreatingOrder || isInitiatingSSL;

  // Empty cart fallback
  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] bg-neutral-50 flex items-center justify-center px-4 py-16 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-10 text-center shadow-sm space-y-6">
          <div className="w-20 h-20 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-heading font-black text-neutral-900 tracking-tight">
              Your Cart is Empty
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Explore our precision CNC laser cutting and custom metal furniture
              collection to add items to your checkout.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-black text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-all shadow-md active:scale-[0.99]"
          >
            Explore Collections <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50/60 min-h-screen py-8 sm:py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200/80">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/collections"
              className="hover:text-black transition-colors"
            >
              Store
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-900 font-semibold">Secure Checkout</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Checkout
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 7 Columns: Checkout Details Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Customer Contact Details */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-heading font-black text-neutral-900">
                      Customer Information
                    </h2>
                    <p className="text-xs text-neutral-500">
                      We will contact this number for order confirmation & delivery updates
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-400" /> Full Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nahidul Islam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" /> Phone Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" /> Email Address{" "}
                    <span className="text-neutral-400 font-normal lowercase">
                      (optional for invoice receipt)
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-heading font-black text-neutral-900">
                      Shipping & Delivery Address
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Nationwide delivery across Bangladesh with factory warranty
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" /> Street / House
                    / Area Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House / Flat No., Road No., Area, Thana (e.g. House 14, Road 5, Block C, Banani)"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      City / District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    >
                      <option value="Dhaka">Dhaka (Inside City)</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                      <option value="Gazipur">Gazipur / Narayanganj</option>
                      <option value="Other">Other District (All Bangladesh)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Postal / Zip Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1212"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-neutral-400" /> Delivery Notes /
                    Custom Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please call before delivery, deliver on Friday"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-heading font-black text-neutral-900">
                      Payment Method
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Choose your preferred payment method
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* COD Option */}
                  <label
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      paymentMethod === "cod"
                        ? "border-black bg-neutral-50/60 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-900">
                            Cash on Delivery
                          </div>
                          <div className="text-xs text-neutral-500">
                            Pay when item arrives
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mt-1 w-4 h-4 text-black focus:ring-black"
                      />
                    </div>
                    <div className="text-[11px] text-neutral-500 bg-white p-2 rounded-lg border border-neutral-100">
                      ✓ Pay cash directly to delivery personnel after inspection.
                    </div>
                  </label>

                  {/* SSLCommerz Option */}
                  <label
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      paymentMethod === "sslcommerz"
                        ? "border-black bg-neutral-50/60 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-900">
                            Online Payment
                          </div>
                          <div className="text-xs text-neutral-500">
                            bKash, Nagad, Visa, Master
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "sslcommerz"}
                        onChange={() => setPaymentMethod("sslcommerz")}
                        className="mt-1 w-4 h-4 text-black focus:ring-black"
                      />
                    </div>
                    <div className="text-[11px] text-neutral-500 bg-white p-2 rounded-lg border border-neutral-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      Instant SSLCommerz secure payment gateway.
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h3 className="text-lg font-heading font-black text-neutral-900">
                    Order Summary
                  </h3>
                  <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 pb-3 border-b border-neutral-100 last:border-0 last:pb-0"
                    >
                      <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200/70 overflow-hidden relative flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        )}
                        <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-bl flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                          {item.product.title}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} × ৳{item.product.priceNumber.toLocaleString("en-BD")}
                        </p>
                      </div>

                      <div className="text-xs sm:text-sm font-bold text-neutral-900 text-right">
                        ৳{(item.product.priceNumber * item.quantity).toLocaleString("en-BD")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2.5 pt-2 border-t border-neutral-100 text-sm">
                  <div className="flex justify-between text-neutral-600 text-xs">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">
                      ৳{subtotal.toLocaleString("en-BD")}.00
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600 text-xs items-center">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-neutral-400" /> Delivery
                      Charge
                    </span>
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-bold uppercase text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                        FREE
                      </span>
                    ) : (
                      <span className="font-semibold text-neutral-900">
                        ৳{deliveryCharge.toLocaleString("en-BD")}.00
                      </span>
                    )}
                  </div>

                  {subtotal < freeDeliveryThreshold && (
                    <div className="text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                      Add ৳{(freeDeliveryThreshold - subtotal).toLocaleString("en-BD")} more to unlock <b>Free Delivery</b>!
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                    <span className="text-base font-heading font-black text-neutral-900">
                      Total Payable
                    </span>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-heading font-black text-neutral-900 tracking-tight">
                        ৳{totalAmount.toLocaleString("en-BD")}
                      </span>
                      <span className="block text-[10px] text-neutral-400">
                        Includes all taxes & delivery fees
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-black text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Placing Your
                      Order...
                    </>
                  ) : paymentMethod === "sslcommerz" ? (
                    <>
                      Pay ৳{totalAmount.toLocaleString("en-BD")} Online{" "}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Confirm Cash on Delivery Order{" "}
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Trust & Guarantee Badges */}
                <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>100% Quality Guaranteed CNC Laser Cutting & Metal Finish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                    <span>Nationwide Safe Delivery across Bangladesh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>Manufactured in our own factory with genuine parts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

