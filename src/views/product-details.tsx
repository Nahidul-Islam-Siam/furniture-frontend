"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useGetProductsQuery,
  IProductItem,
} from "@/redux/service/productApi";
import { useGetPublicReviewsQuery } from "@/redux/service/reviewApi";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/gridData";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  CheckCircle2,
  ChevronRight,
  Share2,
  PackageCheck,
  Ruler,
  Layers,
  Clock,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface ProductDetailsViewProps {
  slug: string;
  category?: string;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  slug,
  category: urlCategory,
}) => {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  // Try fetching by slug first
  const { data: slugData, isLoading: isSlugLoading } =
    useGetProductBySlugQuery(slug);

  // Fallback to fetch by ID if slug is a 24-char ObjectId
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);
  const { data: idData, isLoading: isIdLoading } = useGetProductByIdQuery(
    slug,
    { skip: !isMongoId || Boolean(slugData?.data) }
  );

  const product: IProductItem | undefined =
    slugData?.data || idData?.data;
  const isLoading = isSlugLoading || (isMongoId && isIdLoading);

  // Related products from same category or general catalog
  const { data: relatedData } = useGetProductsQuery({ limit: 4 });

  // Reviews query
  const { data: reviewsData } = useGetPublicReviewsQuery();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping">(
    "desc"
  );

  const images = useMemo(() => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    return [
      "https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385",
    ];
  }, [product]);

  const currentImage = images[selectedImageIndex] || images[0];

  const categoryName = useMemo(() => {
    if (!product) return urlCategory || "Collection";
    if (typeof product.category === "object" && product.category?.name) {
      return product.category.name;
    }
    return urlCategory || "Furniture";
  }, [product, urlCategory]);

  const categorySlug = useMemo(() => {
    if (typeof product?.category === "object" && product.category?.slug) {
      return product.category.slug;
    }
    return urlCategory?.toLowerCase() || "all";
  }, [product, urlCategory]);

  // Convert to Cart Context Product structure
  const cartProduct: Product | null = useMemo(() => {
    if (!product) return null;
    return {
      id: product._id,
      title: product.name,
      category: categoryName as any,
      link: `/products/${product.slug || product._id}`,
      priceNumber: product.price,
      priceText: `Tk ${product.price.toLocaleString("en-BD")}.00`,
      originalPrice: product.discountPrice
        ? `Tk ${product.discountPrice.toLocaleString("en-BD")}.00`
        : undefined,
      images,
      rating: product.rating || 5,
      description: product.description,
      inStock: product.isAvailable ?? product.stock > 0,
      tag: product.isFeatured ? "Featured" : undefined,
    };
  }, [product, categoryName, images]);

  const handleAddToCart = () => {
    if (!cartProduct) return;
    addToCart(cartProduct, quantity);
    toast.success(`Added ${quantity} × ${product?.name} to cart`);
  };

  const handleBuyNow = () => {
    if (!cartProduct) return;
    addToCart(cartProduct, quantity);
    setIsCartOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "GRID Furniture",
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />
          <p className="text-sm text-neutral-500 font-medium">
            Loading craftsmanship details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold font-heading text-neutral-900 mb-3">
          Product Not Found
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          The requested furniture item may have been updated or moved to another
          collection.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition"
        >
          Browse All Collections
        </Link>
      </div>
    );
  }

  const discountPercent =
    product.discountPrice && product.discountPrice > product.price
      ? Math.round(
          ((product.discountPrice - product.price) / product.discountPrice) * 100
        )
      : 0;

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-neutral-100 bg-neutral-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <Link href="/collections" className="hover:text-black transition">
            Collections
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <Link
            href={`/collections/${categorySlug}`}
            className="hover:text-black transition capitalize"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-900 font-medium truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Hero Main Image View */}
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-sm group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-black px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="inline-block rounded-full bg-[#C53030] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                    Save {discountPercent}%
                  </span>
                )}
                {product.stock <= 0 && (
                  <span className="inline-block rounded-full bg-neutral-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                    Made to Order
                  </span>
                )}
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-700 shadow-md hover:bg-black hover:text-white transition"
                title="Share this product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-black ring-2 ring-black/10 scale-95"
                        : "border-neutral-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Delivery & Assembly Value Card */}
            <div className="hidden lg:grid grid-cols-3 gap-4 pt-6 border-t border-neutral-100">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <Truck className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    White Glove Delivery
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Free Dhaka delivery & on-site assembly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <ShieldCheck className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    5-Year Warranty
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Structural frame & lifting motor covered
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                <RotateCcw className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    7-Day Replacement
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Hassle-free return & defect exchange
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Buying Information & Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {categoryName}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-amber-500">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(product.rating || 5)
                            ? "fill-current text-amber-400"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-neutral-800">
                    {(product.rating || 5).toFixed(1)}
                  </span>
                  <span className="text-neutral-400">
                    ({product.numReviews || 12} Verified Reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-extrabold text-neutral-900 font-sans tracking-tight">
                  Tk {product.price.toLocaleString("en-BD")}.00
                </span>
                {product.discountPrice && (
                  <span className="text-base text-neutral-400 line-through">
                    Tk {product.discountPrice.toLocaleString("en-BD")}.00
                  </span>
                )}
                {product.sku && (
                  <span className="text-xs text-neutral-400 ml-auto font-mono">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* In-Stock Stock Indicator */}
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3.5 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {product.stock > 0
                    ? `In Stock (${product.stock} units ready in Dhaka warehouse)`
                    : "Available for custom fabrication & fast shipping"}
                </span>
              </div>

              {/* Description Excerpt */}
              <p className="text-sm text-neutral-600 leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Color / Variant Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="pt-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Finish & Color:{" "}
                    <span className="text-neutral-500 font-normal">
                      {selectedColor || product.colors[0]}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                          (selectedColor || product.colors?.[0]) === c
                            ? "border-black bg-black text-white"
                            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Material Highlights */}
              {product.material && (
                <div className="pt-2 flex items-center gap-2 text-xs text-neutral-600">
                  <Layers className="w-4 h-4 text-neutral-400" />
                  <span>
                    Crafted with <strong>{product.material}</strong>
                  </span>
                </div>
              )}

              {/* Dimensions */}
              {product.dimensions && (
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Ruler className="w-4 h-4 text-neutral-400" />
                  <span>
                    Dimensions: {product.dimensions.width || "-"}&quot; W ×{" "}
                    {product.dimensions.depth || "-"}&quot; D ×{" "}
                    {product.dimensions.height || "-"}&quot; H
                  </span>
                </div>
              )}

              {/* Quantity Selector & Add to Cart */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-200 rounded-full bg-neutral-50 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-neutral-600 hover:text-black transition rounded-full hover:bg-white"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2 text-neutral-600 hover:text-black transition rounded-full hover:bg-white"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-6 rounded-full bg-white border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-full bg-black text-white font-bold text-sm hover:bg-neutral-800 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Buy It Now
                </button>
              </div>

              {/* Supported payment badges */}
              <div className="pt-2 text-center text-[11px] text-neutral-400">
                Guaranteed safe checkout via SSLCommerz, bKash, Nagad, Visa & COD
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Details / Specs / Shipping */}
        <div className="mt-16 sm:mt-24 border-t border-neutral-200 pt-10">
          <div className="flex items-center justify-center gap-4 sm:gap-8 border-b border-neutral-100 pb-4">
            <button
              onClick={() => setActiveTab("desc")}
              className={`text-sm sm:text-base font-bold pb-2 border-b-2 transition ${
                activeTab === "desc"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Description & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`text-sm sm:text-base font-bold pb-2 border-b-2 transition ${
                activeTab === "specs"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Specifications & Material
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`text-sm sm:text-base font-bold pb-2 border-b-2 transition ${
                activeTab === "shipping"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Delivery & Warranty
            </button>
          </div>

          <div className="max-w-4xl mx-auto py-8 text-neutral-700 leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <p>
                  Every piece in the {categoryName} collection is designed to
                  balance ergonomic functionality with Scandinavian minimalist
                  aesthetics. Handcrafted with high-density materials, contract-grade
                  connectors, and durable surfaces engineered to resist everyday wear,
                  spills, and scratches.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm pt-2 text-neutral-600">
                  <li>Engineered for high-productivity executive and home office spaces.</li>
                  <li>Clean wire management and stable architectural framework.</li>
                  <li>Smooth bevelled edges for tactile comfort during long work sessions.</li>
                </ul>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <div className="text-xs text-neutral-400 font-semibold uppercase">
                    Primary Material
                  </div>
                  <div className="font-bold text-neutral-900">
                    {product.material || "High-grade Engineered Wood & Steel"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <div className="text-xs text-neutral-400 font-semibold uppercase">
                    Dimensions
                  </div>
                  <div className="font-bold text-neutral-900">
                    {product.dimensions
                      ? `${product.dimensions.width || 0}" W × ${product.dimensions.depth || 0}" D × ${product.dimensions.height || 0}" H`
                      : 'Standard Architectural Fit'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <div className="text-xs text-neutral-400 font-semibold uppercase">
                    Weight
                  </div>
                  <div className="font-bold text-neutral-900">
                    {product.weight ? `${product.weight} kg` : "Heavy-duty stability"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <div className="text-xs text-neutral-400 font-semibold uppercase">
                    Assembly
                  </div>
                  <div className="font-bold text-neutral-900">
                    Included free of charge in Dhaka Metropolitan Area
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <PackageCheck className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900">Dhaka White-Glove Delivery</h4>
                    <p className="text-neutral-500">
                      Delivered by GRID expert logistics personnel within 2-4 business days. Assembly is handled directly in your space.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900">Outside Dhaka Shipping</h4>
                    <p className="text-neutral-500">
                      Shipped securely via dedicated courier with heavy-duty crating. Standard delivery is 4-7 business days across Bangladesh.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900">5-Year Structural Frame Warranty</h4>
                    <p className="text-neutral-500">
                      Covers internal welds, motor electronics, and frame alignment.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedData?.data && relatedData.data.length > 0 && (
          <div className="mt-20 border-t border-neutral-200 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-black text-2xl text-neutral-900">
                You May Also Like
              </h2>
              <Link
                href="/collections"
                className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black flex items-center gap-1"
              >
                View Catalog <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedData.data
                .filter((p) => p._id !== product._id)
                .slice(0, 4)
                .map((rel) => (
                  <Link
                    key={rel._id}
                    href={`/products/${rel.slug || rel._id}`}
                    className="group block rounded-xl overflow-hidden"
                  >
                    <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200/60 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          rel.images?.[0] ||
                          "https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385"
                        }
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-2.5">
                      <h4 className="text-xs font-semibold text-neutral-800 group-hover:text-black line-clamp-1">
                        {rel.name}
                      </h4>
                      <p className="text-xs font-bold text-neutral-900 mt-1">
                        Tk {rel.price.toLocaleString("en-BD")}.00
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsView;

