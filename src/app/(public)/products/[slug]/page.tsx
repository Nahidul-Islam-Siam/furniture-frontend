"use client";

import { useParams } from "next/navigation";
import { ProductDetailsView } from "@/views/product-details";

export default function SingleProductPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  return <ProductDetailsView slug={slug} />;
}

