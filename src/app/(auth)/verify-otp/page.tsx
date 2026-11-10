"use client";

import { Suspense } from "react";
import VerifyOtp from "@/views/verify-otp";

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtp />
    </Suspense>
  );
}

