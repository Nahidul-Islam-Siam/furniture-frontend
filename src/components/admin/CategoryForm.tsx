"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Switch,
  Button,
  Space,
  Row,
  Col,
  message,
  Card,
  Divider,
} from "antd";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  ICategoryItem,
} from "@/redux/service/categoryApi";
import { useUploadFileMutation } from "@/redux/service/uploadApi";
import {
  FolderPlus,
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Sparkles,
  Link as LinkIcon,
  Check,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";

// Quick furniture presets for instant filling
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

interface CategoryFormProps {
  initialCategory?: ICategoryItem;
  isEdit?: boolean;
}

export function CategoryForm({ initialCategory, isEdit = false }: CategoryFormProps) {
  const router = useRouter();
  const [form] = Form.useForm();

  // RTK Mutations
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [uploadFile, { isLoading: isUploadingMedia }] = useUploadFileMutation();

  // Form states
  const [categoryName, setCategoryName] = useState(initialCategory?.name || "");
  const [slug, setSlug] = useState(initialCategory?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEdit);
  const [description, setDescription] = useState(initialCategory?.description || "");
  const [isActive, setIsActive] = useState(initialCategory?.isActive ?? true);

  // Image Upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialCategory?.image || "");
  const [imageUrlInput, setImageUrlInput] = useState<string>(initialCategory?.image || "");
  const [activeImageTab, setActiveImageTab] = useState<"upload" | "url">(
    initialCategory?.image?.startsWith("http") ? "url" : "upload"
  );
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgressStatus, setUploadProgressStatus] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCategory) {
      setCategoryName(initialCategory.name);
      setSlug(initialCategory.slug);
      setDescription(initialCategory.description || "");
      setIsActive(initialCategory.isActive ?? true);
      setImagePreview(initialCategory.image || "");
      setImageUrlInput(initialCategory.image || "");
      form.setFieldsValue({
        name: initialCategory.name,
        slug: initialCategory.slug,
        description: initialCategory.description || "",
        isActive: initialCategory.isActive ?? true,
      });
    }
  }, [initialCategory, form]);

  // Helper to slugify
  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

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

  const handleApplyPreset = (preset: { name: string; slug: string }) => {
    setCategoryName(preset.name);
    setSlug(preset.slug);
    setIsSlugManuallyEdited(false);
    form.setFieldsValue({ name: preset.name, slug: preset.slug });
  };

  // Image drop & select handlers
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
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

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

  // Form Submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let finalImageUrl = imagePreview;

      // Upload image to Cloudinary if new local file was selected
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

      if (isEdit && initialCategory) {
        await updateCategory({ id: initialCategory._id, body: payload }).unwrap();
        message.success("Category updated successfully!");
      } else {
        await createCategory(payload).unwrap();
        message.success("Category created successfully!");
      }

      router.push("/admin/categories");
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error(err?.data?.message || err?.message || "Failed to save category");
    } finally {
      setUploadProgressStatus("");
    }
  };

  const isSaving = isCreating || isUpdating || isUploadingMedia;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="size-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition shadow-xs"
            title="Back to categories"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Link href="/admin/categories" className="hover:underline">Categories</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">
                {isEdit ? "Edit Category" : "Create New"}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-0.5">
              {isEdit ? `Edit "${initialCategory?.name}"` : "Create New Category"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/categories">
            <Button size="large" className="rounded-xl font-bold" disabled={isSaving}>
              Cancel
            </Button>
          </Link>
          <Button
            type="primary"
            icon={<Save className="size-4 inline-block mr-1" />}
            size="large"
            loading={isSaving}
            onClick={handleSubmit}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs px-6"
          >
            {isUploadingMedia || uploadProgressStatus
              ? "Uploading..."
              : isSaving
              ? "Saving..."
              : isEdit
              ? "Save Changes"
              : "Publish Category"}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Form Layout */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: initialCategory?.name || "",
          slug: initialCategory?.slug || "",
          description: initialCategory?.description || "",
          isActive: initialCategory?.isActive ?? true,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: Form Inputs & Image Upload */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FolderPlus className="size-5 text-emerald-600" />
                  General Information
                </h2>
                <span className="text-xs text-slate-400 font-medium">* Required fields</span>
              </div>

              {/* Quick Presets for New Categories */}
              {!isEdit && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-amber-500" />
                    Quick Furniture Presets (1-Click Fill):
                  </span>
                  <div className="flex flex-wrap gap-2">
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

              {/* Category Name */}
              <Form.Item
                name="name"
                label={<span className="text-xs font-bold text-slate-700">Category Name *</span>}
                rules={[{ required: true, message: "Please enter category name" }]}
                className="mb-4"
              >
                <Input
                  placeholder="e.g. Ergonomic Office Chairs"
                  size="large"
                  value={categoryName}
                  onChange={handleNameChange}
                  className="rounded-xl font-medium"
                />
              </Form.Item>

              {/* Slug */}
              <Form.Item
                name="slug"
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-700">URL Slug *</span>
                    <span className="text-xs text-slate-400 font-normal">Auto-syncs with name</span>
                  </div>
                }
                rules={[{ required: true, message: "Please provide a valid slug" }]}
                className="mb-4"
                extra="Public storefront URL will be: /category/[slug]"
              >
                <Input
                  prefix={<span className="text-slate-400 font-mono text-xs">/category/</span>}
                  placeholder="e.g. ergonomic-chairs"
                  size="large"
                  value={slug}
                  onChange={handleSlugChange}
                  className="rounded-xl font-mono text-xs"
                />
              </Form.Item>

              {/* Description */}
              <Form.Item
                name="description"
                label={<span className="text-xs font-bold text-slate-700">Category Description</span>}
                className="mb-0"
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Provide an overview of items in this category (e.g. High-performance ergonomic office chairs with lumbar adjustment and breathable mesh fabric)."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </Form.Item>
            </div>

            {/* Banner Image Uploader Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="size-5 text-emerald-600" />
                    Category Banner & Thumbnail
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Recommended dimensions: 800 x 600px (Max 5MB)
                  </p>
                </div>

                {/* Upload vs URL Tabs */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveImageTab("upload")}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      activeImageTab === "upload"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    File Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageTab("url")}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      activeImageTab === "url"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Direct Image URL
                  </button>
                </div>
              </div>

              {/* File Upload Mode (Drag & Drop) */}
              {activeImageTab === "upload" ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 p-8 ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-50/70 scale-[0.99]"
                      : imagePreview
                      ? "border-emerald-300 bg-emerald-50/30"
                      : "border-slate-200 bg-slate-50/60 hover:border-emerald-400 hover:bg-emerald-50/30"
                  }`}
                >
                  {imagePreview ? (
                    <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                      <img
                        src={imagePreview}
                        alt="Category Preview"
                        className="w-32 h-28 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm font-bold text-emerald-700">
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                          <span className="truncate">
                            {imageFile ? imageFile.name : "Category Banner Selected"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {imageFile
                            ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload to Cloudinary`
                            : "Existing Cloudinary / CDN Image URL"}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview("");
                            setImageUrlInput("");
                          }}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-md bg-red-50 border border-red-100"
                        >
                          <X className="size-3" /> Remove / Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="size-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                        <Upload className="size-6 text-slate-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-800">
                          Click to browse or drag and drop image here
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Supports JPG, PNG, WEBP, SVG up to 5MB
                        </p>
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
                /* Direct URL Input Mode */
                <div className="space-y-3">
                  <Input
                    prefix={<LinkIcon className="size-4 text-slate-400" />}
                    placeholder="Paste direct image link (e.g. https://images.unsplash.com/...)"
                    size="large"
                    value={imageUrlInput}
                    onChange={(e) => {
                      const url = e.target.value;
                      setImageUrlInput(url);
                      setImagePreview(url);
                      setImageFile(null);
                    }}
                    className="rounded-xl text-sm"
                    allowClear
                  />
                  {imageUrlInput && (
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <img
                        src={imageUrlInput}
                        alt="URL Preview"
                        className="size-20 rounded-lg object-cover border border-slate-200 shrink-0"
                        onError={() => {
                          message.warning("Unable to load preview from this URL. Please verify link.");
                        }}
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <span className="font-bold text-slate-800 block text-sm">Direct Image Preview</span>
                        <span className="text-slate-400 truncate block mt-0.5">{imageUrlInput}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Progress Status Banner */}
              {(isUploadingMedia || uploadProgressStatus) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 animate-pulse">
                  <div className="size-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-amber-900">
                      {uploadProgressStatus || "Uploading image to Cloudinary storage..."}
                    </p>
                    <p className="text-[10px] text-amber-700">Please wait while the asset is processed.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Preview, Visibility & Status */}
          <div className="space-y-6">
            {/* Storefront Mock Card Live Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Storefront Live Preview
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  Customer View
                </span>
              </div>

              {/* Realistic Card Preview */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs group">
                <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="size-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="size-8 text-slate-300 mx-auto mb-1" />
                      <span className="text-xs text-slate-400">No Image Selected</span>
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5">
                    {isActive ? (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                        <Eye className="size-3" /> Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1">
                        <EyeOff className="size-3" /> Draft
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {categoryName || "Category Name"}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    /category/{slug || "category-slug"}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {description || "Explore our handcrafted modern furniture collections designed for elegance and durability."}
                  </p>
                </div>
              </div>
            </div>

            {/* Visibility Settings Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Visibility & Status</h3>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Show on Storefront</span>
                  <span className="text-[11px] text-slate-500">
                    When active, buyers can view this category and its products.
                  </span>
                </div>
                <Form.Item name="isActive" valuePropName="checked" className="mb-0">
                  <Switch
                    checked={isActive}
                    onChange={(checked) => {
                      setIsActive(checked);
                      form.setFieldsValue({ isActive: checked });
                    }}
                    className={isActive ? "bg-emerald-500" : "bg-slate-300"}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <Button
                type="primary"
                icon={<Save className="size-4 inline-block mr-1" />}
                size="large"
                block
                loading={isSaving}
                onClick={handleSubmit}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs"
              >
                {isEdit ? "Update Category" : "Publish Category"}
              </Button>
              <Link href="/admin/categories" className="block">
                <Button size="large" block className="rounded-xl font-bold">
                  Discard & Exit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

