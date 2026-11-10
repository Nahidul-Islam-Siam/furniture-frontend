"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/redux";
import { setUser } from "@/redux/features/auth";
import {
  useGetUserQuery,
  useUpdateUserProfileMutation,
} from "@/redux/service/profileData";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";
import {
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const { data: profileResponse, isLoading: isProfileLoading, refetch } =
    useGetUserQuery();

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = profileResponse?.data;
  const currentUser = profile || (authState.user as any);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPublicId, setAvatarPublicId] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      const existingAvatar =
        typeof currentUser.avatar === "object"
          ? currentUser.avatar?.url
          : currentUser.avatar || "";
      setAvatarUrl(existingAvatar);
      if (typeof currentUser.avatar === "object" && currentUser.avatar?.publicId) {
        setAvatarPublicId(currentUser.avatar.publicId);
      }
    }
  }, [currentUser]);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should not exceed 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    const uploadToast = toast.loading("Uploading photo...");
    try {
      const uploadedData = await uploadImageToCloudinary(
        file,
        authState.accessToken || undefined
      );
      if (uploadedData?.url) {
        setAvatarUrl(uploadedData.url);
        setAvatarPublicId(uploadedData.publicId || "");
        toast.success("Photo uploaded! Remember to save changes.", {
          id: uploadToast,
        });
      } else {
        toast.error("Failed to upload photo", { id: uploadToast });
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to upload photo",
        { id: uploadToast }
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    // Optional phone validation: if entered, format check
    const trimmedPhone = phone.trim();
    if (trimmedPhone && !/^\+?[0-9\s\-()]{7,20}$/.test(trimmedPhone)) {
      toast.error(
        "Please enter a valid phone number (e.g. +8801700000000 or 01700000000)"
      );
      return;
    }

    const payload: {
      name: string;
      phone?: string;
      avatar?: { url: string; publicId?: string };
    } = {
      name: name.trim(),
      phone: trimmedPhone || undefined,
    };

    if (avatarUrl) {
      payload.avatar = {
        url: avatarUrl,
        publicId: avatarPublicId || undefined,
      };
    }

    try {
      const res = await updateProfile(payload).unwrap();
      toast.success(res?.message || "Profile updated successfully!");

      // Update Redux state so headers / user drawers reflect new data immediately
      if (res?.data) {
        dispatch(
          setUser({
            user: {
              ...(authState.user as any),
              name: res.data.name,
              phone: res.data.phone,
              avatar: res.data.avatar,
            },
            accessToken: authState.accessToken,
            refreshToken: authState.refreshToken,
          })
        );
      }
      refetch();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.data?.errorSources?.[0]?.message ||
        err?.message ||
        "Failed to update profile";
      toast.error(errorMsg);
    }
  };

  const initialLetter =
    name?.[0]?.toUpperCase() ||
    currentUser?.name?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details, profile picture, and contact information.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        {/* Avatar and Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b">
          <div className="relative group self-start">
            <div className="relative flex h-24 w-24 overflow-hidden items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-3xl border-2 border-primary/20 shadow-sm">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={name || "User Avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initialLetter
              )}

              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow hover:bg-primary/90 transition-transform active:scale-95"
              title="Change Profile Photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xl">
                {name || currentUser?.name || "Customer Account"}
              </h3>
              {currentUser?.isEmailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
                  <AlertCircle className="h-3 w-3" /> Unverified
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {currentUser?.email || ""}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-semibold uppercase text-primary">
                <Shield className="h-3.5 w-3.5" />
                {currentUser?.role || "USER"}
              </span>

              {currentUser?.createdAt && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <User className="h-3.5 w-3.5 text-primary" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" /> Email Address
              </label>
              <input
                type="email"
                value={currentUser?.email || ""}
                disabled
                className="w-full rounded-lg border bg-muted/70 px-3.5 py-2.5 text-sm shadow-sm cursor-not-allowed opacity-80"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Email address is permanently linked to your account.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801700000000"
                className="w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Used for delivery status updates and checkout confirmation.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isUpdating || isUploadingAvatar || isProfileLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Profile Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
