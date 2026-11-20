"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Table,
  Button,
  Input,
  Select,
  Switch,
  Tag,
  Space,
  Typography,
  Popconfirm,
  message,
  Image,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  IProductItem,
} from "@/redux/service/productApi";
import { useGetCategoriesQuery, ICategoryItem } from "@/redux/service/categoryApi";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminProductsPage() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [togglingProductId, setTogglingProductId] = useState<string | null>(null);
  const [cloningProductId, setCloningProductId] = useState<string | null>(null);

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
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const productsList: IProductItem[] = productsData?.data || [];
  const categoriesList: ICategoryItem[] = categoriesData?.data || [];

  // Toggle inStock / isAvailable status
  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    setTogglingProductId(id);
    try {
      await updateProduct({
        id,
        body: { isAvailable: !currentStatus },
      }).unwrap();
      message.info(`Product is now ${!currentStatus ? "In Stock" : "Out of Stock"}`);
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update stock status");
    } finally {
      setTogglingProductId(null);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    setDeletingProductId(id);
    try {
      await deleteProduct(id).unwrap();
      message.success("Product deleted successfully");
      refetchProducts();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete product");
    } finally {
      setDeletingProductId(null);
    }
  };

  // Clone / Duplicate product (like modern e-commerce stores)
  const handleCloneProduct = async (product: IProductItem) => {
    setCloningProductId(product._id);
    try {
      const categoryId =
        typeof product.category === "object" ? product.category._id : product.category;

      const clonePayload: Partial<IProductItem> = {
        name: `${product.name} (Copy)`,
        slug: `${product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-copy-${Date.now().toString().slice(-4)}`,
        category: categoryId,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock ?? 50,
        sku: product.sku ? `${product.sku}-COPY` : undefined,
        material: product.material,
        colors: product.colors,
        dimensions: product.dimensions,
        weight: product.weight,
        description: product.description,
        images: product.images,
        isAvailable: true,
        isFeatured: false,
      };

      await createProduct(clonePayload).unwrap();
      message.success(`Cloned "${product.name}" successfully!`);
      refetchProducts();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to clone product");
    } finally {
      setCloningProductId(null);
    }
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_: any, record: IProductItem) => {
        const coverImage =
          record.images?.[0] ||
          "https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385";
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
              <Image
                src={coverImage}
                alt={record.name}
                width={48}
                height={48}
                style={{ objectFit: "cover" }}
                preview={false}
              />
            </div>
            <div className="min-w-0">
              <Link
                href={`/admin/products/edit/${record._id}`}
                className="font-bold text-slate-900 hover:text-amber-600 block truncate transition-colors text-sm"
              >
                {record.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                {record.sku && <span>SKU: {record.sku}</span>}
                {record.isFeatured && (
                  <Tag color="gold" className="text-[10px] font-bold m-0 uppercase">
                    Featured
                  </Tag>
                )}
                {record.isFreeDelivery && (
                  <Tag color="green" className="text-[10px] font-bold m-0 uppercase">
                    Free Delivery
                  </Tag>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 140,
      render: (cat: any) => {
        const name =
          typeof cat === "object"
            ? cat?.name
            : categoriesList.find((c) => c._id === cat)?.name || "General";
        return <Tag color="blue" className="rounded-md font-medium">{name}</Tag>;
      },
    },
    {
      title: "Price (BDT)",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price: number, record: IProductItem) => (
        <div>
          <div className="font-bold text-slate-900 text-sm">
            Tk {Number(price || 0).toLocaleString()}
          </div>
          {record.discountPrice && (
            <div className="text-xs text-slate-400 line-through">
              Tk {Number(record.discountPrice).toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      render: (stock: number) => {
        const count = stock ?? 0;
        return (
          <span
            className={`font-bold text-xs px-2 py-0.5 rounded-full ${
              count > 10
                ? "bg-emerald-50 text-emerald-700"
                : count > 0
                ? "bg-amber-50 text-amber-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {count} units
          </span>
        );
      },
    },
    {
      title: "Availability",
      dataIndex: "isAvailable",
      key: "isAvailable",
      width: 130,
      render: (isAvailable: boolean, record: IProductItem) => (
        <Switch
          checkedChildren="In Stock"
          unCheckedChildren="Out"
          checked={isAvailable ?? true}
          loading={togglingProductId === record._id}
          onChange={() => handleToggleStock(record._id, isAvailable ?? true)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_: any, record: IProductItem) => (
        <Space size="small">
          <Link href={`/admin/products/edit/${record._id}`}>
            <Button
              type="text"
              icon={<EditOutlined />}
              title="Edit product"
              className="hover:text-blue-600"
            />
          </Link>

          <Button
            type="text"
            icon={<CopyOutlined />}
            loading={cloningProductId === record._id}
            onClick={() => handleCloneProduct(record)}
            title="Duplicate / Clone product"
            className="hover:text-amber-600"
          />

          <Popconfirm
            title="Delete product"
            description="Are you sure you want to delete this furniture item?"
            onConfirm={() => handleDeleteProduct(record._id)}
            okText="Yes, delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              loading: deletingProductId === record._id,
            }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deletingProductId === record._id}
              title="Delete product"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
            Products &amp; Catalog Management
          </Title>
          <Text type="secondary" className="text-xs">
            Manage your furniture catalog, dimensions, CNC specs, pricing, and Cloudinary media gallery.
          </Text>
        </div>

        <Link href="/admin/products/create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="bg-slate-950 hover:bg-slate-800 border-none rounded-xl font-bold shadow-md h-11 px-5"
          >
            Upload New Product
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <Input
            placeholder="Search product name, SKU, material..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-64 rounded-xl"
            allowClear
          />
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="w-full sm:w-48 rounded-xl"
            loading={isCategoriesLoading}
          >
            <Option value="ALL">All Categories</Option>
            {categoriesList.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </div>

        <Text type="secondary" className="text-xs whitespace-nowrap">
          Showing <strong>{productsData?.meta?.total ?? productsList.length}</strong> live catalog items
        </Text>
      </div>

      {/* Product List Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
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
            pageSizeOptions: ["10", "20", "50"],
            showSizeChanger: true,
            showTotal: (total, range) => (
              <span className="text-xs text-slate-500">
                Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{total}</strong> products
              </span>
            ),
            position: ["bottomRight"],
            className: "px-4 pb-3",
          }}
        />
      </div>
    </div>
  );
}
