"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Tag,
  Space,
  Typography,
  Popconfirm,
  message,
  Image as AntImage,
  Tooltip,
} from "antd";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  ICategoryItem,
} from "@/redux/service/categoryApi";
import { useGetProductsQuery } from "@/redux/service/productApi";
import { useUploadFileMutation } from "@/redux/service/uploadApi";
import {
  FolderPlus,
  Layers,
  Plus,
  X,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Edit3,
  Package,
  Link as LinkIcon,
  Check,
} from "lucide-react";

const { Text } = Typography;

// Common furniture category presets for rapid 1-click filling
const CATEGORY_PRESETS = [
  { name: "Ergonomic Chairs", slug: "ergonomic-chairs" },
  { name: "Executive Desks", slug: "executive-desks" },
  { name: "Living Room Sofas", slug: "living-room-sofas" },
  { name: "Conference Tables", slug: "conference-tables" },
  { name: "Custom CNC Panels", slug: "custom-cnc-panels" },
  { name: "Storage & Shelves", slug: "storage-shelves" },
  { name: "Dining Sets", slug: "dining-sets" },
  { name: "Coffee Tables", slug: "coffee-tables" },
];

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategoryItem | null>(null);

  // Filter & Search states
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");

  // Form & Image states
  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [activeImageTab, setActiveImageTab] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgressStatus, setUploadProgressStatus] = useState<string>("");

  // Action loading states
  const [togglingCategoryId, setTogglingCategoryId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form] = Form.useForm();

  // RTK Queries
  const { data: categoriesData, isLoading, refetch } = useGetCategoriesQuery({ all: true });
  const { data: productsData } = useGetProductsQuery({ limit: 500 });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [uploadFile, { isLoading: isUploadingMedia }] = useUploadFileMutation();

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

  // Helper to slugify string
  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle Category Name Change & Auto-Slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCategoryName(val);
    form.setFieldsValue({ name: val });
    if (!isSlugManuallyEdited) {
      const generated = generateSlug(val);
      setSlug(generated);
      form.setFieldsValue({ slug: generated });
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIsSlugManuallyEdited(true);
    setSlug(val);
    form.setFieldsValue({ slug: val });
  };

  // Apply a preset
  const handleApplyPreset = (preset: { name: string; slug: string }) => {
    setCategoryName(preset.name);
    setSlug(preset.slug);
    setIsSlugManuallyEdited(false);
    form.setFieldsValue({ name: preset.name, slug: preset.slug });
  };

  // Open modal for Create or Edit
  const handleOpenModal = (cat?: ICategoryItem) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryName(cat.name);
      setSlug(cat.slug);
      setIsSlugManuallyEdited(true);
      setDescription(cat.description || "");
      setIsActive(cat.isActive ?? true);
      setImagePreview(cat.image || "");
      setImageUrlInput(cat.image || "");
      setImageFile(null);
      setActiveImageTab(cat.image?.startsWith("http") ? "url" : "upload");
      form.setFieldsValue({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        isActive: cat.isActive ?? true,
      });
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setSlug("");
      setIsSlugManuallyEdited(false);
      setDescription("");
      setIsActive(true);
      setImagePreview("");
      setImageUrlInput("");
      setImageFile(null);
      setActiveImageTab("upload");
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    }
    setUploadProgressStatus("");
    setIsModalOpen(true);
  };

  // Handle file select with client-side preview
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Only image files are allowed (JPG, PNG, WEBP, SVG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image file size must be less than 5MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // Save Category (Create or Update)
  const handleSaveCategory = async () => {
    try {
      const values = await form.validateFields();
      let finalImageUrl = imagePreview;

      // If a new local image file was dropped/selected, upload it to Cloudinary
      if (imageFile) {
        setUploadProgressStatus("Uploading category image to Cloudinary...");
        const formData = new FormData();
        formData.append("files", imageFile);

        const uploadRes = await uploadFile(formData).unwrap();
        if (uploadRes.success && uploadRes.data) {
          const uploadedUrl = Array.isArray(uploadRes.data)
            ? uploadRes.data[0]?.url
            : (uploadRes.data as any)?.url;
          if (uploadedUrl) {
            finalImageUrl = uploadedUrl;
          } else {
            throw new Error("No URL returned from upload server");
          }
        }
      } else if (activeImageTab === "url" && imageUrlInput.trim()) {
        finalImageUrl = imageUrlInput.trim();
      }

      setUploadProgressStatus("Saving category details...");

      const payload: Partial<ICategoryItem> = {
        name: values.name.trim(),
        slug: (values.slug || generateSlug(values.name)).trim(),
        description: values.description?.trim() || undefined,
        image: finalImageUrl || undefined,
        isActive: values.isActive ?? true,
      };

      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, body: payload }).unwrap();
        message.success("Category updated successfully!");
      } else {
        await createCategory(payload).unwrap();
        message.success("Category created successfully!");
      }

      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      if (err?.errorFields) return; // Antd validation error
      message.error(err?.data?.message || err?.message || "Failed to save category");
    } finally {
      setUploadProgressStatus("");
    }
  };

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
            <span className="font-bold text-slate-900 text-sm">{name}</span>
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
            <Button
              type="text"
              icon={<Edit3 className="size-4 text-slate-600 hover:text-slate-900" />}
              disabled={deletingCategoryId === record._id}
              onClick={() => handleOpenModal(record)}
            />
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
        <Button
          type="primary"
          icon={<Plus className="size-4 inline-block mr-1" />}
          size="large"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs"
          onClick={() => handleOpenModal()}
        >
          Add New Category
        </Button>
      </div>

      {/* Stats Cards (Inspired by e-commerce reference) */}
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

      {/* Enhanced Create / Edit Modal with Drag-and-Drop & Live Preview */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FolderPlus className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Furniture Category"}
              </h3>
              <p className="text-[11px] text-slate-500 font-normal">
                {editingCategory
                  ? "Update category details, banner image, and storefront visibility."
                  : "Add a category to showcase collections on your public storefront."}
              </p>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setUploadProgressStatus("");
        }}
        onOk={handleSaveCategory}
        confirmLoading={isCreating || isUpdating || isUploadingMedia}
        okText={
          isUploadingMedia || uploadProgressStatus
            ? "Uploading..."
            : isCreating || isUpdating
            ? "Saving..."
            : editingCategory
            ? "Update Category"
            : "Create Category"
        }
        okButtonProps={{
          className: "bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-5",
          disabled: isCreating || isUpdating || isUploadingMedia,
        }}
        cancelButtonProps={{
          className: "rounded-xl font-semibold",
          disabled: isCreating || isUpdating || isUploadingMedia,
        }}
        width="min(95vw, 680px)"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="space-y-4 pt-3">
          {/* Preset Chips (Only shown when adding new) */}
          {!editingCategory && (
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" />
                Quick Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_PRESETS.map((preset) => (
                  <button
                    key={preset.slug}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-700 transition shadow-xs"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name & Auto-Generated Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Form.Item
              name="name"
              label={<span className="text-xs font-bold text-slate-700">Category Name *</span>}
              rules={[{ required: true, message: "Please enter category name" }]}
              className="mb-0"
            >
              <Input
                placeholder="e.g. Ergonomic Office Chairs"
                value={categoryName}
                onChange={handleNameChange}
                className="rounded-xl py-2"
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label={
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-700">URL Slug *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Auto-syncs with name</span>
                </div>
              }
              rules={[{ required: true, message: "Please provide a valid slug" }]}
              className="mb-0"
            >
              <Input
                prefix={<span className="text-slate-400 font-mono text-xs">/</span>}
                placeholder="e.g. ergonomic-chairs"
                value={slug}
                onChange={handleSlugChange}
                className="rounded-xl py-2 font-mono text-xs"
              />
            </Form.Item>
          </div>

          {/* Description */}
          <Form.Item
            name="description"
            label={<span className="text-xs font-bold text-slate-700">Description (Optional)</span>}
            className="mb-0"
          >
            <Input.TextArea
              rows={2}
              placeholder="e.g. Premium breathable mesh ergonomic chairs engineered for lumbar comfort and 8+ hour posture support."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl text-xs"
            />
          </Form.Item>

          {/* Category Banner Image Section with Drag-and-Drop and Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="size-4 text-emerald-600" />
                Category Banner Image <span className="text-slate-400 font-normal">(recommended 800x600)</span>
              </label>

              {/* Upload vs URL Tabs */}
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveImageTab("upload")}
                  className={`px-2.5 py-0.5 rounded-md font-semibold transition ${
                    activeImageTab === "upload" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageTab("url")}
                  className={`px-2.5 py-0.5 rounded-md font-semibold transition ${
                    activeImageTab === "url" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                  }`}
                >
                  Direct URL
                </button>
              </div>
            </div>

            {/* TAB 1: Drag & Drop Zone */}
            {activeImageTab === "upload" ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 p-5 ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50/70 scale-[0.99]"
                    : imagePreview
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-slate-200 bg-slate-50/60 hover:border-emerald-400 hover:bg-emerald-50/30"
                }`}
              >
                {imagePreview ? (
                  <div className="flex items-center gap-4 w-full">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="size-20 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                        <span className="truncate">{imageFile ? imageFile.name : "Category image selected"}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {imageFile
                          ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload`
                          : "Existing image from category"}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview("");
                          setImageUrlInput("");
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 mt-1.5"
                      >
                        <X className="size-3" /> Remove / Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="size-11 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                      <Upload className="size-5 text-slate-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-800">
                        Drag and drop image here, or <span className="text-emerald-600 underline">browse</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WEBP, SVG — Max 5MB</p>
                    </div>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            ) : (
              /* TAB 2: Direct URL Input */
              <div className="space-y-2">
                <Input
                  prefix={<LinkIcon className="size-3.5 text-slate-400" />}
                  placeholder="Paste direct image link (e.g. https://images.unsplash.com/...)"
                  value={imageUrlInput}
                  onChange={(e) => {
                    const url = e.target.value;
                    setImageUrlInput(url);
                    setImagePreview(url);
                    setImageFile(null);
                  }}
                  className="rounded-xl py-2 text-xs"
                  allowClear
                />
                {imageUrlInput && (
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={imageUrlInput}
                      alt="URL Preview"
                      className="size-14 rounded-lg object-cover border border-slate-200"
                      onError={() => {
                        message.warning("Unable to load preview from this URL. Please verify the link.");
                      }}
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-bold text-slate-700 block truncate">Direct URL Selected</span>
                      <span className="text-slate-400 text-[11px] truncate block">{imageUrlInput}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cloudinary Upload Status Banner */}
          {(isUploadingMedia || uploadProgressStatus) && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 animate-pulse">
              <div className="size-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-900">
                  {uploadProgressStatus || "Uploading image to Cloudinary storage..."}
                </p>
                <p className="text-[10px] text-amber-700">Please wait while the image processes.</p>
              </div>
            </div>
          )}

          {/* Live Storefront Mock Preview Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Storefront Preview Card
            </span>
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex items-center gap-3.5">
              <div className="size-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="size-full object-cover" />
                ) : (
                  <ImageIcon className="size-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 truncate">
                    {categoryName || "Category Name"}
                  </h4>
                  {isActive ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Live
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                  /category/{slug || "category-slug"}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {description || "Explore our handcrafted collection."}
                </p>
              </div>
            </div>
          </div>

          {/* Visibility Status */}
          <Form.Item name="isActive" valuePropName="checked" className="mb-0">
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Show on Storefront</span>
                <span className="text-[11px] text-slate-500">
                  When enabled, customers can browse and filter products under this category.
                </span>
              </div>
              <Switch
                checked={isActive}
                onChange={(checked) => {
                  setIsActive(checked);
                  form.setFieldsValue({ isActive: checked });
                }}
                className={isActive ? "bg-emerald-500" : "bg-slate-300"}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
