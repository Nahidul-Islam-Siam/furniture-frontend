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
  EyeOutlined,
  ExportOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseOutlined,
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

const getColorHex = (name: string): string => {
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

export default function AdminProductsPage() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [togglingProductId, setTogglingProductId] = useState<string | null>(null);
  const [cloningProductId, setCloningProductId] = useState<string | null>(null);
  const [viewingProduct, setViewingProduct] = useState<IProductItem | null>(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

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
      width: 170,
      render: (_: any, record: IProductItem) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setViewingProduct(record);
              setPreviewImageIndex(0);
            }}
            title="View product details"
            className="hover:text-emerald-600"
          />

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

      {/* Quick View / Product Details Modal (matching e-commerce standard) */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900">
                  Product Details &amp; Live Specifications
                </span>
                <Tag color={viewingProduct.isAvailable ? "green" : "red"}>
                  {viewingProduct.isAvailable ? "In Stock" : "Out of Stock"}
                </Tag>
              </div>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-4 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                {/* Image Gallery Preview (Left) */}
                <div className="sm:col-span-5 space-y-2.5">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        viewingProduct.images?.[previewImageIndex] ||
                        viewingProduct.images?.[0] ||
                        "https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385"
                      }
                      alt={viewingProduct.name}
                      className="w-full h-full object-cover"
                    />
                    {viewingProduct.isFreeDelivery && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase shadow-xs">
                        Free Delivery
                      </span>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {viewingProduct.images && viewingProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {viewingProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPreviewImageIndex(idx)}
                          className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                            previewImageIndex === idx
                              ? "border-amber-500 ring-2 ring-amber-200"
                              : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info (Right) */}
                <div className="sm:col-span-7 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200 uppercase">
                        {typeof viewingProduct.category === "object"
                          ? (viewingProduct.category as any)?.name
                          : categoriesList.find((c) => c._id === viewingProduct.category)?.name || "Furniture"}
                      </span>
                      {viewingProduct.brand && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                          {viewingProduct.brand}
                        </span>
                      )}
                      {viewingProduct.sku && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-500 font-mono text-[10px] border border-slate-200">
                          SKU: {viewingProduct.sku}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1.5 leading-snug">
                      {viewingProduct.name}
                    </h3>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        Tk {Number(viewingProduct.price || 0).toLocaleString()}
                      </span>
                      {viewingProduct.discountPrice && viewingProduct.discountPrice > viewingProduct.price && (
                        <>
                          <span className="text-sm text-slate-400 line-through">
                            Tk {Number(viewingProduct.discountPrice).toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Save Tk {Number(viewingProduct.discountPrice - viewingProduct.price).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Inventory Stock:</span>
                      <span className="font-bold text-slate-800">
                        {viewingProduct.stock ?? 0} units
                      </span>
                    </div>
                  </div>

                  {/* Variants (Colors & Sizes) */}
                  <div className="space-y-2 p-3 rounded-xl bg-white border border-slate-200 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 font-medium w-16 shrink-0">Colors:</span>
                      {viewingProduct.colors && viewingProduct.colors.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {viewingProduct.colors.map((cStr, idx) => {
                            const name = cStr.includes(":") ? cStr.split(":")[0] : cStr;
                            const hex = cStr.includes(":") ? cStr.split(":")[1] : getColorHex(cStr);
                            const imgIdx = cStr.includes(":") && cStr.split(":")[2] !== undefined ? cStr.split(":")[2] : null;
                            return (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-700 font-semibold text-[11px] border border-slate-200 flex items-center gap-1.5"
                              >
                                <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: hex }} />
                                <span>{name}</span>
                                {imgIdx !== null && (
                                  <span className="text-[9px] text-blue-600 font-mono">📷#{Number(imgIdx) + 1}</span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Default standard finish</span>
                      )}
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 font-medium w-16 shrink-0">Sizes:</span>
                      {viewingProduct.sizes && viewingProduct.sizes.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {viewingProduct.sizes.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 text-white font-bold text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Standard</span>
                      )}
                    </div>
                  </div>

                  {/* Delivery Charges Rule */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5">
                      <CarOutlined className="text-emerald-600" />
                      <span>Delivery Rules:</span>
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      {viewingProduct.isFreeDelivery ? (
                        <strong>100% Free Nationwide Delivery</strong>
                      ) : (
                        <span>
                          Inside Dhaka: <strong>৳{viewingProduct.deliveryInsideDhaka ?? 150}</strong> |
                          Suburbs: <strong>৳{viewingProduct.deliverySuburbs ?? 200}</strong> |
                          Outside Dhaka: <strong>৳{viewingProduct.deliveryOutsideDhaka ?? 350}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Table */}
              {viewingProduct.specifications && Object.keys(viewingProduct.specifications).length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Technical Specifications:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    {Object.entries(
                      typeof viewingProduct.specifications === "string"
                        ? JSON.parse(viewingProduct.specifications)
                        : viewingProduct.specifications
                    ).map(([k, v], idx) => (
                      <div key={idx} className="text-[11px]">
                        <span className="font-bold text-slate-700">{k}:</span>{" "}
                        <span className="text-slate-600">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                href={`/products/${viewingProduct.slug || viewingProduct._id}`}
                target="_blank"
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition flex items-center gap-1.5 text-xs"
              >
                <ExportOutlined />
                <span>View in Live Store</span>
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setViewingProduct(null)}
                  className="rounded-xl font-medium text-xs"
                >
                  Close
                </Button>
                <Link href={`/admin/products/edit/${viewingProduct._id}`}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 border-none font-semibold text-xs"
                  >
                    Edit Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
