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

      form.setFieldsValue({
        name: initialProduct.name,
        slug: initialProduct.slug || "",
        category: categoryId,
        price: initialProduct.price,
        discountPrice: initialProduct.discountPrice,
        stock: initialProduct.stock ?? 50,
        sku: initialProduct.sku || "",
        material: initialProduct.material || "",
        colors: initialProduct.colors || [],
        dimensionWidth: initialProduct.dimensions?.width,
        dimensionHeight: initialProduct.dimensions?.height,
        dimensionDepth: initialProduct.dimensions?.depth,
        dimensionUnit: initialProduct.dimensions?.unit || "inch",
        weight: initialProduct.weight,
        description: initialProduct.description || "",
        isAvailable: initialProduct.isAvailable ?? true,
        isFeatured: initialProduct.isFeatured ?? false,
        isFreeDelivery: initialProduct.isFreeDelivery ?? false,
      });
    } else {
      setImageUrls([]);
      form.resetFields();
      form.setFieldsValue({
        isAvailable: true,
        isFeatured: false,
        isFreeDelivery: false,
        stock: 50,
        dimensionUnit: "inch",
        colors: [],
      });
    }
  }, [initialProduct, form]);

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

      const payload: Partial<IProductItem> = {
        name: values.name.trim(),
        slug: values.slug
          ? values.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : values.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: values.category,
        price: Number(values.price),
        discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
        stock: Number(values.stock || 0),
        sku: values.sku || undefined,
        material: values.material || undefined,
        colors: values.colors && values.colors.length > 0 ? values.colors : undefined,
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
                  className="rounded-xl"
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
                  <Form.Item name="material" label="Material & Build Finish">
                    <Input
                      placeholder="e.g. Precision CNC Steel Frame / 3D Knit Mesh"
                      className="rounded-xl"
                    />
                  </Form.Item>
                </Col>
              </Row>

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

            {/* 3. Dimensions & Technical Specifications */}
            <Card
              title={
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CompassOutlined /> Furniture Dimensions & Specifications
                </span>
              }
              className="rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="space-y-4">
                <Text type="secondary" className="text-xs block">
                  Provide exact measurements for CNC manufacturing & customer room planning.
                </Text>

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

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="weight"
                      label="Product Weight (kg)"
                      tooltip="Used for courier delivery freight calculations"
                    >
                      <InputNumber style={{ width: "100%" }} min={0} placeholder="e.g. 28" className="rounded-xl" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="colors"
                      label="Color Swatches & Options"
                      tooltip="Type color name and press Enter to add multiple options"
                    >
                      <Select
                        mode="tags"
                        style={{ width: "100%" }}
                        placeholder="Type color and press Enter"
                        className="rounded-xl"
                        options={[
                          { value: "Matte Black", label: "Matte Black" },
                          { value: "Graphite Grey", label: "Graphite Grey" },
                          { value: "Solid Walnut", label: "Solid Walnut" },
                          { value: "Natural Oak", label: "Natural Oak" },
                          { value: "White", label: "White" },
                          { value: "Navy Blue", label: "Navy Blue" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
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
          </Col>
        </Row>
      </Form>
    </div>
  );
};

