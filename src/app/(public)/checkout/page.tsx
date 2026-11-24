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
  Smartphone,
  Copy,
  Landmark,
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
import { DELIVERY_RATES } from "@/lib/delivery-config";
import { MOBILE_BANKING_CONFIG, BANK_TRANSFER_CONFIG } from "@/lib/payment-config";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    selectedCart,
    subtotal,
    freeDeliveryThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
    clearSelectedItems,
    toggleItemSelection,
    selectAllItems,
  } = useCart();
  const { user } = useAppSelector((state) => state.auth);

  // Active items participating in this checkout session
  const checkoutItems = useMemo(() => {
    return selectedCart.length > 0 ? selectedCart : cart;
  }, [selectedCart, cart]);

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
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "sslcommerz" | "bank_transfer" | "manual_bkash" | "manual_nagad" | "manual_rocket"
  >("bank_transfer");
  const [manualProvider, setManualProvider] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [manualSenderPhone, setManualSenderPhone] = useState("");
  const [manualTrxId, setManualTrxId] = useState("");
  const [bankSenderName, setBankSenderName] = useState("");
  const [bankTrxId, setBankTrxId] = useState("");
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [isAdvancePayment, setIsAdvancePayment] = useState(false);
  const [advanceAmountInput, setAdvanceAmountInput] = useState<number>(1000);
  const [copiedNumber, setCopiedNumber] = useState(false);

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

  // ── Delivery Charge Engine (Product-Specific with Zone Fallbacks) ──
  const isAllFreeDelivery =
    checkoutItems.length > 0 &&
    checkoutItems.every((item) => Boolean((item.product as any).isFreeDelivery));
  const isFreeDelivery = isAllFreeDelivery;

  const insideDhakaRate = isAllFreeDelivery
    ? 0
    : Math.max(
        ...checkoutItems.map((item) => {
          const p = item.product as any;
          if (p.isFreeDelivery) return 0;
          return p.deliveryInsideDhaka ?? DELIVERY_RATES.inside_dhaka.rate;
        })
      );

  const subDhakaRate = isAllFreeDelivery
    ? 0
    : Math.max(
        ...checkoutItems.map((item) => {
          const p = item.product as any;
          if (p.isFreeDelivery) return 0;
          return p.deliverySuburbs ?? p.deliveryInsideDhaka ?? DELIVERY_RATES.sub_dhaka.rate;
        })
      );

  const outsideDhakaRate = isAllFreeDelivery
    ? 0
    : Math.max(
        ...checkoutItems.map((item) => {
          const p = item.product as any;
          if (p.isFreeDelivery) return 0;
          return p.deliveryOutsideDhaka ?? DELIVERY_RATES.outside_dhaka.rate;
        })
      );

  let deliveryCharge = 0;
  if (!isAllFreeDelivery && checkoutItems.length > 0) {
    if (deliveryZone === "inside_dhaka") {
      deliveryCharge = insideDhakaRate;
    } else if (deliveryZone === "sub_dhaka") {
      deliveryCharge = subDhakaRate;
    } else {
      deliveryCharge = outsideDhakaRate;
    }
  }

  const activeSubtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.priceNumber * item.quantity,
    0
  );
  const totalAmount = activeSubtotal + deliveryCharge;

  // Order Submission Handler
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checkoutItems.length === 0) {
      toast.error("No items selected for checkout. Please select items from your cart.");
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

    if (paymentMethod === "bank_transfer") {
      if (!bankSenderName.trim()) {
        toast.error("Please enter your Depositor / Sender Account Name and Bank");
        return;
      }
      if (!bankTrxId.trim() || bankTrxId.trim().length < 4) {
        toast.error("Please enter the Bank Transaction ID (TrxID) or Deposit Voucher No.");
        return;
      }
    }

    if (paymentMethod.startsWith("manual_")) {
      const cleanSender = manualSenderPhone.trim().replace(/\D/g, "");
      if (!cleanSender || cleanSender.length < 10) {
        toast.error("Please enter your sender mobile banking phone number");
        return;
      }
      if (!manualTrxId.trim() || manualTrxId.trim().length < 4) {
        toast.error("Please enter the Transaction ID (TrxID) from your payment confirmation SMS or app");
        return;
      }
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
        items: checkoutItems.map((item) => {
          const rawId = item.product.id || "";
          const cleanId =
            rawId.includes("-") && rawId.split("-")[0].length === 24
              ? rawId.split("-")[0]
              : rawId;
          return {
            product: cleanId,
            name: item.product.title,
            price: item.product.priceNumber,
            quantity: item.quantity,
            image: item.product.images?.[0] || "",
          };
        }),
        shippingAddress: {
          recipientName: name.trim(),
          phone: cleanPhone,
          street: `${streetAddress.trim()}, ${thana}`,
          city: district,
          postalCode: postalCode.trim() || "1200",
          country: "Bangladesh",
        },
        paymentMethod: paymentMethod,
        transactionId:
          paymentMethod === "bank_transfer"
            ? bankTrxId.trim()
            : paymentMethod.startsWith("manual_")
            ? manualTrxId.trim()
            : undefined,
        senderNumber:
          paymentMethod === "bank_transfer"
            ? bankSenderName.trim()
            : paymentMethod.startsWith("manual_")
            ? manualSenderPhone.trim()
            : undefined,
        advanceAmount:
          (paymentMethod.startsWith("manual_") || paymentMethod === "bank_transfer") && isAdvancePayment
            ? advanceAmountInput
            : paymentMethod.startsWith("manual_") || paymentMethod === "bank_transfer"
            ? totalAmount
            : 0,
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
              clearSelectedItems();
              window.location.href = sslRes.data.gatewayUrl;
              return;
            }
          } catch (sslErr: any) {
            toast.error(
              sslErr?.data?.message || "Payment gateway offline. Saved as Cash on Delivery."
            );
          }
        }

        clearSelectedItems();
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
                        <span className="font-bold text-xs">{DELIVERY_RATES.inside_dhaka.label}</span>
                        {deliveryZone === "inside_dhaka" && (
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className={`text-[11px] mt-1 ${deliveryZone === "inside_dhaka" ? "text-neutral-300" : "text-neutral-500"}`}>
                        {isFreeDelivery ? "FREE Delivery" : `৳${insideDhakaRate} Delivery`}
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
                        <span className="font-bold text-xs">{DELIVERY_RATES.sub_dhaka.label}</span>
                        {deliveryZone === "sub_dhaka" && (
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className={`text-[11px] mt-1 ${deliveryZone === "sub_dhaka" ? "text-neutral-300" : "text-neutral-500"}`}>
                        {isFreeDelivery ? "FREE Delivery" : `Gazipur/Savar/N.ganj (৳${subDhakaRate})`}
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
                        <span className="font-bold text-xs">{DELIVERY_RATES.outside_dhaka.label}</span>
                        {deliveryZone === "outside_dhaka" && (
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className={`text-[11px] mt-1 ${deliveryZone === "outside_dhaka" ? "text-neutral-300" : "text-neutral-500"}`}>
                        {isFreeDelivery ? "FREE Delivery" : `All 64 Districts (৳${outsideDhakaRate})`}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Option 1: COD (Blurred / Unavailable) */}
                  <div
                    className="relative p-4 rounded-2xl border border-neutral-200/80 bg-neutral-100/70 select-none cursor-not-allowed opacity-50 overflow-hidden flex flex-col justify-between gap-3"
                    title="Cash on Delivery is currently paused for custom furniture production"
                  >
                    <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-neutral-200 text-neutral-600 border border-neutral-300">
                      Paused
                    </div>
                    <div className="flex items-start justify-between filter blur-[0.8px] pointer-events-none">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-neutral-200 text-neutral-500">
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-700">Cash on Delivery (COD)</div>
                          <div className="text-[10px] text-neutral-400">
                            হাতে পেয়ে মূল্য পরিশোধ
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        disabled
                        checked={false}
                        className="mt-1 w-4 h-4 text-neutral-300 cursor-not-allowed"
                      />
                    </div>
                    <div className="text-[11px] p-2 rounded-lg border border-neutral-200 bg-white/60 text-neutral-500 leading-tight filter blur-[0.8px] pointer-events-none">
                      Pay 100% cash upon unboxing &amp; physical inspection.
                    </div>
                  </div>

                  {/* Option 2: Direct Bank Transfer (Dutch-Bangla Bank) - ACTIVE & RECOMMENDED */}
                  <label
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ring-2 ring-amber-400/50 shadow-md ${
                      paymentMethod === "bank_transfer"
                        ? "border-amber-400 bg-neutral-900 text-white"
                        : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800"
                    }`}
                  >
                    <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 shadow-sm flex items-center gap-1">
                      <Sparkles className="size-2.5 fill-current" /> Recommended
                    </div>

                    <div className="flex items-start justify-between pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          paymentMethod === "bank_transfer" ? "bg-amber-400/20 text-amber-300 border border-amber-400/40" : "bg-amber-100 text-amber-800"
                        }`}>
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            Bank Transfer
                          </div>
                          <div className={`text-[10px] ${paymentMethod === "bank_transfer" ? "text-amber-200/90" : "text-neutral-500"}`}>
                            Dutch-Bangla Bank
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={() => setPaymentMethod("bank_transfer")}
                        className="mt-1 w-4 h-4 text-amber-500 focus:ring-amber-400"
                      />
                    </div>
                    <div className={`text-[10px] p-2 rounded-lg border leading-tight flex items-center gap-1 ${
                      paymentMethod === "bank_transfer"
                        ? "bg-neutral-800/90 border-amber-400/30 text-amber-100/90"
                        : "bg-neutral-50 border-neutral-100 text-neutral-600"
                    }`}>
                      <Sparkles className="size-3 text-amber-400 shrink-0" />
                      Recommended for High-Value Furniture • 0% Extra Fee
                    </div>
                  </label>

                  {/* Option 3: Manual Mobile Banking (Blurred / Unavailable) */}
                  <div
                    className="relative p-4 rounded-2xl border border-neutral-200/80 bg-neutral-100/70 select-none cursor-not-allowed opacity-50 overflow-hidden flex flex-col justify-between gap-3"
                    title="Mobile banking merchant channels under upgrade"
                  >
                    <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-neutral-200 text-neutral-600 border border-neutral-300">
                      Paused
                    </div>
                    <div className="flex items-start justify-between filter blur-[0.8px] pointer-events-none">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-neutral-200 text-neutral-500">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-700">bKash / Nagad / Rocket</div>
                          <div className="text-[10px] text-neutral-400">
                            মোবাইল ব্যাংকিং
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        disabled
                        checked={false}
                        className="mt-1 w-4 h-4 text-neutral-300 cursor-not-allowed"
                      />
                    </div>
                    <div className="text-[11px] p-2 rounded-lg border border-neutral-200 bg-white/60 text-neutral-500 leading-tight filter blur-[0.8px] pointer-events-none">
                      Send Money + TrxID (আপগ্রেড চলছে).
                    </div>
                  </div>

                  {/* Option 4: SSLCommerz Gateway (Blurred / Unavailable) */}
                  <div
                    className="relative p-4 rounded-2xl border border-neutral-200/80 bg-neutral-100/70 select-none cursor-not-allowed opacity-50 overflow-hidden flex flex-col justify-between gap-3"
                    title="Online payment gateway currently in maintenance"
                  >
                    <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-neutral-200 text-neutral-600 border border-neutral-300">
                      Paused
                    </div>
                    <div className="flex items-start justify-between filter blur-[0.8px] pointer-events-none">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-neutral-200 text-neutral-500">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-700">Online Gateway</div>
                          <div className="text-[10px] text-neutral-400">
                            কার্ড ও ইনস্ট্যান্ট SSLCommerz
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        disabled
                        checked={false}
                        className="mt-1 w-4 h-4 text-neutral-300 cursor-not-allowed"
                      />
                    </div>
                    <div className="text-[11px] p-2 rounded-lg border border-neutral-200 bg-white/60 text-neutral-500 leading-tight filter blur-[0.8px] pointer-events-none">
                      কার্ড ও গেটওয়ে ইন্টিগ্রেশন আপডেট হচ্ছে।
                    </div>
                  </div>
                </div>

                {/* ═══ EXPANDED DIRECT BANK TRANSFER CARD (DUTCH-BANGLA AGENT BANKING) ═══ */}
                {paymentMethod === "bank_transfer" && (
                  <div className="mt-4 p-5 sm:p-6 rounded-2xl border-2 border-neutral-900 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white shadow-xl space-y-5 animate-in fade-in-50 duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                          <Landmark className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                            {BANK_TRANSFER_CONFIG.bankName}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase">
                              {BANK_TRANSFER_CONFIG.bankingType}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400">
                            Official Corporate Beneficiary Account • 0% Extra Charge
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        <Sparkles className="size-3.5" />
                        <span>Recommended for High-Value Furniture</span>
                      </div>
                    </div>

                    {/* Bank Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Account Name */}
                      <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Account Name (Beneficiary)
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                            {BANK_TRANSFER_CONFIG.accountName}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(BANK_TRANSFER_CONFIG.accountName);
                            setCopiedBankField("name");
                            toast.success("Account Name copied!");
                            setTimeout(() => setCopiedBankField(null), 2500);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 transition shrink-0 text-xs flex items-center gap-1"
                          title="Copy Account Name"
                        >
                          {copiedBankField === "name" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                          <span className="text-[10px]">{copiedBankField === "name" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {/* Account Number (Highlight) */}
                      <div className="p-3.5 rounded-xl bg-neutral-800/80 border-2 border-amber-400/50 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                            Account Number
                          </div>
                          <div className="text-base sm:text-lg font-mono font-black text-amber-300 tracking-wider mt-0.5">
                            {BANK_TRANSFER_CONFIG.accountNumber}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(BANK_TRANSFER_CONFIG.accountNumber);
                            setCopiedBankField("number");
                            toast.success("Account Number copied!");
                            setTimeout(() => setCopiedBankField(null), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold transition shrink-0 text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                          title="Copy Account Number"
                        >
                          {copiedBankField === "number" ? <Check className="size-3.5 text-emerald-950" /> : <Copy className="size-3.5" />}
                          <span>{copiedBankField === "number" ? "Copied!" : "Copy No"}</span>
                        </button>
                      </div>

                      {/* Branch Name */}
                      <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Branch
                          </div>
                          <div className="text-xs font-semibold text-neutral-200 mt-0.5">
                            {BANK_TRANSFER_CONFIG.branch}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(BANK_TRANSFER_CONFIG.branch);
                            setCopiedBankField("branch");
                            toast.success("Branch copied!");
                            setTimeout(() => setCopiedBankField(null), 2500);
                          }}
                          className="px-2 py-1 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 transition shrink-0 text-xs flex items-center gap-1"
                          title="Copy Branch"
                        >
                          {copiedBankField === "branch" ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                          <span className="text-[10px]">{copiedBankField === "branch" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {/* Routing Number */}
                      <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Routing Number
                          </div>
                          <div className="text-xs font-mono font-bold text-neutral-200 mt-0.5">
                            {BANK_TRANSFER_CONFIG.routingNumber}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(BANK_TRANSFER_CONFIG.routingNumber);
                            setCopiedBankField("routing");
                            toast.success("Routing Number copied!");
                            setTimeout(() => setCopiedBankField(null), 2500);
                          }}
                          className="px-2 py-1 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 transition shrink-0 text-xs flex items-center gap-1"
                          title="Copy Routing Number"
                        >
                          {copiedBankField === "routing" ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                          <span className="text-[10px]">{copiedBankField === "routing" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Supported Channels */}
                    <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
                      <div className="font-bold text-neutral-300 flex items-center gap-1.5">
                        <Check className="size-3.5 text-emerald-400" /> কীভাবে টাকা পাঠাতে পারেন (Supported Channels):
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {BANK_TRANSFER_CONFIG.channels.map((ch, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] border border-neutral-700/60">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Advance Booking vs Full Payment Toggle */}
                    <div className="space-y-2 p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/70">
                      <div className="text-xs font-bold text-neutral-200">Payment Option:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <label className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                          !isAdvancePayment ? "border-amber-400 bg-neutral-900 text-amber-300 font-bold" : "border-neutral-700 bg-neutral-800/60 text-neutral-400"
                        }`}>
                          <span>Pay Full Amount (৳{totalAmount.toLocaleString("en-BD")})</span>
                          <input
                            type="radio"
                            name="bankAdvanceChoice"
                            checked={!isAdvancePayment}
                            onChange={() => setIsAdvancePayment(false)}
                            className="sr-only"
                          />
                        </label>
                        <label className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                          isAdvancePayment ? "border-amber-400 bg-neutral-900 text-amber-300 font-bold" : "border-neutral-700 bg-neutral-800/60 text-neutral-400"
                        }`}>
                          <span>Pay Advance Booking (৳{advanceAmountInput}) + COD Rest</span>
                          <input
                            type="radio"
                            name="bankAdvanceChoice"
                            checked={isAdvancePayment}
                            onChange={() => setIsAdvancePayment(true)}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      {isAdvancePayment && (
                        <div className="pt-2 flex items-center gap-2 text-xs">
                          <span className="text-neutral-400">Advance Amount:</span>
                          <input
                            type="number"
                            min={100}
                            max={totalAmount}
                            value={advanceAmountInput}
                            onChange={(e) => setAdvanceAmountInput(Math.max(100, Number(e.target.value) || 0))}
                            className="w-28 px-2 py-1 text-xs border border-neutral-700 bg-neutral-900 text-white rounded-lg font-mono font-bold focus:border-amber-400 outline-none"
                          />
                          <span className="text-neutral-400 text-[11px]">
                            (Remaining ৳{(totalAmount - advanceAmountInput).toLocaleString("en-BD")} on COD delivery)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Sender Details Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                          Your Depositor / Sender Account &amp; Bank Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Md. Hasan (Dutch-Bangla Bank or DBBL App)"
                          value={bankSenderName}
                          onChange={(e) => setBankSenderName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                          Transaction ID (TrxID) / Deposit Voucher No. *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. TXN987654321 or Slip #882"
                          value={bankTrxId}
                          onChange={(e) => setBankTrxId(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-900 text-white placeholder-neutral-500 font-mono tracking-wider focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-400 flex items-start gap-2 bg-neutral-800/40 p-3 rounded-xl border border-neutral-800">
                      <ShieldCheck className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        আপনার ব্যাংক ট্রান্সফার বা ডিপোজিট রসিদের TrxID প্রদান করুন। আমাদের অ্যাকাউন্টস টিম ডাচ্-বাংলা ব্যাংকের সাথে ভেরিফাই করে দ্রুত ফার্নিচার তৈরির কাজ শুরু করবে।
                      </span>
                    </div>
                  </div>
                )}

                {/* ═══ EXPANDED MOBILE BANKING DETAILS FORM ═══ */}
                {paymentMethod.startsWith("manual_") && (
                  <div className="mt-4 p-4 sm:p-5 rounded-2xl border-2 border-neutral-900 bg-neutral-50/70 space-y-4 animate-in fade-in-50 duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                        <Smartphone className="size-3.5 text-pink-600" /> Select Mobile Banking Wallet:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(["bkash", "nagad", "rocket"] as const).map((prov) => (
                          <button
                            key={prov}
                            type="button"
                            onClick={() => {
                              setManualProvider(prov);
                              setPaymentMethod(`manual_${prov}` as any);
                            }}
                            className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                              manualProvider === prov
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                            }`}
                          >
                            {prov === "bkash" ? "bKash" : prov === "nagad" ? "Nagad" : "Rocket"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Official Account Number Card with Copy */}
                    <div className="p-3.5 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-medium text-neutral-500">
                          Official {MOBILE_BANKING_CONFIG[manualProvider].name} ({MOBILE_BANKING_CONFIG[manualProvider].type}) Account:
                        </div>
                        <div className="text-base sm:text-lg font-mono font-black text-neutral-900 tracking-wider mt-0.5">
                          {MOBILE_BANKING_CONFIG[manualProvider].number}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(MOBILE_BANKING_CONFIG[manualProvider].number);
                          setCopiedNumber(true);
                          toast.success(`${MOBILE_BANKING_CONFIG[manualProvider].name} number copied!`);
                          setTimeout(() => setCopiedNumber(false), 2500);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition active:scale-95 shrink-0"
                      >
                        {copiedNumber ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        {copiedNumber ? "Copied!" : "Copy Number"}
                      </button>
                    </div>

                    {/* Advance Booking vs Full Payment Toggle */}
                    <div className="space-y-2 p-3 rounded-xl bg-white border border-neutral-200">
                      <div className="text-xs font-bold text-neutral-800">Payment Option:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <label className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                          !isAdvancePayment ? "border-black bg-neutral-900 text-white font-bold" : "border-neutral-200 bg-neutral-50"
                        }`}>
                          <span>Pay Full Amount (Tk {totalAmount.toLocaleString("en-BD")})</span>
                          <input
                            type="radio"
                            name="advanceChoice"
                            checked={!isAdvancePayment}
                            onChange={() => setIsAdvancePayment(false)}
                            className="sr-only"
                          />
                        </label>
                        <label className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                          isAdvancePayment ? "border-black bg-neutral-900 text-white font-bold" : "border-neutral-200 bg-neutral-50"
                        }`}>
                          <span>Pay Advance Booking (৳{advanceAmountInput}) + COD Rest</span>
                          <input
                            type="radio"
                            name="advanceChoice"
                            checked={isAdvancePayment}
                            onChange={() => setIsAdvancePayment(true)}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      {isAdvancePayment && (
                        <div className="pt-2 flex items-center gap-2 text-xs">
                          <span className="text-neutral-600">Advance Amount:</span>
                          <input
                            type="number"
                            min={100}
                            max={totalAmount}
                            value={advanceAmountInput}
                            onChange={(e) => setAdvanceAmountInput(Math.max(100, Number(e.target.value) || 0))}
                            className="w-28 px-2 py-1 text-xs border rounded-lg font-mono font-bold"
                          />
                          <span className="text-neutral-500 text-[11px]">
                            (Remaining ৳{(totalAmount - advanceAmountInput).toLocaleString("en-BD")} on COD delivery)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Sender Details Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                          Your Sender Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 01XXXXXXXXX"
                          value={manualSenderPhone}
                          onChange={(e) => setManualSenderPhone(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black bg-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                          Transaction ID (TrxID) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9J8A7D6F or SMS reference"
                          value={manualTrxId}
                          onChange={(e) => setManualTrxId(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black bg-white font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                    {checkoutItems.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </span>
                </div>

                {/* Items List with Direct Steppers */}
                <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1 divide-y divide-neutral-100">
                  {checkoutItems.map((item) => (
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
                      Tk {activeSubtotal.toLocaleString("en-BD")}
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

                  {paymentMethod.startsWith("manual_") && isAdvancePayment && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold text-amber-900">
                        <span>Advance Paid (TrxID):</span>
                        <span className="font-mono">Tk {advanceAmountInput.toLocaleString("en-BD")}</span>
                      </div>
                      <div className="flex justify-between font-bold text-neutral-800">
                        <span>Remaining Due on Delivery:</span>
                        <span className="font-mono text-emerald-700">Tk {Math.max(0, totalAmount - advanceAmountInput).toLocaleString("en-BD")}</span>
                      </div>
                    </div>
                  )}
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
                  ) : paymentMethod.startsWith("manual_") ? (
                    <>
                      Confirm Order with TrxID • Tk {(isAdvancePayment ? advanceAmountInput : totalAmount).toLocaleString("en-BD")}{" "}
                      <Check className="size-4 text-pink-400" />
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
