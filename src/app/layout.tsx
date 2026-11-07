import type { Metadata } from "next";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
  ),
  title: {
    default: "React SaaS Platform | Modern Business Suite",
    template: "%s | React SaaS",
  },
  description:
    "Enterprise-ready SaaS application with advanced user management, billing, analytics, and responsive dashboards.",
  keywords: ["SaaS", "Dashboard", "Admin Portal", "Analytics", "React", "Next.js"],
  authors: [{ name: "SaaS Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    title: "React SaaS Platform | Modern Business Suite",
    description:
      "Enterprise-ready SaaS application with advanced user management, billing, and analytics.",
    siteName: "React SaaS",
  },
  twitter: {
    card: "summary_large_image",
    title: "React SaaS Platform",
    description:
      "Enterprise-ready SaaS application with advanced user management, billing, and analytics.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
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
    "@type": "SoftwareApplication",
    name: "React SaaS Platform",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
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
