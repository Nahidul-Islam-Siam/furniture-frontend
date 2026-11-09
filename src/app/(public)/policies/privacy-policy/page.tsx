"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getStoreContent, DEFAULT_STORE_CONTENT } from "@/lib/storeContent";
import { PolicyContentRenderer } from "@/components/ui/PolicyContentRenderer";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<string>(DEFAULT_STORE_CONTENT.privacyText);

  useEffect(() => {
    setContent(getStoreContent<string>("privacyText"));

    const handleUpdate = () => {
      setContent(getStoreContent<string>("privacyText"));
    };
    window.addEventListener("grid_content_updated", handleUpdate);
    return () => window.removeEventListener("grid_content_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-white min-h-screen py-12 sm:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-medium">Privacy Policy</span>
        </div>

        <div className="border-b border-neutral-100 pb-8 mb-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            Last Updated: November 2026 • Published via GRID Store Administration
          </p>
        </div>

        <PolicyContentRenderer content={content} />
      </div>
    </div>
  );
}
