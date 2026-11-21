"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Tag,
  Button,
  Space,
  Row,
  Col,
  Image,
  Upload,
  Divider,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  LoadingOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  DollarOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  CompassOutlined,
  CarOutlined,
  BgColorsOutlined,
  ColumnWidthOutlined,
  SlidersOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  IProductItem,
} from "@/redux/service/productApi";
import { useGetCategoriesQuery } from "@/redux/service/categoryApi";
import { useAppSelector } from "@/redux";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";

const { Option } = Select;
const { Title, Text } = Typography;

export interface ColorVariant {
  name: string;
  hex: string;
  imageIndex?: number;
}

export const getColorHex = (name: string): string => {
  const lower = name.toLowerCase().trim();
  if (lower.includes("black") || lower.includes("dark") || lower.includes("কালো")) return "#171717";
  if (lower.includes("walnut") || lower.includes("brown") || lower.includes("বাদামী")) return "#5c3a21";
  if (lower.includes("oak") || lower.includes("wood")) return "#c8ad7f";
  if (lower.includes("oat") || lower.includes("beige") || lower.includes("অফ হোয়াইট")) return "#d4b996";
  if (lower.includes("grey") || lower.includes("gray") || lower.includes("graphite")) return "#374151";
  if (lower.includes("white") || lower.includes("সাদা")) return "#f9fafb";
  if (lower.includes("navy") || lower.includes("blue") || lower.includes("নীল")) return "#1e3a8a";
  if (lower.includes("green") || lower.includes("emerald") || lower.includes("সবুজ")) return "#064e3b";
  if (lower.includes("gold") || lower.includes("brass") || lower.includes("সোনালী")) return "#d97706";
  return "#475569";
};

const POPULAR_FURNITURE_COLORS = [
  { name: "Matte Black", hex: "#171717" },
  { name: "Solid Walnut", hex: "#5c3a21" },
  { name: "Natural Oak", hex: "#c8ad7f" },
  { name: "Warm Oat", hex: "#d4b996" },
  { name: "Charcoal Grey", hex: "#374151" },
  { name: "Cream Off-White", hex: "#f5f2eb" },
  { name: "Deep Navy", hex: "#1e3a8a" },
  { name: "Forest Green", hex: "#064e3b" },
  { name: "Brushed Brass", hex: "#d97706" },
];

const FURNITURE_SIZE_PRESETS = [
  "Standard",
  "Single (3' x 7')",
  "Queen (5' x 7')",
  "King (6' x 7')",
  "1-Seater",
  "2-Seater",
  "3-Seater",
  "L-Shape",
  "Compact",
];

const SPEC_SUGGESTIONS = [
  "Primary Material",
  "Wood / Frame Construction",
  "Fabric / Foam Grade",
  "Finish & Coating",
  "Weight Capacity",
  "Warranty Period",
  "Assembly & Installation",
  "Country of Origin",
];

interface ProductFormProps {
  initialProduct?: IProductItem;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  isEdit = false,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [imageUrls, setImageUrls] = useState<string[]>(initialProduct?.images || []);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Structured Color Variants State
  const [colorsList, setColorsList] = useState<ColorVariant[]>([]);
  const [newColorHex, setNewColorHex] = useState("#171717");
  const [newColorName, setNewColorName] = useState("");
  const [newColorImageIdx, setNewColorImageIdx] = useState<number | "none">("none");

  // 2. Sizes & Variants State
  const [sizesList, setSizesList] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState("");

  // 3. Technical Specifications Key-Value State
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const categoriesList = categoriesData?.data || [];

