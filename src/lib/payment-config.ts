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
