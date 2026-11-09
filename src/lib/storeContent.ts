"use client";

// Default content for legal pages and store settings
export const DEFAULT_STORE_CONTENT = {
  aboutText: `## Welcome to GRID Furniture
GRID is a modern work lifestyle brand committed to reimagining ergonomics, craftsmanship, and aesthetic balance for forward-thinking workspaces in Bangladesh.

In direct collaboration with global pioneers like **Steelcase**, we engineer and distribute high-performance ergonomic seating, motorized sit-to-stand elevating desks, modular executive workstations, and contract-grade acoustic solutions.

### Why Bangladesh Chooses GRID
- **100% Authentic Imports:** Directly sourced and certified from precision manufacturers in Taiwan, China, and Vietnam.
- **Contract-Grade Build:** Tested for 50,000+ lifecycle movements and high-load workplace stability.
- **White Glove Delivery:** Free doorstep assembly by certified product technicians anywhere in Dhaka.
- **Up to 5 Years Warranty:** Full local warranty backing with dedicated replacement part inventory.`,

  privacyText: `## Privacy & Data Protection Policy
At **GRID Furniture** (GRID Ventures Ltd.), we hold customer trust and privacy to the highest global standards. This privacy charter explains how we handle your information when visiting our store, placing furniture orders, or utilizing our workspace design tools.

### 1. Information We Collect
- **Personal Identifiers:** Full Name, delivery address, contact phone number, and email.
- **Transaction Details:** Order line items, payment reference numbers, billing address, and VAT registration.
- **Workspace Dimensions:** Room measurements and configuration files submitted through Grid Studio.

### 2. How Your Information Is Used
- Coordinating White-Glove delivery and on-site furniture assembly.
- Generating formal VAT-compliant invoices and 5-Year warranty certificates.
- Providing post-purchase maintenance updates and ergonomic adjustments.

### 3. Payment Security & Encryption
All online transactions are encrypted via **SSLCommerz** under bank-grade 256-bit SSL protocols. We never store credit/debit card numbers or mobile wallet PINs on our servers.

> **Our Pledge:** We never sell, lease, or distribute customer details to third-party marketing companies.`,

  termsText: `## Terms of Service & Sales Agreement
Welcome to GRID. By viewing our catalog, purchasing furniture, or booking consultation sessions, you agree to the following terms and commercial guidelines:

### 1. Product Authenticity & Manufacturing
All products advertised on this platform are brand new, original, and contract-grade. Minor natural variations in solid wood grain, marble patterns, or leather textures are hallmarks of authentic materials and not manufacturing defects.

### 2. Delivery & On-Site Assembly
- **Dhaka Metro:** Delivery is completed within 24 to 48 hours with complimentary on-site assembly.
- **Outside Dhaka:** Delivered via insured logistics within 3 to 5 business days.

### 3. Order Cancellation & Modifications
Custom-fabricated executive desks and bespoke color orders may be modified or cancelled within **24 hours** of order placement before factory processing begins.`,

  warrantyText: `## 5-Year Warranty & Return Guarantee
Every GRID product is engineered for longevity and back-health excellence. We provide comprehensive local warranty support across Bangladesh.

### Warranty Coverage Windows:
- **Motorized Elevating Desks:** 5-Year warranty on dual motor systems, digital handset controllers, and heavy-duty steel columns.
- **Ergonomic Chairs (Steelcase Series):** 5-Year warranty on pneumatic gas cylinders, synchronous tilt mechanisms, and multi-directional 4D armrests.
- **GRID Task Chairs & Sofas:** 3-Year warranty on structural frame, swivel base, and high-resilience foam integrity.

### 7-Day Replacement Guarantee
If an item arrives with transit damage or factory imperfections, our Dhaka team will inspect and replace the affected component or entire unit within **7 days of delivery**.`,

  storeInfo: {
    storeName: "GRID Furniture Bangladesh",
    hotline: "+880 1700-009947",
    whatsapp: "+880 1700-009947",
    email: "support@99grid.com",
    address: "Plot 42, Road 11, Block D, Banani, Dhaka 1213",
    showroom: "GRID Experience Center, Level 4, Banani, Dhaka",
    workingHours: "Saturday - Thursday: 10:00 AM - 8:30 PM",
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

