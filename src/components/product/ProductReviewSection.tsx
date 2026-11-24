"use client";

import React, { useState } from "react";
import { Star, MessageSquarePlus, CheckCircle2, ShieldCheck, User, Camera, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux";
import { useGetPublicReviewsQuery, useCreateReviewMutation, IReview } from "@/redux/service/reviewApi";
import { uploadImageToCloudinary } from "@/lib/cloudinaryUpload";

interface ProductReviewSectionProps {
  productId: string;
  productName: string;
  initialRating?: number;
  initialNumReviews?: number;
}

export const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({
  productId,
  productName,
  initialRating = 5,
  initialNumReviews = 0,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
  const { data: reviewsData, refetch } = useGetPublicReviewsQuery(
    productId ? { productId, limit: 20 } : { limit: 20 }
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [reviewTitle, setReviewTitle] = useState("");
  const [comment, setComment] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const reviewsList: IReview[] = reviewsData?.data || [];
  const displayRating = initialRating || 5;
  const displayCount = reviewsList.length > 0 ? reviewsList.length : initialNumReviews;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setUploadedPhotos((prev) => [...prev, url]);
      toast.success("Photo attached successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim() || comment.trim().length < 3) {
      toast.error("Please enter a review comment (minimum 3 characters)");
      return;
    }

    const nameToUse = customerName.trim() || user?.name || "Verified Customer";
    const emailToUse = customerEmail.trim() || user?.email || undefined;

    try {
      await createReview({
        productId,
        customerName: nameToUse,
        customerEmail: emailToUse,
        rating,
        title: reviewTitle.trim() || undefined,
        comment: comment.trim(),
        images: uploadedPhotos,
      }).unwrap();

      toast.success("Thank you! Your review has been submitted successfully.");
      setReviewTitle("");
      setComment("");
      setUploadedPhotos([]);
      setIsFormOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review. Please try again.");
    }
  };

  return (
    <section id="customer-reviews" className="border-t border-stone-200/80 py-16 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Stats Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                Verified Customer Feedback
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="size-3" /> 100% Authentic
              </span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 mt-1 mb-0">
              Customer Reviews &amp; Impressions
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xl">
              Real testimonials on build quality, ergonomic support, and unboxing from customers who own the {productName}.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-amber-500">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <span className="font-heading font-black text-2xl text-neutral-900 font-mono">
                  {displayRating.toFixed(1)}
                </span>
              </div>
              <span className="text-[11px] text-stone-500">
                Based on {displayCount} {displayCount === 1 ? "review" : "reviews"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="px-5 py-3 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
            >
              <MessageSquarePlus className="size-4" />
              {isFormOpen ? "Close Form" : "Write a Review"}
            </button>
          </div>
        </div>

        {/* Interactive Review Submission Box */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="my-8 p-6 sm:p-8 rounded-2xl bg-white border-2 border-neutral-900 shadow-md space-y-5 animate-in fade-in-50 duration-200"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                Write Your Review for {productName}
              </h3>
              <span className="text-xs text-stone-400">Share your honest feedback</span>
            </div>

            {/* Star Rating Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                Overall Rating *
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-stone-300 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`size-6 transition-colors ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-800 ml-2">
                  {rating === 5
                    ? "5 - Excellent Craftsmanship"
                    : rating === 4
                    ? "4 - Very Good"
                    : rating === 3
                    ? "3 - Average"
                    : rating === 2
                    ? "2 - Below Expectations"
                    : "1 - Poor"}
                </span>
              </div>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-black bg-stone-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  Email Address <span className="text-stone-400 font-normal lowercase">(optional / verified badge)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. tanvir@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-black bg-stone-50/50"
                />
              </div>
            </div>

            {/* Review Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                Review Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Stunning Walnut finish and exceptionally sturdy!"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-black bg-stone-50/50"
              />
            </div>

            {/* Comment */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                Your Detailed Review *
              </label>
              <textarea
                required
                rows={4}
                placeholder="How was the build quality, wood finish, foam comfort, assembly, and courier packaging?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-black bg-stone-50/50"
              />
            </div>

            {/* Optional Photos Attachment */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="size-3.5" /> Attach Photos of Assembled Furniture <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-neutral-700 transition">
                  {isUploadingPhoto ? (
                    <Loader2 className="size-4 animate-spin text-black" />
                  ) : (
                    <UploadCloud className="size-4 text-stone-500" />
                  )}
                  <span>{isUploadingPhoto ? "Uploading..." : "Upload Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                    className="sr-only"
                  />
                </label>

                {uploadedPhotos.map((img, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="Review attachment" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 rounded-full border border-stone-300 text-xs font-bold text-neutral-700 hover:bg-stone-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploadingPhoto}
                className="px-6 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5 text-emerald-400" /> Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Reviews Cards List */}
        {reviewsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {reviewsList.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-stone-400 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < review.rating ? "fill-current text-amber-400" : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                    </span>
                  </div>

                  {review.title && (
                    <h4 className="text-sm font-bold text-neutral-900 m-0 leading-snug">
                      {review.title}
                    </h4>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed m-0">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-xs">
                      {review.customerName?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 leading-none">
                        {review.customerName}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                        <CheckCircle2 className="size-2.5" /> Verified Buyer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 py-12 px-4 rounded-2xl bg-white border border-dashed border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Star className="size-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">No reviews yet for this product</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Be the first to share your experience with the craftsmanship and comfort of this furniture piece!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 transition"
            >
              <MessageSquarePlus className="size-3.5" /> Write the First Review
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
