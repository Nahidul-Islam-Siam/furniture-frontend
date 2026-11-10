import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  "w1d2fx6v";
const CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY ||
  process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
  "526783424618412";
const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET || "8UISgVkgqJIpM_PYKPeqViFaEzI";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") || formData.get("files");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "No valid file provided" },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "furniture_store";
    const signatureString = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("api_key", CLOUDINARY_API_KEY);
    cloudinaryFormData.append("timestamp", timestamp.toString());
    cloudinaryFormData.append("folder", folder);
    cloudinaryFormData.append("signature", signature);

    const uploadEndpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const response = await fetch(uploadEndpoint, {
      method: "POST",
      body: cloudinaryFormData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: err?.error?.message || "Failed to upload to Cloudinary",
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully to Cloudinary",
      data: {
        url: data.secure_url,
        publicId: data.public_id,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error during upload",
      },
      { status: 500 }
    );
  }
}

