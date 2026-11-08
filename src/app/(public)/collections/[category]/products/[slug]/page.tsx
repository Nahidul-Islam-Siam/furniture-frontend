"use client";

import { useParams } from "next/navigation";
import { ProductDetailsView } from "@/views/product-details";

export default function CategorySingleProductPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const category = (params?.category as string) || "";

  return <ProductDetailsView slug={slug} category={category} />;
}

