// Centralized Payment & Mobile Banking Configuration for Unique Engineering & Furniture
// Edit these phone numbers and instructions anytime to match your official accounts

export const MOBILE_BANKING_CONFIG = {
  bkash: {
    name: "bKash",
    number: "01711-223344", // Change your bKash number here
    type: "Personal / Merchant",
    instructions: "Go to your bKash App or dial *247# -> Send Money / Make Payment -> Enter the number above -> Enter your Order Total -> Enter Reference as your name -> Enter your PIN to confirm.",
    color: "#E2136E",
    bgLight: "bg-pink-50",
    textLight: "text-pink-600",
    borderLight: "border-pink-200",
  },
  nagad: {
    name: "Nagad",
    number: "01811-223344", // Change your Nagad number here
    type: "Personal",
    instructions: "Go to your Nagad App or dial *167# -> Send Money -> Enter the number above -> Enter your Order Total -> Enter Reference -> Enter PIN to confirm.",
    color: "#F7941D",
    bgLight: "bg-orange-50",
    textLight: "text-orange-600",
    borderLight: "border-orange-200",
  },
  rocket: {
    name: "Rocket (DBBL)",
    number: "01911-223344-0", // Change your Rocket number here
    type: "Personal",
    instructions: "Go to Rocket App or dial *322# -> Send Money -> Enter the 12-digit mobile account number above -> Enter Amount -> Enter PIN to confirm.",
    color: "#8C3494",
    bgLight: "bg-purple-50",
    textLight: "text-purple-600",
    borderLight: "border-purple-200",
  },
};

export const BANK_TRANSFER_CONFIG = {
  bankName: "Dutch-Bangla Bank PLC",
  bankingType: "Agent Banking",
  accountName: "UNIQUE ENGINEERING & FURNITURE",
  accountNumber: "1937100864589",
  branch: "Progoti Saroni Branch",
  routingNumber: "90270608",
  currency: "BDT (৳)",
  channels: [
    "Any Bank Internet Banking / Mobile App (NPSB Instant / BEFTN)",
    "DBBL NexusPay / Rocket App Direct Transfer",
    "Any Dutch-Bangla Bank Branch / Agent Banking Outlet Deposit Counter",
  ],
  instructions:
    "আপনার যেকোনো ব্যাংক অ্যাকাউন্ট, মোবাইল ব্যাংকিং অ্যাপ বা সরাসরি DBBL এজেন্ট ব্যাংকিং আউটলেট থেকে উপরের ব্যাংক অ্যাকাউন্টে ফুল পেমেন্ট অথবা বুকিং অ্যাডভান্স ট্রান্সফার করুন। এরপর নিচে প্রেরক একাউন্টের নাম এবং TrxID / ডিপোজিট স্লিপ নম্বর প্রদান করুন।",
};

