"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Tag,
  Space,
  Typography,
  Card,
  Popconfirm,
  message,
  Image,
  Upload,
  Spin,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  LoadingOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  IProductItem,
} from "@/redux/service/productApi";
import { useGetCategoriesQuery, ICategoryItem } from "@/redux/service/categoryApi";
import { useUploadFileMutation } from "@/redux/service/uploadApi";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProductItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [form] = Form.useForm();

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchText]);

  // RTK Queries with real Server-Side Pagination
  const {
    data: productsData,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: debouncedSearch || undefined,
    category: selectedCategory !== "ALL" ? selectedCategory : undefined,
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  // RTK Mutations
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [uploadFile] = useUploadFileMutation();

  const productsList: IProductItem[] = productsData?.data || [];
  const categoriesList: ICategoryItem[] = categoriesData?.data || [];

  // Open modal for Create or Edit
  const handleOpenModal = (product?: IProductItem) => {
    if (product) {
      setEditingProduct(product);
      setImageUrls(product.images || []);
      const categoryId =
        typeof product.category === "object" ? product.category._id : product.category;

      form.setFieldsValue({
        name: product.name,
        category: categoryId,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock ?? 50,
        sku: product.sku || "",
        material: product.material || "",
        description: product.description || "",
        isAvailable: product.isAvailable ?? true,
        isFeatured: product.isFeatured ?? false,
        imageUrlInput: product.images?.[0] || "",
      });
    } else {
      setEditingProduct(null);
      setImageUrls([]);
      form.resetFields();
      const firstCatId = categoriesList[0]?._id;
      form.setFieldsValue({
        isAvailable: true,
        isFeatured: false,
        stock: 50,
        category: firstCatId,
      });
    }
    setIsModalOpen(true);
  };

  // Upload image to backend Cloudinary with instant FileReader fallback
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    let previewBase64 = "";

    // 1. Instant local preview via FileReader
    try {
      const reader = new FileReader();
      const readPromise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      previewBase64 = await readPromise;
    } catch {
      // FileReader error silent
    }

    // 2. Upload to Cloudinary via backend
    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await uploadFile(formData).unwrap();
      if (res.success && res.data) {
        const uploadedUrl = Array.isArray(res.data) ? res.data[0]?.url : (res.data as any)?.url;
        if (uploadedUrl) {
          setImageUrls((prev) => [...prev, uploadedUrl]);
          form.setFieldsValue({ imageUrlInput: "" });
          message.success("Image uploaded to Cloudinary successfully!");
          return false;
        }
      }
    } catch (err: any) {
      // If backend is offline or network fails, attach base64 preview so user is NEVER blocked
      if (previewBase64) {
        setImageUrls((prev) => [...prev, previewBase64]);
        form.setFieldsValue({ imageUrlInput: "" });
        message.warning("Backend upload offline: Image attached locally and will be saved with product!");
        return false;
      }
      message.error(err?.data?.message || "Failed to upload image. Please try pasting an image URL.");
    } finally {
      setIsUploading(false);
    }
    return false; // Prevent Ant Design default XHR upload
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    message.info("Image removed from gallery");
  };

  const handleAddDirectUrl = (url: string) => {
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      message.warning("Please enter a valid image URL");
      return;
    }
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://") && !cleanUrl.startsWith("data:image/")) {
      message.warning("Image URL must start with http:// or https://");
      return;
    }
    setImageUrls((prev) => [...prev, cleanUrl]);
    form.setFieldsValue({ imageUrlInput: "" });
    message.success("Image URL added to gallery!");
  };

  // Save product (create or update)
  const handleSaveProduct = async (values: any) => {
    try {
      let finalImages = [...imageUrls];
      if (values.imageUrlInput && !finalImages.includes(values.imageUrlInput)) {
        finalImages.push(values.imageUrlInput);
      }
      if (finalImages.length === 0) {
        finalImages = ["https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385"];
      }

      const payload: Partial<IProductItem> = {
        name: values.name,
        category: values.category,
        price: Number(values.price),
        discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
        stock: Number(values.stock || 0),
        sku: values.sku || undefined,
        material: values.material || undefined,
        description: values.description || "Premium contract-grade furniture design.",
        images: finalImages,
        isAvailable: values.isAvailable ?? true,
        isFeatured: values.isFeatured ?? false,
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, body: payload }).unwrap();
        message.success("Product updated successfully!");
      } else {
        await createProduct(payload).unwrap();
        message.success("New product published successfully!");
      }

      setIsModalOpen(false);
      refetchProducts();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save product. Please check required fields.");
    }
  };

  // Toggle inStock / isAvailable status
  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    try {
      await updateProduct({
        id,
        body: { isAvailable: !currentStatus },
      }).unwrap();
      message.info(`Product is now ${!currentStatus ? "In Stock" : "Out of Stock"}`);
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update stock status");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      message.success("Product deleted successfully");
      refetchProducts();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete product");
    }
  };

  // Filter products by search and category
  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.material?.toLowerCase().includes(searchText.toLowerCase());

    const productCategory =
      typeof p.category === "object" ? p.category : categoriesList.find((c) => c._id === p.category);
    const categoryName = productCategory?.name || (typeof p.category === "string" ? p.category : "");
    const categoryId = productCategory?._id || p.category;

    const matchesCategory =
      selectedCategory === "ALL" ||
      categoryId === selectedCategory ||
      categoryName?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "images",
      key: "image",
      width: 90,
      render: (images: string[]) => (
        <Image
          src={images?.[0] || "/images/hero-banner.jpg"}
          alt="Product thumbnail"
          width={56}
          height={56}
          style={{ objectFit: "cover", borderRadius: 6 }}
          fallback="/images/hero-banner.jpg"
        />
      ),
    },
    {
      title: "Product Title & SKU",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: IProductItem) => (
        <div>
          <div style={{ fontWeight: 600, color: "#1f1f1f" }}>{name}</div>
          <Space size={4} style={{ marginTop: 4 }}>
            {record.sku && (
              <Tag color="default" style={{ fontSize: 11 }}>
                SKU: {record.sku}
              </Tag>
            )}
            {record.isFeatured && (
              <Tag color="gold" style={{ fontSize: 11 }}>
                Featured
              </Tag>
            )}
          </Space>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 130,
      render: (cat: any) => {
        const catName =
          typeof cat === "object"
            ? cat?.name
            : categoriesList.find((c) => c._id === cat)?.name || cat || "General";
        return <Tag color="blue">{catName}</Tag>;
      },
    },
    {
      title: "Price (BDT)",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price: number, record: IProductItem) => (
        <div>
          <div style={{ fontWeight: 700 }}>Tk {price?.toLocaleString("en-BD")}</div>
          {record.discountPrice && (
            <div style={{ fontSize: 12, color: "#8c8c8c", textDecoration: "line-through" }}>
              Tk {record.discountPrice?.toLocaleString("en-BD")}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Stock / Units",
      dataIndex: "stock",
      key: "stock",
      width: 110,
      render: (stock: number) => <span>{stock ?? 0} units</span>,
    },
    {
      title: "Inventory",
      dataIndex: "isAvailable",
      key: "isAvailable",
      width: 130,
      render: (isAvailable: boolean, record: IProductItem) => (
        <Switch
          checkedChildren="In Stock"
          unCheckedChildren="Out"
          checked={isAvailable ?? true}
          onChange={() => handleToggleStock(record._id, isAvailable ?? true)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_: any, record: IProductItem) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Delete product"
            description="Are you sure you want to delete this furniture item?"
            onConfirm={() => handleDeleteProduct(record._id)}
            okText="Yes, delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} loading={isDeleting} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Products & Catalog Management
          </Title>
          <Text type="secondary">
            Live database catalog with MongoDB backend & Cloudinary image support.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ background: "#09090b" }}
          onClick={() => handleOpenModal()}
        >
          Upload New Product
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card bodyStyle={{ padding: "16px 20px" }} style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
          <Space wrap>
            <Input
              placeholder="Search product name, SKU, material..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
              allowClear
            />
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 180 }}
              loading={isCategoriesLoading}
            >
              <Option value="ALL">All Categories</Option>
              {categoriesList.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Space>

          <Text type="secondary">
            Showing <strong>{productsData?.meta?.total ?? productsList.length}</strong> live catalog items
          </Text>
        </Space>
      </Card>

      {/* Product List Table */}
      <Table
        dataSource={productsList}
        columns={columns}
        rowKey="_id"
        loading={isProductsLoading}
        scroll={{ x: 800 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: productsData?.meta?.total ?? productsList.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          pageSizeOptions: ["8", "16", "24", "48"],
          showSizeChanger: true,
          showQuickJumper: true,
          responsive: true,
          showTotal: (total, range) => (
            <span style={{ fontSize: 13, color: "#595959" }}>
              Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> products
            </span>
          ),
          position: ["bottomRight"],
          style: { marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 },
        }}
      />

      {/* Upload / Edit Product Modal */}
      <Modal
        title={editingProduct ? `Edit "${editingProduct.name}"` : "Upload New Furniture Product"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
        okText={editingProduct ? "Save Changes" : "Publish Product"}
        okButtonProps={{ style: { background: "#09090b" } }}
        width="min(95vw, 680px)"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveProduct} style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Product Title"
            rules={[{ required: true, message: "Please enter product title" }]}
          >
            <Input placeholder="e.g. GRID Ergonomic Executive Chair" />
          </Form.Item>

          <Space style={{ width: "100%", display: "flex" }} size="middle">
            <Form.Item
              name="category"
              label="Category"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Select a category" }]}
            >
              <Select placeholder="Select category" loading={isCategoriesLoading}>
                {categoriesList.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Selling Price (BDT Tk)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Enter selling price" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} placeholder="e.g. 85000" />
            </Form.Item>

            <Form.Item
              name="discountPrice"
              label="Original / Strike Price"
              style={{ flex: 1 }}
            >
              <InputNumber style={{ width: "100%" }} min={1} placeholder="e.g. 95000 (Optional)" />
            </Form.Item>
          </Space>

          <Space style={{ width: "100%", display: "flex" }} size="middle">
            <Form.Item name="stock" label="Stock Quantity" style={{ flex: 1 }}>
              <InputNumber style={{ width: "100%" }} min={0} placeholder="e.g. 50" />
            </Form.Item>

            <Form.Item name="sku" label="SKU Code" style={{ flex: 1 }}>
              <Input placeholder="e.g. CHR-ST-LEAP-01" />
            </Form.Item>

            <Form.Item name="material" label="Material / Finish" style={{ flex: 1 }}>
              <Input placeholder="e.g. Solid Teak / Italian Mesh" />
            </Form.Item>
          </Space>

          {/* Cloudinary Image Upload or Direct URL */}
          <Form.Item label="Product Gallery & Cover Images" required>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space wrap>
                <Upload
                  beforeUpload={handleImageUpload}
                  showUploadList={false}
                  multiple={true}
                  accept="image/*"
                >
                  <Button icon={isUploading ? <LoadingOutlined /> : <UploadOutlined />} disabled={isUploading}>
                    {isUploading ? "Uploading to Cloudinary..." : "Upload Image(s) from Device"}
                  </Button>
                </Upload>
                {imageUrls.length > 0 && (
                  <Tag color="green">{imageUrls.length} image(s) in gallery</Tag>
                )}
              </Space>

              {/* Direct URL input with Add button */}
              <Form.Item name="imageUrlInput" noStyle>
                <Input.Search
                  placeholder="Or paste external/Cloudinary image URL (https://...)"
                  enterButton="+ Add URL"
                  onSearch={(val) => handleAddDirectUrl(val)}
                />
              </Form.Item>

              {/* Thumbnails with delete button */}
              {imageUrls.length > 0 && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                  {imageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        borderRadius: 6,
                        overflow: "hidden",
                        border: idx === 0 ? "2px solid #e07548" : "1px solid #e5e7eb",
                      }}
                    >
                      <Image
                        src={url}
                        alt="Preview"
                        width={70}
                        height={70}
                        style={{ objectFit: "cover" }}
                      />
                      {idx === 0 && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "#e07548",
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 700,
                            textAlign: "center",
                            textTransform: "uppercase",
                            padding: "1px 0",
                          }}
                        >
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: 18,
                          height: 18,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          lineHeight: 1,
                        }}
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Space>
          </Form.Item>

          {/* Rich Text Editor for Product Description */}
          <Form.Item
            name="description"
            label="Product Description & Ergonomics (Rich Text Editor)"
            tooltip="Use the toolbar to add headings, bold text, bullet points, and specifications table"
          >
            <RichTextEditor placeholder="Enter full product description, ergonomic features, warranty details..." />
          </Form.Item>

          <Space size="large">
            <Form.Item name="isAvailable" valuePropName="checked" label="Stock Status">
              <Switch checkedChildren="In Stock" unCheckedChildren="Out of Stock" />
            </Form.Item>

            <Form.Item name="isFeatured" valuePropName="checked" label="Featured on Homepage">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
