// Centralized Delivery Rate Configuration for Unique Engineering & Furniture
// Edit these numbers to change delivery charges across the entire storefront & checkout

export interface DeliveryZoneConfig {
  key: "inside_dhaka" | "sub_dhaka" | "outside_dhaka";
  label: string;
  rate: number;
  subtitle: string;
}

export const DELIVERY_RATES: Record<string, DeliveryZoneConfig> = {
  inside_dhaka: {
    key: "inside_dhaka",
    label: "Inside Dhaka",
    rate: 150, // Change Dhaka delivery charge here (in BDT)
    subtitle: "Tk 150 Delivery",
  },
  sub_dhaka: {
    key: "sub_dhaka",
    label: "Dhaka Suburbs",
    rate: 200, // Change Suburbs delivery charge here (in BDT)
    subtitle: "Gazipur/Savar/N.ganj (Tk 200)",
  },
  outside_dhaka: {
    key: "outside_dhaka",
    label: "Outside Dhaka",
    rate: 350, // Change Outside Dhaka delivery charge here (in BDT)
    subtitle: "All 64 Districts (Tk 350)",
  },
};
