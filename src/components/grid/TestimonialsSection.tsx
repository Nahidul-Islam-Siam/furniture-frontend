"use client";

import { useState } from "react";
import { TESTIMONIALS } from "../../data/gridData";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionHeading } from "./MotionHeading";
import {
  useGetPublicReviewsQuery,
  useCreateReviewMutation,
} from "@/redux/service/reviewApi";
import { useAppSelector } from "@/redux";
import toast from "react-hot-toast";

export const TestimonialsSection = () => {
  const { data: reviewsResponse, isLoading } = useGetPublicReviewsQuery();
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
  const { user } = useAppSelector((state) => state.auth);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const liveReviews = reviewsResponse?.data || [];

  // Map live reviews to display format or fallback to mock TESTIMONIALS
  const displayItems =
    liveReviews.length > 0
      ? liveReviews.map((r) => ({
          name: r.customerName,
          role: r.title || "Verified Customer",
          company: "Furniture Buyer",
          avatar:
            r.userId?.avatar?.url ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              r.customerName
            )}`,
          quote: r.comment,
          rating: r.rating || 5,
        }))
      : TESTIMONIALS;

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((p) => (p === 0 ? displayItems.length - 1 : p - 1));
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((p) => (p === displayItems.length - 1 ? 0 : p + 1));
  };

  const current = displayItems[currentIndex] || displayItems[0];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!comment.trim() || comment.trim().length < 3) {
      toast.error("Review comment must be at least 3 characters long");
      return;
    }

    try {
      await createReview({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      }).unwrap();

      toast.success("Thank you! Your review has been submitted.");
      setIsModalOpen(false);
      setComment("");
      setTitle("");
      setRating(5);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to submit review"
      );
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-neutral-50/60 border-b border-neutral-100 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title with MotionHeading */}
        <div className="mb-10">
          <MotionHeading
            tag="h2"
            className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-2"
          >
            Don&apos;t take our word for it
          </MotionHeading>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: [0.26, 0.54, 0.32, 1],
            }}
            className="text-xs sm:text-sm text-neutral-500 font-sans"
          >
            Trusted by Bangladesh&apos;s top entrepreneurs, architects & modern homeowners
          </motion.p>
        </div>

        {/* Carousel Card with Smooth Slide Animations */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-neutral-100 max-w-3xl mx-auto min-h-[300px] flex flex-col justify-between overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.45, ease: [0.26, 0.54, 0.32, 1] }}
              className="space-y-6"
            >
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 text-amber-500">
                {[...Array(current?.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-sans text-lg sm:text-2xl text-neutral-800 font-normal leading-relaxed italic max-w-2xl mx-auto">
                &ldquo;{current?.quote}&rdquo;
              </blockquote>

              {/* Author Details with Avatar */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current?.avatar}
                  alt={current?.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-neutral-100 shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="text-left">
                  <h4 className="font-heading font-bold text-base text-neutral-900">
                    {current?.name}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-neutral-500">
                    {current?.role}
                    {current?.company ? `, ${current.company}` : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-between absolute inset-y-1/2 -inset-x-5 sm:-inset-x-6 pointer-events-none">
            <button
              onClick={prev}
              className="pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-700 hover:text-black hover:scale-105 transition-all active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-neutral-200 text-neutral-700 hover:text-black hover:scale-105 transition-all active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Dots & Leave a Review button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            {displayItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-8 bg-neutral-900"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (user) {
                setCustomerName(user.name || "");
                setCustomerEmail(user.email || "");
              }
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm hover:border-black hover:text-black transition"
          >
            <MessageSquarePlus className="w-4 h-4 text-primary" />
            Share Your Experience
          </button>
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading text-xl font-bold text-neutral-900 mb-1">
              Write a Review
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Share your feedback regarding our craftsmanship and delivery experience.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
              {/* Rating Star Picker */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-neutral-500 ml-2 font-medium">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Shakib Ahmed"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="shakib@example.com"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exceptional Oak Finish & Quick Assembly"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your experience with the furniture, build quality, and delivery..."
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white shadow hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
