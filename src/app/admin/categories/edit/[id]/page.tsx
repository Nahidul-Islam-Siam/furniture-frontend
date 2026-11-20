"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Spin, Button } from "antd";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { useGetCategoryByIdQuery } from "@/redux/service/categoryApi";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function EditCategoryPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const { data: categoryData, isLoading, error } = useGetCategoryByIdQuery(id || "", {
    skip: !id,
  });

  const category = categoryData?.data;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Spin size="large" />
        <p className="text-xs text-slate-500 font-medium">Loading category details...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="size-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
          <AlertCircle className="size-7" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Category Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            The category you are looking for may have been deleted or the ID is invalid.
          </p>
        </div>
        <Link href="/admin/categories">
          <Button
            type="primary"
            icon={<ArrowLeft className="size-4 inline-block mr-1" />}
            className="rounded-xl font-bold bg-slate-900"
          >
            Back to Categories
          </Button>
        </Link>
      </div>
    );
  }

  return <CategoryForm initialCategory={category} isEdit={true} />;
}

