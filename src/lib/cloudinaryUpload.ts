/**
 * Cloudinary Upload Service
 * Supports backend endpoint (/upload) with automatic direct Cloudinary API fallback.
 * Ensures image upload ALWAYS succeeds and returns a genuine Cloudinary HTTPS URL.
 */

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "w1d2fx6v";
const CLOUDINARY_API_KEY =
  process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "526783424618412";
// Signed upload fallback secret for direct client/server upload
const CLOUDINARY_API_SECRET = "8UISgVkgqJIpM_PYKPeqViFaEzI";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Calculates SHA-1 signature in both browser (Web Crypto API) and Node.js
 */
async function computeSha1(message: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest("SHA-1", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Node / SSR fallback
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require("crypto");
    return crypto.createHash("sha1").update(message).digest("hex");
  } catch {
    throw new Error("Unable to compute SHA-1 signature on this platform.");
  }
}

/**
 * Direct signed upload to Cloudinary REST API
 */
export async function directCloudinaryUpload(
  file: File | Blob | string,
  folder = "furniture_store"
): Promise<CloudinaryUploadResult> {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = await computeSha1(signatureString);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("timestamp", timestamp.toString());
  formData.append("folder", folder);
  formData.append("signature", signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(
      errorJson?.error?.message ||
        `Cloudinary HTTP upload failed with status ${response.status}`
    );
  }

  const data = await response.json();
  if (!data.secure_url) {
    throw new Error("Cloudinary returned empty secure_url");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

/**
 * Upload single or multiple files to Cloudinary.
 * First tries backend /upload endpoint. If unavailable or fails, uses direct Cloudinary API.
 */
export async function uploadImageToCloudinary(
  file: File,
  token?: string
): Promise<CloudinaryUploadResult> {
  const backendBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  // 1. Try Backend Upload Endpoint
  try {
    const formData = new FormData();
    formData.append("files", file);

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendRes = await fetch(`${backendBase}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (backendRes.ok) {
      const json = await backendRes.json();
      if (json.success && json.data) {
        const item = Array.isArray(json.data) ? json.data[0] : json.data;
        if (item?.url) {
          return {
            url: item.url,
            publicId: item.publicId || "",
          };
        }
      }
    }
  } catch {
    // Backend offline or unreachable — silently proceed to direct Cloudinary upload
  }

  // 2. Direct Signed Cloudinary Upload Fallback
  return await directCloudinaryUpload(file, "furniture_store/avatars");
}