  // Populate form with existing data when in edit mode
  useEffect(() => {
    if (initialProduct) {
      setImageUrls(initialProduct.images || []);
      const categoryId =
        typeof initialProduct.category === "object"
          ? initialProduct.category._id
          : initialProduct.category;

      // Parse Colors
      const parsedColors: ColorVariant[] = [];
      if (Array.isArray(initialProduct.colors)) {
        initialProduct.colors.forEach((cStr: string) => {
          if (cStr.includes(":")) {
            const parts = cStr.split(":");
            parsedColors.push({
              name: parts[0]?.trim() || cStr,
              hex: parts[1]?.trim() || getColorHex(parts[0]?.trim() || ""),
              imageIndex:
                parts[2] !== undefined && !isNaN(parseInt(parts[2], 10))
                  ? parseInt(parts[2], 10)
                  : undefined,
            });
          } else if (cStr.startsWith("#")) {
            parsedColors.push({ name: cStr, hex: cStr });
          } else if (cStr.trim()) {
            parsedColors.push({ name: cStr.trim(), hex: getColorHex(cStr.trim()) });
          }
        });
      }
      setColorsList(parsedColors);
      setSizesList(Array.isArray(initialProduct.sizes) ? initialProduct.sizes : []);

      // Parse Specifications
      if (initialProduct.specifications) {
        try {
          const obj =
            typeof initialProduct.specifications === "string"
              ? JSON.parse(initialProduct.specifications)
              : initialProduct.specifications;
          setSpecs(
            Object.entries(obj).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          );
        } catch {
          setSpecs([]);
        }
      } else {
        setSpecs([]);
      }

      form.setFieldsValue({
        name: initialProduct.name,
        slug: initialProduct.slug || "",
        shortDesc: initialProduct.shortDesc || "",
        category: categoryId,
        price: initialProduct.price,
        discountPrice: initialProduct.discountPrice,
        stock: initialProduct.stock ?? 50,
        sku: initialProduct.sku || "",
        material: initialProduct.material || "",
        brand: initialProduct.brand || "Unique Engineering & Furniture",
        warranty: initialProduct.warranty || "",
        video: initialProduct.video || "",
        dimensionWidth: initialProduct.dimensions?.width,
        dimensionHeight: initialProduct.dimensions?.height,
        dimensionDepth: initialProduct.dimensions?.depth,
        dimensionUnit: initialProduct.dimensions?.unit || "inch",
        weight: initialProduct.weight,
        description: initialProduct.description || "",
        isAvailable: initialProduct.isAvailable ?? true,
        isFeatured: initialProduct.isFeatured ?? false,
        isFreeDelivery: initialProduct.isFreeDelivery ?? false,
        deliveryInsideDhaka: initialProduct.deliveryInsideDhaka,
        deliverySuburbs: initialProduct.deliverySuburbs,
        deliveryOutsideDhaka: initialProduct.deliveryOutsideDhaka,
      });
    } else {
      setImageUrls([]);
      setColorsList([]);
      setSizesList(["Standard"]);
      setSpecs([
        { key: "Primary Material", value: "Cold-rolled Steel & Solid Hardwood" },
        { key: "Finish", value: "Electrostatic Powder Coating (Matte)" },
        { key: "Warranty", value: "5 Years Structural Guarantee" },
      ]);
      form.resetFields();
      form.setFieldsValue({
        isAvailable: true,
        isFeatured: false,
        isFreeDelivery: false,
        stock: 50,
        dimensionUnit: "inch",
        brand: "Unique Engineering & Furniture",
        warranty: "5 Years Structural Guarantee",
      });
    }
  }, [initialProduct, form]);

  // Color Handlers
  const handleAddColor = () => {
    const trimmed = newColorName.trim();
    if (!trimmed) {
      message.warning("Please enter a color name");
      return;
    }
    if (colorsList.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      message.warning(`Color "${trimmed}" is already added`);
      return;
    }
    setColorsList((prev) => [
      ...prev,
      {
        name: trimmed,
        hex: newColorHex || getColorHex(trimmed),
        imageIndex: newColorImageIdx !== "none" ? Number(newColorImageIdx) : undefined,
      },
    ]);
    setNewColorName("");
    setNewColorImageIdx("none");
    message.success(`Added color: ${trimmed}`);
  };

