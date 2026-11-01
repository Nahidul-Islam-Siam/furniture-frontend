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
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { ALL_PRODUCTS, Product } from "@/data/gridData";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [form] = Form.useForm();

  // Open modal for Create or Edit
  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      form.setFieldsValue({
        title: product.title,
        category: product.category,
        priceNumber: product.priceNumber,
        originalPriceNumber: product.originalPrice
          ? parseInt(product.originalPrice.replace(/[^0-9]/g, ""), 10)
          : undefined,
        imageUrl: product.images[0] || "",
        description: product.description,
        inStock: product.inStock,
        tag: product.tag || "",
      });
    } else {
      setEditingProduct(null);
      form.resetFields();
      form.setFieldsValue({ inStock: true, category: "Chair" });
    }
    setIsModalOpen(true);
  };

  // Save product (create or update)
  const handleSaveProduct = (values: any) => {
    const formattedPrice = `from Tk ${values.priceNumber.toLocaleString("en-BD")}.00`;
    const formattedOriginal = values.originalPriceNumber
      ? `Tk ${values.originalPriceNumber.toLocaleString("en-BD")}.00`
      : undefined;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? {
                ...item,
                title: values.title,
                category: values.category,
                priceNumber: values.priceNumber,
                priceText: formattedPrice,
                originalPrice: formattedOriginal,
                description: values.description,
                inStock: values.inStock,
                tag: values.tag,
                images: values.imageUrl ? [values.imageUrl] : item.images,
              }
            : item
        )
      );
      message.success("Product updated successfully!");
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        title: values.title,
        category: values.category,
        link: `/products/${values.title.toLowerCase().replace(/\s+/g, "-")}`,
        priceNumber: values.priceNumber,
        priceText: formattedPrice,
        originalPrice: formattedOriginal,
        images: values.imageUrl
          ? [values.imageUrl]
          : ["https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385"],
        rating: 5,
        description: values.description || "",
        inStock: values.inStock,
        tag: values.tag,
      };
      setProducts((prev) => [newProduct, ...prev]);
      message.success("New product published successfully!");
    }
    setIsModalOpen(false);
  };

  // Toggle inStock status
  const handleToggleStock = (id: string, currentStatus: boolean) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inStock: !currentStatus } : item
      )
    );
    message.info(`Stock status updated to ${!currentStatus ? "In Stock" : "Out of Stock"}`);
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    message.success("Product deleted successfully");
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || p.category === selectedCategory;
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
      title: "Product Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Product) => (
        <div>
          <div style={{ fontWeight: 600, color: "#1f1f1f" }}>{title}</div>
          {record.tag && (
            <Tag color="orange" style={{ fontSize: 11, marginTop: 4 }}>
              {record.tag}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Price (BDT)",
      dataIndex: "priceNumber",
      key: "priceNumber",
      width: 150,
      render: (price: number, record: Product) => (
        <div>
          <div style={{ fontWeight: 700 }}>Tk {price.toLocaleString("en-BD")}</div>
          {record.originalPrice && (
            <div style={{ fontSize: 12, color: "#8c8c8c", textDecoration: "line-through" }}>
              {record.originalPrice}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Inventory",
      dataIndex: "inStock",
      key: "inStock",
      width: 130,
      render: (inStock: boolean, record: Product) => (
        <Switch
          checkedChildren="In Stock"
          unCheckedChildren="Out"
          checked={inStock}
          onChange={() => handleToggleStock(record.id, inStock)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Delete product"
            description="Are you sure you want to delete this furniture item?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Yes, delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
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
            Manage your furniture catalog, upload new items, update stock, and pricing.
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
              placeholder="Search product name..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 240 }}
              allowClear
            />
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 160 }}
            >
              <Option value="ALL">All Categories</Option>
              <Option value="Chair">Chairs</Option>
              <Option value="Table">Tables & Desks</Option>
              <Option value="Sofa">Sofas</Option>
              <Option value="Storage">Storage & Cabinets</Option>
            </Select>
          </Space>

          <Text type="secondary">
            Showing <strong>{filteredProducts.length}</strong> items
          </Text>
        </Space>
      </Card>

      {/* Product List Table */}
      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="id"
        scroll={{ x: 800 }}
        pagination={{
          defaultPageSize: 8,
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
        title={editingProduct ? "Edit Product Details" : "Upload New Furniture Product"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingProduct ? "Save Changes" : "Publish Product"}
        okButtonProps={{ style: { background: "#09090b" } }}
        width="min(95vw, 650px)"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveProduct} style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Product Title"
            rules={[{ required: true, message: "Please enter product title" }]}
          >
            <Input placeholder="e.g. GRID Ergonomic Executive Chair" />
          </Form.Item>

          <Space orientation="horizontal" style={{ width: "100%", display: "flex" }} size="middle">
            <Form.Item
              name="category"
              label="Category"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Select a category" }]}
            >
              <Select orientation="horizontal">
                <Option value="Chair">Chair</Option>
                <Option value="Table">Table / Desk</Option>
                <Option value="Sofa">Sofa</Option>
                <Option value="Storage">Storage</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="priceNumber"
              label="Selling Price (BDT Tk)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Enter selling price" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="e.g. 85000"
              />
            </Form.Item>

            <Form.Item
              name="originalPriceNumber"
              label="Original / Strike Price"
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="e.g. 95000 (Optional)"
              />
            </Form.Item>
          </Space>

          <Form.Item
            name="imageUrl"
            label="Product Image URL"
            extra="Direct image link for high resolution preview"
          >
            <Input placeholder="https://example.com/product.jpg" />
          </Form.Item>

          <Form.Item name="tag" label="Promo Badge / Tag (Optional)">
            <Input placeholder="e.g. Save Tk 5,000 or Popular" />
          </Form.Item>

          <Form.Item name="description" label="Product Description & Ergonomics">
            <Input.TextArea rows={3} placeholder="Provide key product details..." />
          </Form.Item>

          <Form.Item name="inStock" valuePropName="checked" label="Stock Availability">
            <Switch checkedChildren="In Stock" unCheckedChildren="Out of Stock" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
