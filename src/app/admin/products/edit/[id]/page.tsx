"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ProductForm } from "@/components/admin/ProductForm";
import { useGetProductByIdQuery } from "@/redux/service/productApi";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.id as string) || "";

  const { data, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  const product = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spin size="large" />
        <p className="text-xs text-slate-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Could not locate the product with ID #{productId}. It may have been removed or deleted.
        </p>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/admin/products")}
          className="rounded-xl bg-slate-900 border-none"
        >
          Return to Products
        </Button>
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEdit={true} />;
}

