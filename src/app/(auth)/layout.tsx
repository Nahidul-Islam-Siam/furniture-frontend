import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Account | Unique Engineering & Furniture",
    template: "%s | Unique Engineering & Furniture",
  },
};

/**
 * Auth layout — clean, full-screen, no Navbar or Footer.
 * Login and Signup pages render directly inside this.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

