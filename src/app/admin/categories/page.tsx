"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  Button,
  Input,
  Switch,
  Space,
  Popconfirm,
  message,
  Image as AntImage,
  Tooltip,
} from "antd";
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  ICategoryItem,
} from "@/redux/service/categoryApi";
import { useGetProductsQuery } from "@/redux/service/productApi";
import {
  FolderPlus,
  Layers,
  Plus,
  Trash2,
  Image as ImageIcon,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  Edit3,
  Package,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [togglingCategoryId, setTogglingCategoryId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  // RTK Queries
  const { data: categoriesData, isLoading, refetch } = useGetCategoriesQuery({ all: true });
  const { data: productsData } = useGetProductsQuery({ limit: 500 });
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categoriesList: ICategoryItem[] = categoriesData?.data || [];
  const productsList: any[] = Array.isArray(productsData?.data) ? productsData.data : [];

  // Calculate product count per category
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of productsList) {
      const catId = typeof p.category === "object" && p.category !== null ? (p.category as any)._id : p.category;
      if (catId) {
        map[catId] = (map[catId] || 0) + 1;
      }
    }
    return map;
  }, [productsList]);

  // Toggle Category Active Status directly
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingCategoryId(id);
    try {
      await updateCategory({
        id,
        body: { isActive: !currentStatus },
      }).unwrap();
      message.success(`Category is now ${!currentStatus ? "Active" : "Hidden"}`);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update category status");
    } finally {
      setTogglingCategoryId(null);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    setDeletingCategoryId(id);
    try {
      await deleteCategory(id).unwrap();
      message.success("Category deleted successfully");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete category");
    } finally {
      setDeletingCategoryId(null);
    }
  };

  // Filter categories
  const filteredCategories = categoriesList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchText.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchText.toLowerCase()));

    if (statusFilter === "active") return matchesSearch && c.isActive;
    if (statusFilter === "hidden") return matchesSearch && !c.isActive;
    return matchesSearch;
  });

  // Calculate stats
  const totalCount = categoriesList.length;
  const activeCount = categoriesList.filter((c) => c.isActive).length;
  const hiddenCount = totalCount - activeCount;

  // Table Columns
  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (img: string, record: ICategoryItem) => (
        <div className="relative size-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 shadow-xs">
          {img ? (
            <AntImage
              src={img}
              alt={record.name}
              width={48}
              height={48}
              className="object-cover w-full h-full"
              fallback="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80"
            />
          ) : (
            <ImageIcon className="size-5 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      title: "Category Details",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: ICategoryItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/categories/edit/${record._id}`}
              className="font-bold text-slate-900 hover:text-emerald-600 text-sm transition"
            >
              {name}
            </Link>
            {record.isActive ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Hidden
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="text-slate-400">/category/</span>
            <span className="text-slate-700 font-semibold">{record.slug}</span>
          </div>
          {record.description && (
            <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{record.description}</p>
          )}
        </div>
      ),
    },
    {
      title: "Linked Products",
      key: "productsCount",
      width: 140,
      render: (_: any, record: ICategoryItem) => {
        const count = productCountMap[record._id] || 0;
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Package className="size-3.5 text-slate-400" />
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono">
              {count} {count === 1 ? "product" : "products"}
            </span>
          </div>
        );
      },
    },
    {
      title: "Visibility",
      dataIndex: "isActive",
      key: "isActive",
      width: 130,
      render: (active: boolean, record: ICategoryItem) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Hidden"
          checked={active ?? true}
          loading={togglingCategoryId === record._id}
          onChange={() => handleToggleStatus(record._id, active ?? true)}
          className={active ? "bg-emerald-500" : "bg-slate-300"}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_: any, record: ICategoryItem) => (
        <Space size="small">
          <Tooltip title="Edit Category">
            <Link href={`/admin/categories/edit/${record._id}`}>
              <Button
                type="text"
                icon={<Edit3 className="size-4 text-slate-600 hover:text-slate-900" />}
              />
            </Link>
          </Tooltip>
          <Popconfirm
            title="Delete category"
            description={`Are you sure you want to delete "${record.name}"?`}
            onConfirm={() => handleDeleteCategory(record._id)}
            okText="Yes, delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              loading: deletingCategoryId === record._id,
            }}
          >
            <Tooltip title="Delete Category">
              <Button
                type="text"
                danger
                icon={<Trash2 className="size-4" />}
                loading={deletingCategoryId === record._id}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <FolderPlus className="size-6 text-emerald-600" />
            Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize custom furniture, ergonomic setups, and CNC panels into high-converting collections.
          </p>
        </div>
        <Link href="/admin/categories/create">
          <Button
            type="primary"
            icon={<Plus className="size-4 inline-block mr-1" />}
            size="large"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs"
          >
            Add New Category
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Categories</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="size-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Layers className="size-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Active On Store</span>
            <p className="text-3xl font-black text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="size-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Hidden / Draft</span>
            <p className="text-3xl font-black text-amber-600 mt-1">{hiddenCount}</p>
          </div>
          <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <EyeOff className="size-5" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
          <Input
            placeholder="Search category name, slug or description..."
            prefix={<Search className="size-4 text-slate-400 mr-1" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-xl border-slate-200"
            allowClear
          />

          {/* Status Filter Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                statusFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                statusFilter === "active" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-emerald-700"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("hidden")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                statusFilter === "hidden" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600 hover:text-amber-700"
              }`}
            >
              Hidden ({hiddenCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Showing {filteredCategories.length} of {totalCount} categories</span>
          <Button
            type="text"
            size="small"
            icon={<RefreshCw className="size-3 text-slate-500" />}
            onClick={() => refetch()}
            title="Refresh categories"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <Table
          dataSource={filteredCategories}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          scroll={{ x: 800 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            className: "px-6 py-4 border-t border-slate-100",
          }}
        />
      </div>
    </div>
  );
}