  const handleRemoveColor = (indexToRemove: number) => {
    setColorsList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Size Handlers
  const handleAddSize = (sizeToAdd?: string) => {
    const size = (sizeToAdd || customSizeInput).trim();
    if (!size) return;
    if (sizesList.some((s) => s.toLowerCase() === size.toLowerCase())) {
      message.warning(`Size "${size}" is already added`);
      return;
    }
    setSizesList((prev) => [...prev, size]);
    if (!sizeToAdd) setCustomSizeInput("");
  };

  const handleRemoveSize = (indexToRemove: number) => {
    setSizesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Specs Handlers
  const handleAddSpecRow = (defaultKey: string = "") => {
    setSpecs((prev) => [...prev, { key: defaultKey, value: "" }]);
  };

  const handleUpdateSpec = (idx: number, field: "key" | "value", val: string) => {
    setSpecs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveSpecRow = (idxToRemove: number) => {
    setSpecs((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Upload image to Cloudinary
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    message.loading({ content: "Uploading product photo...", key: "upload_key" });

    try {
      const uploadResult = await uploadImageToCloudinary(file, accessToken || undefined);
      if (uploadResult.url) {
        setImageUrls((prev) => [...prev, uploadResult.url]);
        message.success({ content: "Image uploaded successfully!", key: "upload_key" });
        return false;
      }
      throw new Error("No URL returned");
    } catch (err: any) {
      message.error({ content: err?.message || "Failed to upload image.", key: "upload_key" });
    } finally {
      setIsUploading(false);
    }
    return false;
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    message.info("Image removed from gallery");
  };

  const handleAddDirectUrl = (url: string) => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      message.warning("Image URL must start with http:// or https://");
      return;
    }
    setImageUrls((prev) => [...prev, cleanUrl]);
    form.setFieldsValue({ directImageUrl: "" });
    message.success("Image added to gallery!");
  };

  const handleSaveProduct = async (values: any) => {
    try {
      let finalImages = [...imageUrls];
      if (finalImages.length === 0) {
        finalImages = ["https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385"];
      }

      const hasDimensions =
        values.dimensionWidth || values.dimensionHeight || values.dimensionDepth;

      // Format structured colors as Name:Hex:ImageIndex
      const colorsArr = colorsList.map((c) => {
        if (c.imageIndex !== undefined && c.imageIndex >= 0) {
          return `${c.name}:${c.hex}:${c.imageIndex}`;
        }
        return `${c.name}:${c.hex}`;
      });

      // Format specs as key-value map
      const specsObj: Record<string, string> = {};
      specs.forEach((s) => {
        if (s.key.trim() && s.value.trim()) {
          specsObj[s.key.trim()] = s.value.trim();
        }
      });

      const payload: Partial<IProductItem> = {
        name: values.name.trim(),
        slug: values.slug
          ? values.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : values.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        shortDesc: values.shortDesc ? values.shortDesc.trim() : undefined,
        category: values.category,
        price: Number(values.price),
        discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
        stock: Number(values.stock || 0),
        sku: values.sku || undefined,
        material: values.material || undefined,
        brand: values.brand ? values.brand.trim() : "Unique Engineering & Furniture",
        warranty: values.warranty || undefined,
        video: values.video || undefined,
        colors: colorsArr.length > 0 ? colorsArr : undefined,
        sizes: sizesList.length > 0 ? sizesList : undefined,
        specifications: Object.keys(specsObj).length > 0 ? specsObj : undefined,
        dimensions: hasDimensions
          ? {
              width: values.dimensionWidth ? Number(values.dimensionWidth) : undefined,
              height: values.dimensionHeight ? Number(values.dimensionHeight) : undefined,
              depth: values.dimensionDepth ? Number(values.dimensionDepth) : undefined,
              unit: values.dimensionUnit || "inch",
            }
          : undefined,
        weight: values.weight ? Number(values.weight) : undefined,
        description: values.description || "Precision CNC laser cutting & custom metal furniture.",
        images: finalImages,
        isAvailable: values.isAvailable ?? true,
        isFeatured: values.isFeatured ?? false,
        isFreeDelivery: values.isFreeDelivery ?? false,
        deliveryInsideDhaka:
          values.deliveryInsideDhaka !== undefined &&
          values.deliveryInsideDhaka !== null &&
          values.deliveryInsideDhaka !== ""
            ? Number(values.deliveryInsideDhaka)
            : undefined,
        deliverySuburbs:
          values.deliverySuburbs !== undefined &&
          values.deliverySuburbs !== null &&
          values.deliverySuburbs !== ""
            ? Number(values.deliverySuburbs)
            : undefined,
        deliveryOutsideDhaka:
          values.deliveryOutsideDhaka !== undefined &&
          values.deliveryOutsideDhaka !== null &&
          values.deliveryOutsideDhaka !== ""
            ? Number(values.deliveryOutsideDhaka)
            : undefined,
      };

      if (isEdit && initialProduct) {
        await updateProduct({ id: initialProduct._id, body: payload }).unwrap();
        message.success("Product updated successfully!");
      } else {
        await createProduct(payload).unwrap();
        message.success("New product published successfully!");
      }

      router.push("/admin/products");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save product. Please check required fields.");
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-sm"
          >
            <ArrowLeftOutlined className="text-sm" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link href="/admin/products" className="hover:text-slate-700">
                Products
              </Link>
              <span>/</span>
              <span>{isEdit ? "Edit Product" : "New Product"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isEdit ? `Edit: ${initialProduct?.name || "Product"}` : "Create New Furniture Product"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => router.push("/admin/products")}
            className="flex-1 sm:flex-initial rounded-xl"
            disabled={isSaving}
          >
            Discard
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isSaving}
            icon={<SaveOutlined />}
            className="flex-1 sm:flex-initial rounded-xl bg-slate-950 hover:bg-slate-800 border-none shadow-md h-10 px-6 font-semibold"
          >
            {isEdit ? "Save Changes" : "Publish Product"}
          </Button>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSaveProduct}>
        <Row gutter={[24, 24]}>
          {/* Left Column (8 cols): Primary Details, Media & Specs */}
          <Col xs={24} lg={16} className="space-y-6">
            {/* 1. Basic Information */}
            <Card
              title={
                <span className="font-bold text-slate-900 text-sm">
                  General Information
                </span>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <Form.Item
                name="name"
                label="Product Title"
                rules={[{ required: true, message: "Please enter product title" }]}
              >
                <Input
                  size="large"
                  placeholder="e.g. GRID x Steelcase Gesture Chair"
                  className="rounded-xl font-medium"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="slug"
                    label="Custom SEO URL Slug"
                    tooltip="e.g. gesture-chair (URL will be: /products/gesture-chair)"
                  >
                    <Input placeholder="e.g. gesture-chair" className="rounded-xl" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="material" label="Primary Material & Build Finish">
                    <Input
                      placeholder="e.g. Precision CNC Steel Frame / 3D Knit Mesh"
                      className="rounded-xl"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="shortDesc"
                label="Short Summary (Shown right under Price in store)"
                tooltip="Crisp 1-2 sentence highlight for customer buying decisions"
              >
                <Input.TextArea
                  rows={2}
                  placeholder="e.g. 100% Solid Teak Wood with Electrostatic Matte Finish. Nationwide Cash on Delivery with Unboxing Inspection."
                  className="rounded-xl text-xs"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Product Description & Ergonomics (Rich Text)"
                tooltip="Add detailed specifications, ergonomics, and factory warranty details"
              >
                <RichTextEditor placeholder="Enter full product description, features, warranty, ergonomics..." />
              </Form.Item>
            </Card>

            {/* 2. Product Gallery & Images */}
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <PictureOutlined /> Product Photos & Gallery
                  </span>
                  {imageUrls.length > 0 && (
                    <Tag color="green">{imageUrls.length} image(s)</Tag>
                  )}
                </div>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Upload
                    beforeUpload={handleImageUpload}
                    showUploadList={false}
                    multiple={true}
                    accept="image/*"
                  >
                    <Button
                      icon={isUploading ? <LoadingOutlined /> : <UploadOutlined />}
                      disabled={isUploading}
                      className="rounded-xl h-10 px-4 font-medium"
                    >
                      {isUploading ? "Uploading to Cloudinary..." : "Upload from Computer"}
                    </Button>
                  </Upload>

                  <div className="flex-1 min-w-[280px]">
                    <Input.Search
                      placeholder="Or paste image URL (https://...)"
                      enterButton="+ Add URL"
                      onSearch={(val) => handleAddDirectUrl(val)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* Previews Grid */}
                {imageUrls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className={`group relative rounded-xl overflow-hidden border aspect-square bg-slate-50 ${
                          idx === 0 ? "border-amber-500 border-2" : "border-slate-200"
                        }`}
                      >
                        <Image
                          src={url}
                          alt={`Product photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          Photo #{idx + 1}
                        </span>
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-white text-[9px] font-bold text-center uppercase py-0.5 tracking-wider">
                            Cover Image
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow"
                          title="Delete photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
                    No images uploaded yet. Upload at least 1 photo for product listing.
                  </div>
                )}
              </div>
            </Card>

            {/* 3. Structured Color Variants & Image Linking */}
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <BgColorsOutlined className="text-amber-600" /> Color Variants &amp; Photo Switcher
                  </span>
                  <Tag color={colorsList.length > 0 ? "purple" : "default"}>
                    {colorsList.length} color(s) configured
                  </Tag>
                </div>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-4">
                <Text type="secondary" className="text-xs block leading-relaxed">
                  Configure visual color swatches. When customers click a color in your live store, the main product gallery automatically switches to its linked photo.
                </Text>

                {/* Popular Palette Quick Pickers */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
                    Popular Furniture Palettes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_FURNITURE_COLORS.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          setNewColorName(p.name);
                          setNewColorHex(p.hex);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-400 bg-white text-[11px] font-medium text-slate-700 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: p.hex }}
                        />
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Input Controls */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                    <div className="sm:col-span-5">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Color Name *
                      </label>
                      <Input
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        placeholder="e.g. Warm Oat or Solid Walnut"
                        className="rounded-lg"
                        onPressEnter={handleAddColor}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Color Swatch *
                      </label>
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent"
                          title="Choose custom color hex"
                        />
                        <span className="font-mono text-xs text-slate-700 font-bold uppercase">
                          {newColorHex}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Linked Photo
                      </label>
                      <Select
                        value={newColorImageIdx}
                        onChange={(val) => setNewColorImageIdx(val)}
                        className="w-full rounded-lg"
                      >
                        <Option value="none">None</Option>
                        {imageUrls.map((_, idx) => (
                          <Option key={idx} value={idx}>
                            Photo #{idx + 1}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div className="sm:col-span-2">
                      <Button
                        type="primary"
                        onClick={handleAddColor}
                        icon={<PlusOutlined />}
                        className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 font-semibold text-xs h-8"
                      >
                        Add Color
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Added Color Chips */}
                {colorsList.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Active Color Swatches ({colorsList.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {colorsList.map((c, idx) => (
                        <div
                          key={idx}
                          className="pl-2.5 pr-2 py-1.5 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center gap-2 text-xs"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="font-bold text-slate-800">{c.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            ({c.hex})
                          </span>
                          {c.imageIndex !== undefined && c.imageIndex >= 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[9px] border border-blue-200">
                              📷 Photo #{c.imageIndex + 1}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(idx)}
                            className="text-slate-400 hover:text-red-600 ml-1 font-bold text-sm cursor-pointer"
                            title="Remove color"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    No color variants added. Single default color will be used.
                  </div>
                )}
              </div>
            </Card>

            {/* 4. Sizes & Dimension Variations */}
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ColumnWidthOutlined className="text-blue-600" /> Furniture Sizes &amp; Variants
                  </span>
                  <Tag color={sizesList.length > 0 ? "blue" : "default"}>
                    {sizesList.length} size(s)
                  </Tag>
                </div>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-4">
                <Text type="secondary" className="text-xs block leading-relaxed">
                  Add available furniture sizes (e.g. Standard, 3-Seater, Queen Bed). Customers can select their preferred size on the product page.
                </Text>

                {/* Quick Add Presets */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
                    Quick Add Furniture Sizes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FURNITURE_SIZE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddSize(preset)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-400 bg-white text-[11px] font-medium text-slate-700 hover:text-blue-600 transition shadow-xs cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Size Input */}
                <div className="flex items-center gap-2">
                  <Input
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    placeholder="Or type custom size (e.g. 84 x 36 x 32 in or 4-Seater L-Shape)"
                    className="rounded-xl flex-1"
                    onPressEnter={() => handleAddSize()}
                  />
                  <Button
                    onClick={() => handleAddSize()}
                    icon={<PlusOutlined />}
                    className="rounded-xl font-medium"
                  >
                    Add Size
                  </Button>
                </div>

                {/* Added Sizes List */}
                {sizesList.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {sizesList.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(idx)}
                          className="hover:text-red-400 text-stone-400 font-bold text-sm cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    No size options. Default "Standard" size will apply.
                  </div>
                )}
              </div>
            </Card>

            {/* 5. Dimensions & Technical Specifications */}
            <Card
              title={
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CompassOutlined className="text-emerald-600" /> Dimensions &amp; Technical Specifications
                </span>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Exact Physical Dimensions (For room planning &amp; CNC specs):
                  </span>
                  <Row gutter={12}>
                    <Col xs={12} sm={6}>
                      <Form.Item name="dimensionWidth" label="Width">
                        <InputNumber style={{ width: "100%" }} min={0} placeholder="e.g. 24" className="rounded-xl" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item name="dimensionDepth" label="Depth">
                        <InputNumber style={{ width: "100%" }} min={0} placeholder="e.g. 22" className="rounded-xl" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item name="dimensionHeight" label="Height">
                        <InputNumber style={{ width: "100%" }} min={0} placeholder="e.g. 42" className="rounded-xl" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item name="dimensionUnit" label="Unit">
                        <Select defaultValue="inch" className="rounded-xl">
                          <Option value="inch">Inches (in)</Option>
                          <Option value="cm">Centimeters (cm)</Option>
                          <Option value="mm">Millimeters (mm)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="weight"
                    label="Product Weight (kg)"
                    tooltip="Used for courier delivery freight calculations"
                  >
                    <InputNumber style={{ width: "100%" }} min={0} placeholder="e.g. 28" className="rounded-xl" />
                  </Form.Item>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                {/* Key-Value Technical Specifications */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">
                        Detailed Technical Specifications Table:
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Rendered as a sleek two-column table under Specifications tab in live store.
                      </span>
                    </div>
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddSpecRow()}
                      className="rounded-lg font-medium text-xs"
                    >
                      Add Row
                    </Button>
                  </div>

                  {/* Suggestion Pills */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Quick Suggestions (click to add):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {SPEC_SUGGESTIONS.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleAddSpecRow(sug)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold border border-slate-200 transition cursor-pointer"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specs Rows */}
                  {specs.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {specs.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            placeholder="Key (e.g. Wood Type)"
                            value={s.key}
                            onChange={(e) => handleUpdateSpec(idx, "key", e.target.value)}
                            style={{ width: "40%" }}
                            className="rounded-lg text-xs font-semibold"
                          />
                          <Input
                            placeholder="Value (e.g. 100% Solid Teak)"
                            value={s.value}
                            onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                            style={{ width: "55%" }}
                            className="rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecRow(idx)}
                            className="text-slate-400 hover:text-red-600 font-bold text-base px-2 cursor-pointer"
                            title="Remove row"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                      No technical specifications added yet. Click "+ Add Row" or any suggestion above.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column (8 cols on mobile, 4 cols on desktop): Pricing, Status & Organization */}
          <Col xs={24} lg={8} className="space-y-6">
            {/* Status & Visibility */}
            <Card
              title={
                <span className="font-bold text-slate-900 text-sm">
                  Status & Visibility
                </span>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Stock Availability</div>
                    <div className="text-[11px] text-slate-400">Allow customers to purchase</div>
                  </div>
                  <Form.Item name="isAvailable" valuePropName="checked" noStyle>
                    <Switch checkedChildren="In Stock" unCheckedChildren="Out of Stock" />
                  </Form.Item>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Featured Product</div>
                    <div className="text-[11px] text-slate-400">Show on store homepage showcase</div>
                  </div>
                  <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Free Delivery</div>
                    <div className="text-[11px] text-slate-400">Mark product eligible for Free Delivery</div>
                  </div>
                  <Form.Item name="isFreeDelivery" valuePropName="checked" noStyle>
                    <Switch checkedChildren="Free Delivery" unCheckedChildren="Standard" />
                  </Form.Item>
                </div>
              </div>
            </Card>

            {/* Pricing Card */}
            <Card
              title={
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <DollarOutlined /> Pricing (BDT Tk)
                </span>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-3">
                <Form.Item
                  name="price"
                  label="Selling Price (Tk)"
                  rules={[{ required: true, message: "Enter selling price" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    size="large"
                    min={1}
                    placeholder="e.g. 175000"
                    className="rounded-xl font-bold"
                  />
                </Form.Item>

                <Form.Item
                  name="discountPrice"
                  label="Original / Strike Price (Tk)"
                  tooltip="Higher price shown with a strike-through to highlight discount"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={1}
                    placeholder="e.g. 180000 (Optional)"
                    className="rounded-xl"
                  />
                </Form.Item>
              </div>
            </Card>

            {/* Delivery & Shipping Rates Card */}
            <Card
              title={
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CarOutlined /> Delivery Charges (BDT Tk)
                </span>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                  Set product-specific delivery fees. If left empty, site default delivery charges apply.
                </p>

                <Form.Item
                  name="deliveryInsideDhaka"
                  label="Inside Dhaka (Tk)"
                  tooltip="Delivery charge for addresses inside Dhaka city (default: ৳150)"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Default: 150"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="deliverySuburbs"
                  label="Dhaka Suburbs (Tk)"
                  tooltip="Delivery charge for Gazipur, Savar, Narayanganj (default: ৳200)"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Default: 200"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="deliveryOutsideDhaka"
                  label="Outside Dhaka (Tk)"
                  tooltip="Delivery charge for all 64 districts outside Dhaka (default: ৳350)"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Default: 350"
                    className="rounded-xl"
                  />
                </Form.Item>
              </div>
            </Card>

            {/* Category & Inventory */}
            <Card
              title={
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <AppstoreOutlined /> Organization & Stock
                </span>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-3">
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: "Please select a category" }]}
                >
                  <Select
                    placeholder="Select category"
                    loading={isCategoriesLoading}
                    className="rounded-xl"
                  >
                    {categoriesList.map((cat) => (
                      <Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="stock" label="Stock Inventory Count">
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="e.g. 50"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item name="sku" label="SKU / Item Code">
                  <Input placeholder="e.g. CHR-GESTURE-01" className="rounded-xl" />
                </Form.Item>
              </div>
            </Card>

            {/* Brand, Warranty & Demo Video */}
            <Card
              title={
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <SafetyCertificateOutlined className="text-amber-600" /> Brand, Warranty &amp; Media
                </span>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-3">
                <Form.Item name="brand" label="Brand Name">
                  <Input
                    placeholder="e.g. Unique Engineering & Furniture"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="warranty"
                  label="Factory Warranty Period"
                  tooltip="Displayed in trust badges and specifications (e.g. 5 Years Structural Warranty)"
                >
                  <Input
                    placeholder="e.g. 5 Years Structural Warranty"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="video"
                  label="Product Showcase / Demo Video URL"
                  tooltip="YouTube, Vimeo, or MP4 link for interactive customer video preview"
                >
                  <Input
                    prefix={<VideoCameraOutlined className="text-slate-400" />}
                    placeholder="https://youtu.be/... (Optional)"
                    className="rounded-xl"
                  />
                </Form.Item>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

