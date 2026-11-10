"use client";

import React, { useState } from "react";
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
  Image,
  Upload,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  LoadingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  ICategoryItem,
} from "@/redux/service/categoryApi";
import { useUploadFileMutation } from "@/redux/service/uploadApi";

const { Title, Text } = Typography;

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategoryItem | null>(null);
  const [searchText, setSearchText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [togglingCategoryId, setTogglingCategoryId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const [form] = Form.useForm();

  // RTK Queries & Mutations
  const { data: categoriesData, isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [uploadFile] = useUploadFileMutation();

  const categoriesList: ICategoryItem[] = categoriesData?.data || [];

  // Open modal for Create or Edit
  const handleOpenModal = (cat?: ICategoryItem) => {
    if (cat) {
      setEditingCategory(cat);
      setImageUrl(cat.image || "");
      form.setFieldsValue({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        image: cat.image || "",
        isActive: cat.isActive ?? true,
      });
    } else {
      setEditingCategory(null);
      setImageUrl("");
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  // Upload category banner to Cloudinary
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("files", file);

      const res = await uploadFile(formData).unwrap();
      if (res.success && res.data) {
        const uploadedUrl = Array.isArray(res.data) ? res.data[0]?.url : res.data?.url;
        if (uploadedUrl) {
          setImageUrl(uploadedUrl);
          form.setFieldsValue({ image: uploadedUrl });
          message.success("Category image uploaded successfully!");
        }
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
    return false;
  };

  // Save Category
  const handleSaveCategory = async (values: any) => {
    try {
      const payload: Partial<ICategoryItem> = {
        name: values.name.trim(),
        slug: values.slug?.trim() || values.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
        description: values.description || undefined,
        image: values.image || imageUrl || undefined,
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
      message.error(err?.data?.message || "Failed to save category");
    }
  };

  // Toggle Category Active Status
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingCategoryId(id);
    try {
      await updateCategory({
        id,
        body: { isActive: !currentStatus },
      }).unwrap();
      message.info(`Category is now ${!currentStatus ? "Active" : "Inactive"}`);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update status");
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
  const filteredCategories = categoriesList.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "image",
      key: "image",
      width: 90,
      render: (img: string) => (
        <Image
          src={img || "https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385"}
          alt="Category thumbnail"
          width={56}
          height={56}
          style={{ objectFit: "cover", borderRadius: 6 }}
          fallback="/images/hero-banner.jpg"
        />
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: ICategoryItem) => (
        <div>
          <div style={{ fontWeight: 600, color: "#1f1f1f" }}>{name}</div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>Slug: {record.slug}</div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc: string) => (
        <span style={{ fontSize: 13, color: "#595959" }}>
          {desc || "Standard furniture category"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 140,
      render: (active: boolean, record: ICategoryItem) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Hidden"
          checked={active ?? true}
          loading={togglingCategoryId === record._id}
          onChange={() => handleToggleStatus(record._id, active ?? true)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: ICategoryItem) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            disabled={deletingCategoryId === record._id}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Delete category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDeleteCategory(record._id)}
            okText="Yes, delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              loading: deletingCategoryId === record._id,
            }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={deletingCategoryId === record._id}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
            Category Management
          </Title>
          <Text type="secondary">
            Organize furniture catalogs into Chairs, Tables, Sofas, Storage, and custom groupings.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ background: "#0f172a" }}
          onClick={() => handleOpenModal()}
        >
          Add New Category
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Input
          placeholder="Search category name or slug..."
          prefix={<SearchOutlined className="text-slate-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full sm:w-72"
          allowClear
        />
        <Text type="secondary" className="text-xs whitespace-nowrap">
          Total Categories: <strong>{filteredCategories.length}</strong>
        </Text>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
        <Table
          dataSource={filteredCategories}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          scroll={{ x: 700 }}
          pagination={{ defaultPageSize: 10, className: "px-4 pb-3" }}
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={editingCategory ? `Edit "${editingCategory.name}"` : "Add New Category"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
        okText={editingCategory ? "Save Changes" : "Create Category"}
        okButtonProps={{ style: { background: "#09090b" } }}
        width="min(95vw, 560px)"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveCategory} style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="e.g. Ergonomic Office Chairs" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="URL Slug (Optional)"
            extra="Leave blank to automatically generate from name"
          >
            <Input placeholder="e.g. chairs or ergonomic-chairs" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Brief overview of items in this category" />
          </Form.Item>

          <Form.Item label="Category Banner / Icon">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space wrap>
                <Upload
                  beforeUpload={handleImageUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={isUploading ? <LoadingOutlined /> : <UploadOutlined />} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload Image to Cloudinary"}
                  </Button>
                </Upload>
              </Space>

              <Form.Item name="image" noStyle>
                <Input placeholder="Or paste direct image URL (https://...)" />
              </Form.Item>

              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Category preview"
                  width={80}
                  height={80}
                  style={{ objectFit: "cover", borderRadius: 6, border: "1px solid #e5e7eb" }}
                />
              )}
            </Space>
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked" label="Visibility Status">
            <Switch checkedChildren="Active" unCheckedChildren="Hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

