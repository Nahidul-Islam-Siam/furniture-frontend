"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
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
  Building,
  Plus,
  Minus,
  Trash2,
  Check,
  X,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useAppSelector } from "@/redux";
import {
  useCreateOrderMutation,
  useInitiateSSLCommerzMutation,
} from "@/redux/service/orderApi";
import {
  BANGLADESH_DISTRICTS,
  ALL_DISTRICT_NAMES,
} from "@/lib/bangladesh-geo";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    freeDeliveryThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { user } = useAppSelector((state) => state.auth);

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [initiateSSLCommerz, { isLoading: isInitiatingSSL }] =
    useInitiateSSLCommerzMutation();

  // 1. Customer Contact States
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [altPhone, setAltPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");

  // 2. Delivery Zone & Address States
  const [deliveryZone, setDeliveryZone] = useState<"inside_dhaka" | "sub_dhaka" | "outside_dhaka">("inside_dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [thana, setThana] = useState("Dhanmondi");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("1209");

  // Furniture Specifics (Elevator & Floor)
  const [hasElevator, setHasElevator] = useState<"yes" | "no">("yes");
  const [floorNumber, setFloorNumber] = useState("Ground Floor");
  const [orderNote, setOrderNote] = useState("");

  // 3. Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "sslcommerz">("cod");

  // Sync user info if loaded from redux
  useEffect(() => {
    if (user?.name && !name) setName(user.name);
    if (user?.phone && !phone) setPhone(user.phone);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  // Update thanas list when district changes
  const availableThanas = useMemo(() => {
    return BANGLADESH_DISTRICTS[district]?.thanas || ["Sadar / Main Town"];
  }, [district]);

  // When deliveryZone changes, update default district
  const handleZoneChange = (zone: "inside_dhaka" | "sub_dhaka" | "outside_dhaka") => {
    setDeliveryZone(zone);
    if (zone === "inside_dhaka") {
      setDistrict("Dhaka");
      setThana("Dhanmondi");
    } else if (zone === "sub_dhaka") {
      setDistrict("Gazipur");
      setThana("Gazipur Sadar");
    } else {
      setDistrict("Chittagong");
      setThana("Agrabad");
    }
  };

  const handleDistrictChange = (dName: string) => {
    setDistrict(dName);
    const districtObj = BANGLADESH_DISTRICTS[dName];
    if (districtObj) {
      setDeliveryZone(districtObj.zone);
      setThana(districtObj.thanas[0] || "Sadar");
    }
  };

  // ── Delivery Charge Engine ──
  const hasFreeDeliveryItem = cart.some((item) => Boolean((item.product as any).isFreeDelivery));
  const isFreeDelivery = hasFreeDeliveryItem;
  const deliveryCharge = isFreeDelivery
    ? 0
    : deliveryZone === "inside_dhaka"
    ? 150
    : deliveryZone === "sub_dhaka"
    ? 200
    : 350;

  const totalAmount = subtotal + deliveryCharge;

  // Order Submission Handler
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

    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error("Please enter a valid 11-digit Bangladesh phone number (01XXXXXXXXX)");
      return;
    }

    if (!streetAddress.trim()) {
      toast.error("Please enter your street address / house details");
      return;
    }

    // Compose detailed delivery instructions
    const fullNotes = [
      `Floor: ${floorNumber}`,
      `Lift: ${hasElevator === "yes" ? "Elevator Available" : "Stairs Only (No Lift)"}`,
      altPhone.trim() ? `Alt Phone: ${altPhone.trim()}` : null,
      orderNote.trim() ? `Note: ${orderNote.trim()}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const orderPayload = {
        customer: {
          name: name.trim(),
          email: email.trim() || `${cleanPhone}@furniture.com`,
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
          street: `${streetAddress.trim()}, ${thana}`,
          city: district,
          postalCode: postalCode.trim() || "1200",
          country: "Bangladesh",
        },
        paymentMethod: paymentMethod,
        shippingFee: deliveryCharge,
        discount: 0,
        notes: fullNotes,
      };

      const res = await createOrder(orderPayload as any).unwrap();

      if (res.success && res.data) {
        const orderId = res.data._id;
        const orderNo = res.data.orderNumber || res.data._id.slice(-6).toUpperCase();

        if (paymentMethod === "sslcommerz") {
          toast.loading("Connecting to SSLCommerz Gateway...");
          try {
            const sslRes = await initiateSSLCommerz(orderId).unwrap();
            if (sslRes?.data?.gatewayUrl) {
              clearCart();
              window.location.href = sslRes.data.gatewayUrl;
              return;
            }
          } catch (sslErr: any) {
            toast.error(
              sslErr?.data?.message || "Payment gateway offline. Saved as Cash on Delivery."
            );
          }
        }

        clearCart();
        toast.success(`Order #${orderNo} placed successfully!`);
        router.push(
          `/checkout/success?orderNumber=${encodeURIComponent(
            orderNo
          )}&method=${encodeURIComponent(paymentMethod)}`
        );
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place order. Please review your details.");
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
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Explore our precision CNC laser cutting and custom furniture collections to add items.
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
    <div className="bg-neutral-50/70 min-h-screen py-8 sm:py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header / Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-neutral-200/80 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/collections" className="hover:text-black transition-colors">Store</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-neutral-900 font-semibold">Secure Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-neutral-900 mt-1">
              Finalize Your Order
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted &amp; Guaranteed
          </div>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <form onSubmit={handleSubmitOrder} id="checkout-main-form">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ═══ LEFT 7 COLUMNS: Customer & Delivery Details ═══ */}
            <div className="lg:col-span-7 space-y-6">

              {/* 1. Customer Information Card */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-heading font-black text-neutral-900">
                      Customer Information
                    </h2>
                    <p className="text-xs text-neutral-500">
                      We will call this phone number to schedule furniture delivery &amp; assembly
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-400" /> Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nahidul Islam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white"
                    />
                  </div>

                  {/* Primary Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" /> Phone Number (11-Digits) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Alt Phone (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Alternative Phone <span className="text-neutral-400 font-normal lowercase">(optional backup)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" /> Email Address <span className="text-neutral-400 font-normal lowercase">(for invoice receipt)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping & Delivery Zone Card */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-heading font-black text-neutral-900">
                      Delivery Zone &amp; Address
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Select your delivery region for accurate freight and factory dispatch
                    </p>
                  </div>
                </div>

                {/* Delivery Zone Radio Buttons with Price Badges */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                    Choose Delivery Zone *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Zone 1: Inside Dhaka */}
                    <button
                      type="button"
                      onClick={() => handleZoneChange("inside_dhaka")}
                      className={`p-3.5 rounded-xl border-2 text-left flex flex-col justify-between transition ${
                        deliveryZone === "inside_dhaka"
                          ? "border-black bg-neutral-900 text-white shadow-xs"
                          : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">Inside Dhaka</span>
                        {deliveryZone === "inside_dhaka" && (
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className={`text-[11px] mt-1 ${deliveryZone === "inside_dhaka" ? "text-neutral-300" : "text-neutral-500"}`}>
                        {isFreeDelivery ? "FREE (৳5k+ Order)" : "৳150 Delivery"}
                      </span>
                    </button>

                    {/* Zone 2: Dhaka Suburbs */}
                    <button
                      type="button"
                      onClick={() => handleZoneChange("sub_dhaka")}
                      className={`p-3.5 rounded-xl border-2 text-left flex flex-col justify-between transition ${
                        deliveryZone === "sub_dhaka"
                          ? "border-black bg-neutral-900 text-white shadow-xs"
                          : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">Dhaka Suburbs</span>
                        {deliveryZone === "sub_dhaka" && (
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className={`text-[11px] mt-1 ${deliveryZone === "sub_dhaka" ? "text-neutral-300" : "text-neutral-500"}`}>
                        Gazipur/Savar/N.ganj (৳200)
                      </span>
                    </button>

                    {/* Zone 3: Outside Dhaka */}
                    <button
                      type="button"
                      onClick={() => handleZoneChange("outside_dhaka")}
                      className={`p-3.5 rounded-xl border-2 text-left flex flex-col justify-between transition ${
                        deliveryZone === "outside_dhaka"
                          ? "border-black bg-neutral-900 text-white shadow-xs"
                          : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">Outside Dhaka</span>
                        {deliveryZone === "outside_dhaka" && (
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className={`text-[11px] mt-1 ${deliveryZone === "outside_dhaka" ? "text-neutral-300" : "text-neutral-500"}`}>
                        All 64 Districts (৳350)
                      </span>
                    </button>
                  </div>
                </div>

                {/* District & Thana Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      District *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                    >
                      {ALL_DISTRICT_NAMES.map((d) => (
                        <option key={d} value={d}>
                          {d} ({BANGLADESH_DISTRICTS[d]?.zone === "inside_dhaka" ? "Inside Dhaka" : BANGLADESH_DISTRICTS[d]?.zone === "sub_dhaka" ? "Sub-Dhaka" : "Outside Dhaka"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Thana / Upazila / Area *
                    </label>
                    <select
                      value={thana}
                      onChange={(e) => setThana(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                    >
                      {availableThanas.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Full Street Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" /> Street / House / Road Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House / Flat No., Road No., Area, Landmark (e.g. House 24, Road 7, Sector 3, Uttara)"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white"
                  />
                </div>

                {/* Furniture Logistics Specifics: Elevator & Floor */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                  <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <Building className="size-4 text-emerald-600" />
                    Building &amp; Delivery Logistics (For Furniture Transport):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Elevator Availability */}
                    <div>
                      <label className="block text-neutral-600 mb-1 font-semibold">Elevator / Lift Available?</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setHasElevator("yes")}
                          className={`py-2 px-3 rounded-lg border font-bold transition text-center ${
                            hasElevator === "yes"
                              ? "bg-white border-black text-black shadow-2xs"
                              : "border-neutral-200 text-neutral-600 bg-neutral-100"
                          }`}
                        >
                          ✓ Yes, Has Lift
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasElevator("no")}
                          className={`py-2 px-3 rounded-lg border font-bold transition text-center ${
                            hasElevator === "no"
                              ? "bg-white border-black text-black shadow-2xs"
                              : "border-neutral-200 text-neutral-600 bg-neutral-100"
                          }`}
                        >
                          ✕ Stairs Only
                        </button>
                      </div>
                    </div>

                    {/* Floor Number */}
                    <div>
                      <label className="block text-neutral-600 mb-1 font-semibold">Delivery Floor Number</label>
                      <select
                        value={floorNumber}
                        onChange={(e) => setFloorNumber(e.target.value)}
                        className="w-full py-2 px-3 rounded-lg border border-neutral-200 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="Ground Floor">Ground Floor</option>
                        <option value="1st Floor">1st Floor</option>
                        <option value="2nd Floor">2nd Floor</option>
                        <option value="3rd Floor">3rd Floor</option>
                        <option value="4th Floor">4th Floor</option>
                        <option value="5th Floor+">5th Floor or Higher</option>
                      </select>
                    </div>
                  </div>

                  {/* Multi-line Delivery Instructions Note (FIXED: was text input previously) */}
                  <div className="pt-2">
                    <label className="block text-neutral-700 font-bold mb-1">
                      Custom Delivery Instructions / Notes:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Please call before arrival. Deliver preferably on Friday or after 4 PM. Assemble directly in master bedroom."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    />
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Our factory delivery team will review these instructions before dispatch.
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method Card */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-heading font-black text-neutral-900">
                      Payment Method
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Choose between secure Cash on Delivery or instant online gateway
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* COD Option */}
                  <label
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      paymentMethod === "cod"
                        ? "border-black bg-neutral-50/70 shadow-xs"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-900">Cash on Delivery</div>
                          <div className="text-xs text-neutral-500">Pay upon physical inspection</div>
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
                    <div className="text-[11px] text-neutral-600 bg-white p-2 rounded-lg border border-neutral-100">
                      ✓ Pay cash directly to delivery personnel after unboxing and inspection.
                    </div>
                  </label>

                  {/* SSLCommerz Online Option */}
                  <label
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      paymentMethod === "sslcommerz"
                        ? "border-black bg-neutral-50/70 shadow-xs"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-900">Online Payment</div>
                          <div className="text-xs text-neutral-500">bKash, Nagad, Visa, Mastercard</div>
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
                    <div className="text-[11px] text-neutral-600 bg-white p-2 rounded-lg border border-neutral-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Instant SSLCommerz secure checkout gateway.
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ═══ RIGHT 5 COLUMNS: Sticky Order Summary ═══ */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="text-base sm:text-lg font-heading font-black text-neutral-900">
                    Order Summary
                  </h3>
                  <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-full font-mono">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </span>
                </div>

                {/* Items List with Direct Steppers */}
                <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1 divide-y divide-neutral-100">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative shrink-0">
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
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {item.product.title}
                        </h4>
                        <span className="text-[11px] text-neutral-400 block">
                          Tk {item.product.priceNumber.toLocaleString("en-BD")} each
                        </span>

                        {/* Interactive Quantity Adjuster on Checkout */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="inline-flex items-center border border-neutral-200 rounded-md overflow-hidden bg-neutral-50 text-xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-1.5 py-0.5 hover:bg-neutral-200 transition text-neutral-600"
                              title="Decrease"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="px-2 font-bold text-[11px] text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-1.5 py-0.5 hover:bg-neutral-200 transition text-neutral-600"
                              title="Increase"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-red-500 transition p-1"
                            title="Remove item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm font-bold text-neutral-900 text-right font-mono">
                        Tk {(item.product.priceNumber * item.quantity).toLocaleString("en-BD")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-neutral-900 font-mono">
                      Tk {subtotal.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600 items-center">
                    <span className="flex items-center gap-1.5">
                      <Truck className="size-3.5 text-neutral-400" /> Delivery Charge ({deliveryZone === "inside_dhaka" ? "Dhaka" : deliveryZone === "sub_dhaka" ? "Suburbs" : "Outside Dhaka"}):
                    </span>
                    {isFreeDelivery ? (
                      <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        FREE
                      </span>
                    ) : (
                      <span className="font-bold text-neutral-900 font-mono">
                        Tk {deliveryCharge.toLocaleString("en-BD")}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                    <span className="text-sm sm:text-base font-heading font-black text-neutral-900">
                      Total Payable
                    </span>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-heading font-black text-neutral-900 tracking-tight font-mono">
                        Tk {totalAmount.toLocaleString("en-BD")}
                      </span>
                      <span className="block text-[10px] text-neutral-400">
                        Includes all taxes, packing &amp; delivery
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirm Order Button */}
                <button
                  type="submit"
                  form="checkout-main-form"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-neutral-900 hover:bg-black text-white text-sm font-black rounded-full transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Processing Order...
                    </>
                  ) : paymentMethod === "sslcommerz" ? (
                    <>
                      Pay Tk {totalAmount.toLocaleString("en-BD")} via SSLCommerz <ChevronRight className="size-4" />
                    </>
                  ) : (
                    <>
                      Confirm Cash on Delivery Order • Tk {totalAmount.toLocaleString("en-BD")} <CheckCircle2 className="size-4 text-emerald-400" />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                    <span>100% Quality Guaranteed CNC Laser Cutting &amp; Metal Finish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-neutral-600 shrink-0" />
                    <span>Nationwide Safe Delivery with Unboxing Inspection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="size-4 text-amber-500 shrink-0" />
                    <span>Free Assembly Assistance Inside Dhaka</span>
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
