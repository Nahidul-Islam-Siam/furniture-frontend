"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Rate,
  Popconfirm,
  Select,
  Typography,
  Switch,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  StarOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
  IReview,
} from "@/redux/service/reviewApi";

const { Title, Text } = Typography;

export default function AdminReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [activeAction, setActiveAction] = useState<{
    id: string;
    action: "approved" | "rejected" | "feature" | "delete";
  } | null>(null);
  const { data, isLoading, isFetching, refetch } = useGetAdminReviewsQuery({
    status: statusFilter,
  });

  const [updateStatus] = useUpdateReviewStatusMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleStatusChange = async (
    id: string,
    newStatus: "pending" | "approved" | "rejected"
  ) => {
    setActiveAction({
      id,
      action: newStatus === "approved" ? "approved" : "rejected",
    });
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      message.success(`Review ${newStatus} successfully!`);
    } catch {
      message.error("Failed to update status");
    } finally {
      setActiveAction(null);
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    setActiveAction({ id, action: "feature" });
    try {
      await updateStatus({ id, isFeatured }).unwrap();
      message.success(
        isFeatured ? "Marked as featured on homepage!" : "Removed from featured"
      );
    } catch {
      message.error("Failed to update featured flag");
    } finally {
      setActiveAction(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActiveAction({ id, action: "delete" });
    try {
      await deleteReview(id).unwrap();
      message.success("Review deleted successfully");
    } catch {
      message.error("Failed to delete review");
    } finally {
      setActiveAction(null);
    }
  };

  const reviews = data?.data || [];

  const columns: ColumnsType<IReview> = [
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div>
          <div className="font-semibold text-neutral-900">
            {record.customerName}
          </div>
          {record.customerEmail && (
            <div className="text-xs text-neutral-500">{record.customerEmail}</div>
          )}
          {record.title && (
            <div className="text-xs font-medium text-neutral-700 italic mt-0.5">
              &quot;{record.title}&quot;
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 140,
      render: (rating: number) => <Rate disabled defaultValue={rating || 5} />,
    },
    {
      title: "Review Comment",
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) => (
        <Text style={{ maxWidth: 360 }} ellipsis={{ tooltip: comment }}>
          {comment}
        </Text>
      ),
    },
    {
      title: "Featured",
      key: "isFeatured",
      width: 110,
      render: (_, record) => (
        <Switch
          checked={record.isFeatured}
          loading={
            activeAction?.id === record._id && activeAction.action === "feature"
          }
          disabled={activeAction?.id === record._id && activeAction.action !== "feature"}
          onChange={(checked) => handleToggleFeatured(record._id, checked)}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        let color = "blue";
        if (status === "approved") color = "green";
        if (status === "rejected") color = "red";
        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (d: string) => (d ? new Date(d).toLocaleDateString() : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space size="small">
          {record.status !== "approved" && (
            <Button
              size="small"
              type="text"
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              loading={
                activeAction?.id === record._id &&
                activeAction.action === "approved"
              }
              disabled={activeAction?.id === record._id}
              onClick={() => handleStatusChange(record._id, "approved")}
              title="Approve review"
            />
          )}

          {record.status !== "rejected" && (
            <Button
              size="small"
              type="text"
              icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
              loading={
                activeAction?.id === record._id &&
                activeAction.action === "rejected"
              }
              disabled={activeAction?.id === record._id}
              onClick={() => handleStatusChange(record._id, "rejected")}
              title="Reject review"
            />
          )}

          <Popconfirm
            title="Delete Review"
            description="Are you sure you want to delete this review permanently?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              danger: true,
              loading:
                activeAction?.id === record._id &&
                activeAction.action === "delete",
            }}
          >
            <Button
              size="small"
              danger
              type="text"
              icon={<DeleteOutlined />}
              loading={
                activeAction?.id === record._id &&
                activeAction.action === "delete"
              }
              disabled={
                activeAction?.id === record._id &&
                activeAction.action !== "delete"
              }
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Customer Reviews & Ratings
          </Title>
          <Text type="secondary">
            Manage, approve, or feature customer reviews and testimonials.
          </Text>
        </div>

        <Space>
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 160 }}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { label: "All Reviews", value: undefined },
              { label: "Approved", value: "approved" },
              { label: "Pending", value: "pending" },
              { label: "Rejected", value: "rejected" },
            ]}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isFetching}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={reviews}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
}

