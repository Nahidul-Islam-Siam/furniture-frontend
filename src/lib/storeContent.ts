"use client";

// Default content for legal pages and store settings
export const DEFAULT_STORE_CONTENT = {
  aboutText: `## Welcome to Unique Engineering & Furniture
Unique Engineering & Furniture (UEF) is a premier precision metal engineering and modern furniture manufacturing factory in Bangladesh.

Specializing in advanced **CNC Laser Cutting**, high-grade steel fabrication, industrial gaming desks, executive workstations, and customized interior metalwork, we build directly in our own dedicated factory to ensure unmatched durability and direct factory pricing.

### Why Bangladesh Chooses Unique Engineering & Furniture
- **Direct Factory Manufacturing:** Handcrafted and precision laser-cut in our own factory with zero middleman markups.
- **Advanced CNC Precision:** High-grade MS and SS sheet laser cutting with millimeter-level accuracy and clean aesthetic welds.
- **Custom Sizing & Bespoke Builds:** Built to your room measurements, drawings, and custom color specifications.
- **Nationwide Doorstep Delivery:** Safe delivery across all 64 districts in Bangladesh with secure packaging.
- **Structural Warranty:** Long-term warranty backing with direct manufacturer servicing and support.`,

  privacyText: `## Privacy & Data Protection Policy
At **Unique Engineering & Furniture** (UEF), we prioritize customer trust and data security. This privacy policy explains how we handle your information when visiting our website, ordering custom furniture, or requesting factory quotations.

### 1. Information We Collect
- **Personal Details:** Full name, delivery address, phone number, and email.
- **Transaction Details:** Order specifications, invoices, payment reference details, and delivery instructions.
- **Custom Drawings & Specifications:** CAD files, sketches, and room dimensions provided for custom fabrication.

### 2. How Your Information Is Used
- Processing and manufacturing your custom furniture orders.
- Coordinating safe doorstep delivery across Bangladesh.
- Providing warranty certification, receipts, and customer support.

### 3. Payment Security & Integrity
All online transactions are processed through bank-grade secured payment gateways with full SSL encryption. We never store debit/credit card credentials or mobile banking PINs.

> **Our Promise:** We respect your privacy and never sell or share your personal data with third-party marketing companies.`,

  termsText: `## Terms of Service & Sales Agreement
Welcome to Unique Engineering & Furniture. By purchasing from our catalog or commissioning custom fabrication, you agree to the following terms:

### 1. Custom Sizing & Fabrication
Custom CNC laser-cut items are manufactured specifically to client drawings and dimensions. Customers are requested to review final measurements prior to cutting commencement.

### 2. Delivery & Logistics
- **Inside Dhaka:** Delivered safely within 24 to 72 hours.
- **Across Bangladesh:** Shipped via insured freight logistics across all 64 districts within 3 to 6 business days.

### 3. Quality Guarantee & Order Modifications
Order modifications or cancellations for custom fabrication can be requested within **24 hours** of order placement before laser cutting begins.`,

  warrantyText: `## Quality Guarantee & Warranty Policy
Every product from Unique Engineering & Furniture is engineered for exceptional durability and heavy-duty load performance.

### Warranty Coverage:
- **Structural Steel Frames:** 5-Year structural frame warranty against welding fractures and metal fatigue.
- **Motorized & Ergonomic Desks:** Full warranty on elevating drive systems and controllers.
- **Powder Coating & Finish:** Industrial-grade electrostatic powder coating resistant to corrosion and chipping.

### Replacement Guarantee
In the rare event of transit damage or manufacturing defect, our support team will inspect and replace the affected component or entire unit promptly.`,

  storeInfo: {
    storeName: "Unique Engineering & Furniture",
    hotline: "+880 1755-348053",
    whatsapp: "+880 1755-348053",
    email: "info@uniqueengineeringbd.com",
    address: "Dhaka, Bangladesh",
    showroom: "Unique Engineering & Furniture Factory & Display Center",
    workingHours: "Saturday - Thursday: 9:00 AM - 9:00 PM",
  },

  adminProfile: {
    fullName: "Siam Admin",
    email: "admin@furniture.com",
    phone: "+880 1700-009947",
    avatar: "",
    designation: "Principal Store Administrator",
  },
};

const STORAGE_PREFIX = "grid_store_";

export function getStoreContent<T>(key: keyof typeof DEFAULT_STORE_CONTENT): T {
  if (typeof window === "undefined") {
    return DEFAULT_STORE_CONTENT[key] as T;
  }
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (saved) {
      return JSON.parse(saved) as T;
    }
  } catch {
    // Fall back to default
  }
  return DEFAULT_STORE_CONTENT[key] as T;
}

export function saveStoreContent(key: keyof typeof DEFAULT_STORE_CONTENT, value: any): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    // Dispatch a storage event so all tabs/pages update immediately
    window.dispatchEvent(new Event("grid_content_updated"));
  } catch (err) {
    console.error("Failed to save store content:", err);
  }
}

