"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Avatar,
  message,
  Upload,
  Tag,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@/redux";
import { useChangePasswordMutation } from "@/redux/service/auth/authApi";
import { useUploadFileMutation } from "@/redux/service/uploadApi";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  getStoreContent,
  saveStoreContent,
  DEFAULT_STORE_CONTENT,
} from "@/lib/storeContent";

const { Title, Text, Paragraph } = Typography;

export default function AdminSettingsPage() {
  const { user } = useAppSelector((state) => state.auth);

  // Forms
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [storeInfoForm] = Form.useForm();
  const [aboutForm] = Form.useForm();
  const [privacyForm] = Form.useForm();
  const [termsForm] = Form.useForm();
  const [warrantyForm] = Form.useForm();

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Content states for Rich Editors
  const [aboutText, setAboutText] = useState("");
  const [privacyText, setPrivacyText] = useState("");
  const [termsText, setTermsText] = useState("");
  const [warrantyText, setWarrantyText] = useState("");

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [uploadFile] = useUploadFileMutation();

  // Load saved settings on mount
  useEffect(() => {
    const savedProfile = getStoreContent<typeof DEFAULT_STORE_CONTENT.adminProfile>("adminProfile");
    const savedStoreInfo = getStoreContent<typeof DEFAULT_STORE_CONTENT.storeInfo>("storeInfo");
    const savedAbout = getStoreContent<string>("aboutText");
    const savedPrivacy = getStoreContent<string>("privacyText");
    const savedTerms = getStoreContent<string>("termsText");
    const savedWarranty = getStoreContent<string>("warrantyText");

    // Profile init
    profileForm.setFieldsValue({
      fullName: user?.name || savedProfile.fullName,
      email: user?.email || savedProfile.email,
      phone: savedProfile.phone,
      designation: savedProfile.designation,
    });
    setAvatarUrl(savedProfile.avatar || "");

    // Store Info init
    storeInfoForm.setFieldsValue(savedStoreInfo);

    // Legal / Content init
    setAboutText(savedAbout);
    aboutForm.setFieldsValue({ aboutText: savedAbout });

    setPrivacyText(savedPrivacy);
    privacyForm.setFieldsValue({ privacyText: savedPrivacy });

    setTermsText(savedTerms);
    termsForm.setFieldsValue({ termsText: savedTerms });

    setWarrantyText(savedWarranty);
    warrantyForm.setFieldsValue({ warrantyText: savedWarranty });
  }, [user]);

  // Avatar upload handler with FileReader + Cloudinary
  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    let previewBase64 = "";

    try {
      const reader = new FileReader();
      const readPromise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      previewBase64 = await readPromise;
    } catch {
      // FileReader error
    }

    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await uploadFile(formData).unwrap();
      if (res.success && res.data) {
        const uploadedUrl = Array.isArray(res.data) ? res.data[0]?.url : (res.data as any)?.url;
        if (uploadedUrl) {
          setAvatarUrl(uploadedUrl);
          const currentProfile = getStoreContent<any>("adminProfile");
          saveStoreContent("adminProfile", { ...currentProfile, avatar: uploadedUrl });
          message.success("Profile photo uploaded to Cloudinary successfully!");
          setIsUploadingAvatar(false);
          return false;
        }
      }
    } catch (err: any) {
      if (previewBase64) {
        setAvatarUrl(previewBase64);
        const currentProfile = getStoreContent<any>("adminProfile");
        saveStoreContent("adminProfile", { ...currentProfile, avatar: previewBase64 });
        message.warning("Backend offline: Photo updated locally and saved to admin profile!");
        setIsUploadingAvatar(false);
        return false;
      }
      message.error("Failed to upload photo. Please check your image file.");
    } finally {
      setIsUploadingAvatar(false);
    }
    return false;
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    const currentProfile = getStoreContent<any>("adminProfile");
    saveStoreContent("adminProfile", { ...currentProfile, avatar: "" });
    message.info("Profile photo removed");
  };

  const handleProfileSave = (values: any) => {
    const updated = {
      ...values,
      avatar: avatarUrl,
    };
    saveStoreContent("adminProfile", updated);
    message.success("Administrator profile & photo saved successfully!");
  };

  const handleStoreInfoSave = (values: any) => {
    saveStoreContent("storeInfo", values);
    message.success("Store contact information & showroom location updated!");
  };

  const handlePasswordSave = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("New password and confirm password do not match!");
      return;
    }
    try {
      await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      passwordForm.resetFields();
      message.success("Password changed successfully in database!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to change password. Verify your current password.");
    }
  };

  const handleSaveAbout = () => {
    saveStoreContent("aboutText", aboutText);
    message.success("About Us story updated and published to website!");
  };

  const handleSavePrivacy = () => {
    saveStoreContent("privacyText", privacyText);
    message.success("Privacy Policy updated with Rich Text formatting and published!");
  };

  const handleSaveTerms = () => {
    saveStoreContent("termsText", termsText);
    message.success("Terms of Service agreement updated and published!");
  };

  const handleSaveWarranty = () => {
    saveStoreContent("warrantyText", warrantyText);
    message.success("5-Year Warranty & Return Guarantee guidelines updated!");
  };

  // 1. Profile Tab with Photo Upload
  const profileTab = (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
        <div style={{ position: "relative" }}>
          <Avatar
            size={88}
            src={avatarUrl || undefined}
            icon={!avatarUrl ? <UserOutlined /> : undefined}
            style={{
              backgroundColor: "#09090b",
              fontSize: 32,
              border: "3px solid #e07548",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {!avatarUrl && (user?.name ? user.name[0].toUpperCase() : "A")}
          </Avatar>
        </div>

        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
            {profileForm.getFieldValue("fullName") || user?.name || "Administrator"}
          </Title>
          <Text type="secondary">{user?.email || "admin@furniture.com"}</Text>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <Tag color="orange" style={{ fontWeight: 600 }}>Super Administrator</Tag>
            <Tag color="green" icon={<CheckCircleOutlined />}>Full Access Verified</Tag>
          </div>

          {/* Photo Actions */}
          <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
            <Upload
              beforeUpload={handleAvatarUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button
                icon={<UploadOutlined />}
                size="small"
                loading={isUploadingAvatar}
              >
                {avatarUrl ? "Change Photo" : "Upload Photo"}
              </Button>
            </Upload>

            {avatarUrl && (
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleRemoveAvatar}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <Divider style={{ margin: "20px 0" }} />

      <Form
        form={profileForm}
        layout="vertical"
        onFinish={handleProfileSave}
        style={{ maxWidth: 640 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input placeholder="Enter your full name" size="large" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="designation"
              label="Admin Role / Designation"
            >
              <Input placeholder="e.g. Principal Store Administrator" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Admin Email Address"
              rules={[{ required: true, type: "email", message: "Please enter valid email" }]}
            >
              <Input placeholder="Enter email" size="large" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="phone" label="Official Phone / Mobile">
              <Input placeholder="+880 1700-009947" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          style={{ background: "#09090b", marginTop: 8 }}
        >
          Save Profile & Photo
        </Button>
      </Form>
    </Card>
  );

  // 2. Store Info & Contact Settings
  const storeInfoTab = (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Configure the public contact details, official hotline, Banani showroom address, and operating hours shown in the header, footer, and invoices.
      </Paragraph>

      <Form
        form={storeInfoForm}
        layout="vertical"
        onFinish={handleStoreInfoSave}
        style={{ maxWidth: 700 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="storeName"
              label="Store Brand Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="GRID Furniture Bangladesh" size="large" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Customer Support Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="support@99grid.com" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="hotline"
              label="Customer Service Hotline"
              rules={[{ required: true }]}
            >
              <Input placeholder="+880 1700-009947" size="large" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="whatsapp"
              label="WhatsApp Orders Number"
            >
              <Input placeholder="+880 1700-009947" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="showroom"
          label="Physical Showroom Location"
          rules={[{ required: true }]}
        >
          <Input placeholder="GRID Experience Center, Level 4, Banani, Dhaka" size="large" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Registered Corporate / Warehouse Address"
          rules={[{ required: true }]}
        >
          <Input placeholder="Plot 42, Road 11, Block D, Banani, Dhaka 1213" size="large" />
        </Form.Item>

        <Form.Item
          name="workingHours"
          label="Showroom Operating Hours"
          rules={[{ required: true }]}
        >
          <Input placeholder="Saturday - Thursday: 10:00 AM - 8:30 PM" size="large" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          style={{ background: "#09090b", marginTop: 8 }}
        >
          Save Store Information
        </Button>
      </Form>
    </Card>
  );

  // 3. Privacy Policy Tab with Rich Text Editor
  const privacyTab = (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div style={{ marginBottom: 18 }}>
        <Title level={4} style={{ margin: 0 }}>
          Privacy Policy & Customer Data Charter
        </Title>
        <Text type="secondary">
          Use the full React Rich Text Editor to format sections, bullet points, payment encryption clauses, and customer rights.
        </Text>
      </div>

      <div style={{ marginBottom: 20 }}>
        <RichTextEditor
          value={privacyText}
          onChange={(val) => setPrivacyText(val)}
          placeholder="Enter Privacy Policy guidelines and legal clauses..."
          minHeight={320}
        />
      </div>

      <Button
        type="primary"
        onClick={handleSavePrivacy}
        icon={<SaveOutlined />}
        size="large"
        style={{ background: "#09090b" }}
      >
        Publish Privacy Policy
      </Button>
    </Card>
  );

  // 4. Terms & Conditions Tab with Rich Text Editor
  const termsTab = (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div style={{ marginBottom: 18 }}>
        <Title level={4} style={{ margin: 0 }}>
          Terms of Service & Sales Agreement
        </Title>
        <Text type="secondary">
          Define contract-grade purchasing terms, delivery timelines, assembly agreements, and order cancellation policies.
        </Text>
      </div>

      <div style={{ marginBottom: 20 }}>
        <RichTextEditor
          value={termsText}
          onChange={(val) => setTermsText(val)}
          placeholder="Enter Terms and Conditions clauses..."
          minHeight={320}
        />
      </div>

      <Button
        type="primary"
        onClick={handleSaveTerms}
        icon={<SaveOutlined />}
        size="large"
        style={{ background: "#09090b" }}
      >
        Publish Terms of Service
      </Button>
    </Card>
  );

  // 5. About Us Tab with Rich Text Editor
  const aboutTab = (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div style={{ marginBottom: 18 }}>
        <Title level={4} style={{ margin: 0 }}>
          About Us Brand Story
        </Title>
        <Text type="secondary">
          Craft your company background, Steelcase partnership, Banani showroom introduction, and engineering standards.
        </Text>
      </div>

      <div style={{ marginBottom: 20 }}>
        <RichTextEditor
          value={aboutText}
          onChange={(val) => setAboutText(val)}
          placeholder="Write your company background and design philosophy..."
          minHeight={320}
        />
      </div>

      <Button
        type="primary"
        onClick={handleSaveAbout}
        icon={<SaveOutlined />}
        size="large"
        style={{ background: "#09090b" }}
      >
        Publish About Us Story
      </Button>
    </Card>
  );

  // 6. Warranty & Return Policy Tab with Rich Text Editor
  const warrantyTab = (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div style={{ marginBottom: 18 }}>
        <Title level={4} style={{ margin: 0 }}>
          5-Year Warranty & 7-Day Return Guarantee
        </Title>
        <Text type="secondary">
          Outline official manufacturer warranty coverage windows for desks, ergonomic chairs, and Dhaka technician inspection.
        </Text>
      </div>

      <div style={{ marginBottom: 20 }}>
        <RichTextEditor
          value={warrantyText}
          onChange={(val) => setWarrantyText(val)}
          placeholder="Specify 5-Year warranty rules and replacement guarantees..."
          minHeight={320}
        />
      </div>

      <Button
        type="primary"
        onClick={handleSaveWarranty}
        icon={<SaveOutlined />}
        size="large"
        style={{ background: "#09090b" }}
      >
        Publish Warranty & Return Policy
      </Button>
    </Card>
  );

  // 7. Change Password Tab
  const passwordTab = (
    <Card bordered={false} style={{ maxWidth: 580 }} className="shadow-sm rounded-xl">
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Ensure your administrative portal uses a strong password to protect store operations, customer data, and payment orders.
      </Paragraph>

      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordSave}
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[{ required: true, message: "Please enter current password" }]}
        >
          <Input.Password placeholder="Enter current password" size="large" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, min: 6, message: "Minimum 6 characters required" }]}
        >
          <Input.Password placeholder="Enter new password (min 6 characters)" size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          rules={[{ required: true, message: "Please confirm your new password" }]}
        >
          <Input.Password placeholder="Re-enter new password" size="large" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          loading={isChangingPassword}
          style={{ background: "#09090b", marginTop: 8 }}
        >
          Update Password in Database
        </Button>
      </Form>
    </Card>
  );

  const tabItems = [
    {
      key: "profile",
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <UserOutlined />
          Admin Profile & Photo
        </span>
      ),
      children: profileTab,
    },
    {
      key: "store",
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ShopOutlined />
          Store & Hotline Info
        </span>
      ),
      children: storeInfoTab,
    },
    {
      key: "privacy",
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <FileTextOutlined />
          Privacy Policy (Rich Editor)
        </span>
      ),
      children: privacyTab,
    },
    {
      key: "terms",
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <FileTextOutlined />
          Terms of Service (Rich Editor)
        </span>
      ),
      children: termsTab,
    },
    {
      key: "about",
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <InfoCircleOutlined />
          About Us (Rich Editor)
        </span>
      ),
      children: aboutTab,
    },
    {
      key: "warranty",
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <SafetyCertificateOutlined />
          5-Year Warranty Policy (Rich Editor)
        </span>
      ),
      children: warrantyTab,
    },
    {
      key: "password",
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <LockOutlined />
          Security & Password
        </span>
      ),
      children: passwordTab,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          Store Settings & Legal Content Management
        </Title>
        <Text type="secondary">
          Upload administrator avatars, manage store contact info, and publish rich formatted legal policies.
        </Text>
      </div>

      <Tabs defaultActiveKey="profile" items={tabItems} size="large" />
    </div>
  );
}
