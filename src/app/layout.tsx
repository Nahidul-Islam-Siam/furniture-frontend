import type { Metadata } from "next";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://uniqueengineeringbd.com"
  ),
  title: {
    default: "Unique Engineering & Furniture | CNC Laser Cutting & Custom Furniture",
    template: "%s | Unique Engineering & Furniture",
  },
  description:
    "Precision CNC laser cutting and custom metal furniture manufactured in our own factory with 100% quality guarantee. Gaming desks, metal racks, and nationwide delivery in Bangladesh.",
  keywords: [
    "Unique Engineering & Furniture",
    "UEF",
    "CNC Laser Cutting",
    "Gaming Desk Bangladesh",
    "Custom Metal Furniture",
    "Industrial Furniture Dhaka",
    "Metal Racks Bangladesh"
  ],
  authors: [{ name: "Unique Engineering & Furniture" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://uniqueengineeringbd.com",
    title: "Unique Engineering & Furniture | CNC Laser Cutting & Custom Furniture",
    description:
      "Precision CNC laser cutting and custom metal furniture manufactured in our own factory with 100% quality guarantee.",
    siteName: "Unique Engineering & Furniture",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "Unique Engineering & Furniture Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unique Engineering & Furniture",
    description:
      "Precision CNC laser cutting and custom metal furniture manufactured in our own factory with 100% quality guarantee.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/uef-emblem.png",
    apple: "/images/uef-emblem.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: "Unique Engineering & Furniture",
    telephone: "+8801755348053",
    url: "https://www.facebook.com/uniqueengineeringfurniture",
    sameAs: ["https://www.facebook.com/uniqueengineeringfurniture"],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <ReduxProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}
