"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useGetProductsQuery,
  IProductItem,
} from "@/redux/service/productApi";
import { useGetPublicReviewsQuery } from "@/redux/service/reviewApi";
import { useCart } from "@/context/CartContext";
import { ALL_PRODUCTS, Product } from "@/data/gridData";
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
  ChevronLeft,
  Share2,
  PackageCheck,
  Ruler,
  Layers,
  Clock,
  Sparkles,
  Maximize2,
  MessageCircle,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ProductDetailsViewProps {
  slug: string;
  category?: string;
}

interface NormalizedProduct {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  images: string[];
  sellingPrice: number;
  compareAtPrice?: number;
  discountPercent: number;
  badgeText?: string;
  sku?: string;
  stockCount: number | null;
  inStock: boolean;
  isFeatured: boolean;
  rating: number;
  numReviews?: number;
  features: string[];
  material?: string;
  colors: string[];
  dimensions?: IProductItem["dimensions"];
  weight?: number;
  isFromBackend: boolean;
}

const FALLBACK_IMAGE =
  "https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385";

function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePriceNumber(priceText?: string): number | undefined {
  if (!priceText) return undefined;
  const cleaned = priceText.replace(/[^0-9.]/g, "");
  if (!cleaned) return undefined;
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function extractSlugFromLink(link: string, fallbackId: string): string {
  const parts = link.split("/").filter(Boolean);
  return parts[parts.length - 1] || fallbackId;
}

function findStaticProductBySlug(slug: string): Product | undefined {
  const target = slug.toLowerCase().trim();
  return ALL_PRODUCTS.find((item) => {
    const linkSlug = extractSlugFromLink(item.link, item.id).toLowerCase();
    return (
      linkSlug === target ||
      item.id.toLowerCase() === target ||
      slugifyTitle(item.title) === target
    );
  });
}

function formatTk(amount: number): string {
  return `Tk ${amount.toLocaleString("en-BD")}.00`;
}

function renderRichDescription(text: string): string {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  html = html.replace(
    /^### (.*$)/gim,
    '<h3 class="text-base font-bold text-neutral-900 mt-4 mb-1.5">$1</h3>'
  );
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-lg font-bold text-neutral-900 mt-5 mb-2 pb-1 border-b border-stone-200">$1</h2>'
  );
  html = html.replace(
    /\*\*(.*?)\*\*/gim,
    '<strong class="font-semibold text-neutral-900">$1</strong>'
  );
  html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');
  html = html.replace(/__(.*?)__/gim, '<u class="underline">$1</u>');
  html = html.replace(
    /^&gt; (.*$)/gim,
    '<blockquote class="border-l-2 border-neutral-900 pl-3.5 py-1 my-2.5 bg-stone-50 text-stone-700 italic">$1</blockquote>'
  );
  html = html.replace(
    /^\s*-\s+(.*$)/gim,
    '<li class="list-disc ml-5 my-0.5">$1</li>'
  );
  html = html.replace(
    /^\s*\*\s+(.*$)/gim,
    '<li class="list-disc ml-5 my-0.5">$1</li>'
  );
  html = html.replace(/\n{2,}/g, '</p><p class="my-2">');
  return `<p class="my-1">${html}</p>`;
}

function normalizeProductData(
  slug: string,
  dbProduct?: IProductItem,
  staticProduct?: Product,
  urlCategory?: string
): NormalizedProduct | null {
  if (dbProduct) {
    const categoryName =
      typeof dbProduct.category === "object" && dbProduct.category?.name
        ? dbProduct.category.name
        : staticProduct?.category || urlCategory || "Furniture";

    const categorySlug =
      typeof dbProduct.category === "object" && dbProduct.category?.slug
        ? dbProduct.category.slug
        : (
            staticProduct?.category ||
            urlCategory ||
            "all"
          ).toLowerCase();

    const basePrice = dbProduct.price || staticProduct?.priceNumber || 0;
    const altPrice = dbProduct.discountPrice;

    // Supports both conventions: discountPrice < price (sale) and discountPrice > price (compare-at)
    const hasLowerSale =
      typeof altPrice === "number" && altPrice > 0 && altPrice < basePrice;
    const hasHigherCompare =
      typeof altPrice === "number" && altPrice > basePrice;

    const sellingPrice = hasLowerSale ? altPrice : basePrice;
    const compareAtPrice = hasLowerSale
      ? basePrice
      : hasHigherCompare
      ? altPrice
      : parsePriceNumber(staticProduct?.originalPrice);

    const discountPercent =
      compareAtPrice && compareAtPrice > sellingPrice
        ? Math.round(((compareAtPrice - sellingPrice) / compareAtPrice) * 100)
        : 0;

    const images =
      dbProduct.images && dbProduct.images.length > 0
        ? dbProduct.images
        : staticProduct?.images && staticProduct.images.length > 0
        ? staticProduct.images
        : [FALLBACK_IMAGE];

    return {
      id: dbProduct._id,
      slug: dbProduct.slug || slug,
      name: dbProduct.name,
      categoryName,
      categorySlug,
      description: dbProduct.description || staticProduct?.description || "",
      images,
      sellingPrice,
      compareAtPrice,
      discountPercent,
      badgeText:
        discountPercent > 0
          ? `Save ${discountPercent}%`
          : staticProduct?.tag,
      sku: dbProduct.sku,
      stockCount: typeof dbProduct.stock === "number" ? dbProduct.stock : null,
      inStock: dbProduct.isAvailable ?? dbProduct.stock > 0,
      isFeatured: Boolean(dbProduct.isFeatured),
      rating: dbProduct.rating || staticProduct?.rating || 5,
      numReviews: dbProduct.numReviews,
      features: staticProduct?.features || [],
      material: dbProduct.material,
      colors: dbProduct.colors || [],
      dimensions: dbProduct.dimensions,
      weight: dbProduct.weight,
      isFromBackend: true,
    };
  }

  if (staticProduct) {
    const compareAtPrice = parsePriceNumber(staticProduct.originalPrice);
    const sellingPrice = staticProduct.priceNumber;
    const discountPercent =
      compareAtPrice && compareAtPrice > sellingPrice
        ? Math.round(((compareAtPrice - sellingPrice) / compareAtPrice) * 100)
        : 0;

    return {
      id: staticProduct.id,
      slug: extractSlugFromLink(staticProduct.link, staticProduct.id),
      name: staticProduct.title,
      categoryName: staticProduct.category,
      categorySlug: staticProduct.category.toLowerCase(),
      description: staticProduct.description,
      images:
        staticProduct.images.length > 0
          ? staticProduct.images
          : [FALLBACK_IMAGE],
      sellingPrice,
      compareAtPrice,
      discountPercent,
      badgeText: staticProduct.tag,
      stockCount: null,
      inStock: staticProduct.inStock,
      isFeatured: staticProduct.rating >= 5 && staticProduct.inStock,
      rating: staticProduct.rating || 5,
      features: staticProduct.features || [],
      colors: [],
      isFromBackend: false,
    };
  }

  return null;
}

interface ProductLightboxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  productName: string;
}

const ProductLightboxDialog: React.FC<ProductLightboxDialogProps> = ({
  isOpen,
  onClose,
  images,
  activeIndex,
  onChangeIndex,
  productName,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Mandatory Safari light-dismiss fallback when `closedby` is unsupported
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if ("closedBy" in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;
      const rect = contentRef.current?.getBoundingClientRect();
      if (!rect) return;
      const isInsideContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInsideContent) {
        dialog.close();
      }
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [isOpen]);

  const handleCycle = (direction: 1 | -1) => {
    if (images.length <= 1) return;
    onChangeIndex((activeIndex + direction + images.length) % images.length);
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as Record<string, string>)}
      aria-label={`${productName} image viewer`}
      onClose={onClose}
      className="m-auto max-w-4xl w-[92vw] rounded-2xl bg-white p-0 shadow-2xl border border-stone-200 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div ref={contentRef} className="relative bg-white p-4 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 truncate pr-4">
            {productName} — View {activeIndex + 1} of {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="h-8 w-8 rounded-full border border-stone-200 bg-white text-neutral-700 hover:bg-neutral-900 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative mt-4 flex items-center justify-center bg-stone-50 rounded-xl overflow-hidden min-h-[320px] max-h-[75vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIndex] || images[0]}
            alt={`${productName} detailed angle ${activeIndex + 1}`}
            fetchPriority="low"
            className="max-h-[72vh] w-auto object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => handleCycle(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 border border-stone-200 shadow-md text-neutral-900 hover:bg-black hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleCycle(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 border border-stone-200 shadow-md text-neutral-900 hover:bg-black hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
};

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  slug,
  category: urlCategory,
}) => {
  const { addToCart, setIsCartOpen } = useCart();

  // Backend lookup by slug, or by Mongo ObjectId when applicable
  const { data: slugData, isLoading: isSlugLoading } =
    useGetProductBySlugQuery(slug);

  const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);
  const { data: idData, isLoading: isIdLoading } = useGetProductByIdQuery(
    slug,
    { skip: !isMongoId || Boolean(slugData?.data) }
  );

  // Catalog fallback ensures static showcase links resolve seamlessly without 404s
  const staticProduct = useMemo(() => findStaticProductBySlug(slug), [slug]);
  const dbProduct: IProductItem | undefined = slugData?.data || idData?.data;

  const product = useMemo(
    () => normalizeProductData(slug, dbProduct, staticProduct, urlCategory),
    [slug, dbProduct, staticProduct, urlCategory]
  );

  const isLoading =
    !product && (isSlugLoading || (isMongoId && isIdLoading));

  // Related products & approved reviews
  const { data: relatedData } = useGetProductsQuery({ limit: 8 });
  const { data: reviewsData } = useGetPublicReviewsQuery({ limit: 4 });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping">(
    "desc"
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset local interaction state when navigating between products
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setSelectedColor("");
    setActiveTab("desc");
    setIsLightboxOpen(false);
  }, [slug]);

  const activeColor =
    selectedColor || (product?.colors.length ? product.colors[0] : "");

  const cartProduct: Product | null = useMemo(() => {
    if (!product) return null;
    const variantTitle = activeColor
      ? `${product.name} (${activeColor})`
      : product.name;
    return {
      id: activeColor ? `${product.id}-${activeColor}` : product.id,
      title: variantTitle,
      category: product.categoryName as Product["category"],
      link: `/products/${product.slug}`,
      priceNumber: product.sellingPrice,
      priceText: formatTk(product.sellingPrice),
      originalPrice: product.compareAtPrice
        ? formatTk(product.compareAtPrice)
        : undefined,
      images: product.images,
      rating: product.rating,
      description: product.description,
      features: product.features,
      inStock: product.inStock,
      tag: product.badgeText,
    };
  }, [product, activeColor]);

  // Merge live backend related products with same-category catalog pieces
  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const collected: {
      id: string;
      slug: string;
      name: string;
      price: number;
      compareAtPrice?: number;
      primaryImage: string;
      badge?: string;
    }[] = [];

    const seenKeys = new Set<string>([
      product.id.toLowerCase(),
      product.slug.toLowerCase(),
      product.name.toLowerCase(),
    ]);

    const backendItems = relatedData?.data || [];
    for (const item of backendItems) {
      const itemSlug = item.slug || item._id;
      if (
        seenKeys.has(item._id.toLowerCase()) ||
        seenKeys.has(itemSlug.toLowerCase()) ||
        seenKeys.has(item.name.toLowerCase())
      ) {
        continue;
      }
      seenKeys.add(item._id.toLowerCase());
      seenKeys.add(itemSlug.toLowerCase());
      seenKeys.add(item.name.toLowerCase());

      collected.push({
        id: item._id,
        slug: itemSlug,
        name: item.name,
        price: item.price,
        compareAtPrice:
          item.discountPrice && item.discountPrice > item.price
            ? item.discountPrice
            : undefined,
        primaryImage: item.images?.[0] || FALLBACK_IMAGE,
      });
    }

    const staticCategoryPeers = ALL_PRODUCTS.filter(
      (p) =>
        p.category.toLowerCase() === product.categorySlug ||
        product.categoryName.toLowerCase().includes(p.category.toLowerCase())
    );
    const orderedStatic = [
      ...staticCategoryPeers,
      ...ALL_PRODUCTS.filter((p) => !staticCategoryPeers.includes(p)),
    ];

    for (const item of orderedStatic) {
      if (collected.length >= 4) break;
      const itemSlug = extractSlugFromLink(item.link, item.id);
      if (
        seenKeys.has(item.id.toLowerCase()) ||
        seenKeys.has(itemSlug.toLowerCase()) ||
        seenKeys.has(item.title.toLowerCase())
      ) {
        continue;
      }
      seenKeys.add(item.id.toLowerCase());
      seenKeys.add(itemSlug.toLowerCase());
      seenKeys.add(item.title.toLowerCase());

      collected.push({
        id: item.id,
        slug: itemSlug,
        name: item.title,
        price: item.priceNumber,
        compareAtPrice: parsePriceNumber(item.originalPrice),
        primaryImage: item.images[0] || FALLBACK_IMAGE,
        badge: item.tag,
      });
    }

    return collected.slice(0, 4);
  }, [product, relatedData]);

  const handleAddToCart = () => {
    if (!cartProduct) return;
    addToCart(cartProduct, quantity);
    toast.success(`Added ${quantity} × ${cartProduct.title} to cart`);
  };

  const handleBuyNow = () => {
    if (!cartProduct) return;
    addToCart(cartProduct, quantity);
    setIsCartOpen(true);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "Unique Engineering & Furniture",
          url: window.location.href,
        });
        return;
      } catch {
        // User dismissed share sheet; avoid overwriting clipboard
        return;
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard");
    }
  };

  const cycleMainImage = (direction: 1 | -1) => {
    if (!product || product.images.length <= 1) return;
    setSelectedImageIndex(
      (prev) => (prev + direction + product.images.length) % product.images.length
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 animate-pulse">
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-stone-100" />
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl bg-stone-100" />
              <div className="w-20 h-20 rounded-xl bg-stone-100" />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-5 pt-2">
            <div className="h-4 w-28 rounded bg-stone-100" />
            <div className="h-9 w-4/5 rounded bg-stone-200" />
            <div className="h-8 w-44 rounded bg-stone-100" />
            <div className="h-24 w-full rounded-xl bg-stone-100" />
            <div className="h-12 w-full rounded-xl bg-stone-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 mb-2">
          Catalog Lookup
        </p>
        <h1 className="text-3xl font-bold font-heading text-neutral-900 mb-3">
          Product Not Found
        </h1>
        <p className="text-sm text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
          The requested furniture piece may have been archived or moved to another
          collection.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-black no-underline transition-colors"
        >
          Browse All Collections
        </Link>
      </div>
    );
  }

  const currentImage =
    product.images[selectedImageIndex] || product.images[0] || FALLBACK_IMAGE;
  const approvedReviews = (reviewsData?.data || []).filter(
    (rev) => !rev.status || rev.status === "approved"
  );
  const whatsappUrl = `https://wa.me/8801755348053?text=${encodeURIComponent(
    `Hello Unique Engineering & Furniture, I would like details or a custom quote for: ${product.name}`
  )}`;

  const ratingSummary = (
    <>
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.round(product.rating)
                ? "fill-current"
                : "text-stone-300"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="font-semibold text-neutral-900">
        {product.rating.toFixed(1)}
      </span>
      <span className="text-stone-400">
        (
        {approvedReviews.length > 0
          ? approvedReviews.length
          : product.numReviews || "Verified"}
        )
      </span>
    </>
  );

  const tabs: { id: "desc" | "specs" | "shipping"; label: string }[] = [
    { id: "desc", label: "Craftsmanship & Details" },
    { id: "specs", label: "Specifications" },
    { id: "shipping", label: "Delivery & Warranty" },
  ];

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(tabs[(idx + 1) % tabs.length].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].id);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-28 lg:pb-24 font-sans text-neutral-900">
      {/* Subtle Editorial Breadcrumb Strip */}
      <div className="border-b border-stone-200/70 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-stone-500 flex-wrap"
          >
            <Link href="/" className="hover:text-black no-underline transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" aria-hidden="true" />
            <Link
              href="/collections"
              className="hover:text-black no-underline transition-colors"
            >
              Collections
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" aria-hidden="true" />
            <Link
              href={`/collections/${product.categorySlug}`}
              className="hover:text-black no-underline transition-colors capitalize"
            >
              {product.categoryName}
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400" aria-hidden="true" />
            <span className="text-neutral-900 font-medium truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </nav>

          <Link
            href={`/collections/${product.categorySlug}`}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-black no-underline transition-colors shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to {product.categoryName}</span>
          </Link>
        </div>
      </div>

      {/* Main Split Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-10 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Gallery & Value Guarantees (7 Cols) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <div className="relative aspect-[4/4.2] sm:aspect-square w-full rounded-2xl overflow-hidden bg-[#f7f6f2] border border-stone-200/80 group">
              {/* Primary Hero LCP Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={`${product.name} - angle ${selectedImageIndex + 1}`}
                fetchPriority="high"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              />

              {/* Top-left Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {product.badgeText && (
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm ${
                      product.badgeText.toLowerCase().includes("sold")
                        ? "bg-neutral-900"
                        : "bg-[#C53030]"
                    }`}
                  >
                    {product.badgeText}
                  </span>
                )}
                {product.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900/90 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    <span>Featured</span>
                  </span>
                )}
                {!product.inStock && (
                  <span className="inline-block rounded-full bg-stone-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
                    Made to Order
                  </span>
                )}
              </div>

              {/* Top-right Share Action */}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share this product"
                title="Share this product"
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 text-neutral-700 shadow-sm hover:bg-neutral-900 hover:text-white flex items-center justify-center cursor-pointer transition-colors z-10"
              >
                <Share2 className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Multi-angle Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => cycleMainImage(-1)}
                    aria-label="Previous image"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200/80 text-neutral-800 shadow-sm hover:bg-neutral-900 hover:text-white flex items-center justify-center cursor-pointer transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => cycleMainImage(1)}
                    aria-label="Next image"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200/80 text-neutral-800 shadow-sm hover:bg-neutral-900 hover:text-white flex items-center justify-center cursor-pointer transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </>
              )}

              {/* Bottom-right Zoom Pill */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="Inspect full-screen image"
                className="absolute bottom-4 right-4 h-9 px-3.5 rounded-full bg-white/92 backdrop-blur-md border border-stone-200/90 text-xs font-semibold text-neutral-800 hover:bg-neutral-900 hover:text-white shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-colors z-10"
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Zoom view</span>
              </button>
            </div>

            {/* Thumbnail Navigation Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`Select angle ${idx + 1}`}
                    aria-pressed={selectedImageIndex === idx}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-[#f7f6f2] shrink-0 cursor-pointer transition-all ${
                      selectedImageIndex === idx
                        ? "border-neutral-900 ring-2 ring-neutral-900/10"
                        : "border-stone-200 opacity-75 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Studio Value Guarantees (Desktop) */}
            <div className="hidden lg:grid grid-cols-3 gap-3.5 pt-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fafaf8] border border-stone-200/75">
                <Truck className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 m-0">
                    Dhaka White-Glove
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 mb-0 leading-snug">
                    Home delivery &amp; on-site installation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fafaf8] border border-stone-200/75">
                <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 m-0">
                    5-Year Warranty
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 mb-0 leading-snug">
                    Frame structure &amp; mechanism support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fafaf8] border border-stone-200/75">
                <RotateCcw className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 m-0">
                    7-Day Replacement
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 mb-0 leading-snug">
                    Covered defect &amp; transit replacement
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Buy Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              {/* Category Eyebrow & Rating Summary */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Link
                  href={`/collections/${product.categorySlug}`}
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-800 bg-cyan-50/80 border border-cyan-200/60 px-2.5 py-1 rounded-full no-underline hover:bg-cyan-100/80 transition-colors"
                >
                  {product.categoryName} Collection
                </Link>

                {approvedReviews.length > 0 ? (
                  <a
                    href="#reviews-section"
                    className="inline-flex items-center gap-1.5 text-xs no-underline hover:opacity-80 transition-opacity"
                  >
                    {ratingSummary}
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs">
                    {ratingSummary}
                  </div>
                )}
              </div>

              {/* Product Title */}
              <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[32px] text-neutral-900 tracking-tight leading-[1.2] m-0">
                {product.name}
              </h1>

              {/* Pricing Stack */}
              <div className="pt-1 space-y-1.5">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-neutral-900 tracking-tight">
                    {formatTk(product.sellingPrice)}
                  </span>
                  {product.compareAtPrice &&
                    product.compareAtPrice > product.sellingPrice && (
                      <span className="text-base text-stone-400 line-through">
                        {formatTk(product.compareAtPrice)}
                      </span>
                    )}
                  {product.discountPercent > 0 && (
                    <span className="text-xs font-bold text-[#C53030] bg-red-50 border border-red-200/70 px-2 py-0.5 rounded-full">
                      Save {product.discountPercent}%
                    </span>
                  )}
                  {product.sku && (
                    <span className="text-[11px] text-stone-400 ml-auto font-mono">
                      SKU: {product.sku}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 m-0">
                  Direct factory pricing · Insured delivery across all 64 districts
                </p>
              </div>

              {/* Availability Status Strip */}
              {product.inStock ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-3.5 py-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>
                    {product.stockCount !== null && product.stockCount > 0
                      ? `In Stock (${product.stockCount} units ready in Dhaka warehouse)`
                      : "In Stock — Ready for Dhaka dispatch & assembly (2–4 business days)"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-50/90 border border-amber-200/80 px-3.5 py-2.5 rounded-xl">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
                  <span>
                    Made to Order / Pre-Order — Built in our factory (custom finish supported)
                  </span>
                </div>
              )}

              {/* Short Description */}
              {product.description && (
                <div
                  className="text-[14px] text-stone-600 leading-relaxed pt-1"
                  dangerouslySetInnerHTML={{
                    __html: renderRichDescription(product.description),
                  }}
                />
              )}

              {/* Key Engineering Highlights */}
              {product.features.length > 0 && (
                <div className="rounded-xl border border-stone-200/80 bg-[#fafaf8] p-4 space-y-2.5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
                    Key Engineering Highlights
                  </div>
                  <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-xs text-neutral-800 leading-snug"
                      >
                        <Check
                          className="w-3.5 h-3.5 text-cyan-700 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variant Selector */}
              {product.colors.length > 0 && (
                <div className="pt-1 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                    Finish &amp; Color:{" "}
                    <span className="text-stone-500 font-normal capitalize">
                      {activeColor}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const isSelected = activeColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          aria-pressed={isSelected}
                          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-stone-200 bg-white text-neutral-800 hover:border-neutral-400"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Material & Dimensions inline metadata */}
              {(product.material || product.dimensions) && (
                <div className="space-y-1.5 pt-1 border-t border-stone-100">
                  {product.material && (
                    <div className="flex items-center gap-2 text-xs text-stone-600 pt-2">
                      <Layers className="w-4 h-4 text-stone-400 shrink-0" aria-hidden="true" />
                      <span>
                        Material: <strong className="text-neutral-900">{product.material}</strong>
                      </span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <Ruler className="w-4 h-4 text-stone-400 shrink-0" aria-hidden="true" />
                      <span>
                        Dimensions:{" "}
                        <strong className="text-neutral-900">
                          {product.dimensions.width || "-"}&quot; W ×{" "}
                          {product.dimensions.depth || "-"}&quot; D ×{" "}
                          {product.dimensions.height || "-"}&quot; H
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Stepper & Purchase CTAs */}
              <div className="pt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    role="group"
                    aria-label="Quantity selector"
                    className="flex items-center border border-stone-300 rounded-xl bg-[#fafaf8] h-12 px-1"
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="h-9 w-9 text-neutral-700 hover:text-black hover:bg-white rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="h-9 w-9 text-neutral-700 hover:text-black hover:bg-white rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 h-12 px-6 rounded-xl bg-white border-[1.5px] border-neutral-900 text-neutral-900 font-semibold text-sm hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full h-12 px-6 rounded-xl bg-neutral-900 hover:bg-black text-white font-semibold text-sm cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                  <span>Buy It Now</span>
                </button>

                {/* Direct Factory WhatsApp Customization Inquiry */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 px-4 rounded-xl border border-stone-200 bg-[#fafaf8] hover:bg-stone-100 text-xs font-medium text-neutral-800 flex items-center justify-center gap-2 no-underline transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Request Custom Size or Corporate Quote via WhatsApp</span>
                </a>
              </div>

              {/* Payment & Trust Bar */}
              <div className="pt-1 text-center text-[11px] text-stone-400">
                Trusted checkout via SSLCommerz · bKash · Nagad · Cards · Cash on Delivery
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Details Tabs */}
        <section
          aria-label="Detailed product information"
          className="mt-16 sm:mt-24 border-t border-stone-200 pt-10"
        >
          <div
            role="tablist"
            aria-label="Product sections"
            className="flex items-center justify-center gap-5 sm:gap-10 border-b border-stone-200/80 overflow-x-auto"
          >
            {tabs.map((tab, idx) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`pb-3.5 text-sm sm:text-[15px] font-semibold whitespace-nowrap border-b-2 cursor-pointer transition-colors ${
                    selected
                      ? "border-neutral-900 text-neutral-900"
                      : "border-transparent text-stone-400 hover:text-neutral-800"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="max-w-4xl mx-auto py-8 text-stone-700 leading-relaxed"
          >
            {activeTab === "desc" && (
              <div className="space-y-5 text-sm sm:text-[15px]">
                {product.description && (
                  <div
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: renderRichDescription(product.description),
                    }}
                  />
                )}
                {product.features.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {product.features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-2.5 rounded-xl bg-[#fafaf8] border border-stone-200/70 px-4 py-3 text-sm text-neutral-800"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-cyan-700 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-stone-600 m-0">
                  Built to balance daily ergonomic posture support with clean architectural lines—crafted for studios, executive suites, and modern home setups across Bangladesh.
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-[#fafaf8] border border-stone-200/75 space-y-1">
                  <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                    Category
                  </div>
                  <div className="font-semibold text-neutral-900">
                    {product.categoryName}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#fafaf8] border border-stone-200/75 space-y-1">
                  <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                    Primary Material
                  </div>
                  <div className="font-semibold text-neutral-900">
                    {product.material || "Contract-Grade Frame & High-Density Components"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#fafaf8] border border-stone-200/75 space-y-1">
                  <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                    Dimensions
                  </div>
                  <div className="font-semibold text-neutral-900">
                    {product.dimensions
                      ? `${product.dimensions.width || "-"}" W × ${
                          product.dimensions.depth || "-"
                        }" D × ${product.dimensions.height || "-"}" H`
                      : "Standard Ergonomic Proportions (Custom sizing via WhatsApp)"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#fafaf8] border border-stone-200/75 space-y-1">
                  <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                    Warranty &amp; Assembly
                  </div>
                  <div className="font-semibold text-neutral-900">
                    {product.weight
                      ? `${product.weight} kg · Free Dhaka assembly`
                      : "Included free assembly inside Dhaka Metro"}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fafaf8] border border-stone-200/75">
                  <PackageCheck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-neutral-900 m-0">
                      Dhaka White-Glove Delivery &amp; Setup
                    </h4>
                    <p className="text-stone-600 mt-1 mb-0">
                      Dispatched by Unique Engineering &amp; Furniture logistics personnel within 2–4 business days with in-room assembly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fafaf8] border border-stone-200/75">
                  <Clock className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-neutral-900 m-0">
                      Nationwide 64-District Shipping
                    </h4>
                    <p className="text-stone-600 mt-1 mb-0">
                      Protective wooden crating for safe courier transit outside Dhaka (typically 4–7 business days).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#fafaf8] border border-stone-200/75">
                  <ShieldCheck className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-neutral-900 m-0">
                      Structural Frame Warranty &amp; Servicing
                    </h4>
                    <p className="text-stone-600 mt-1 mb-0">
                      Backed by our dedicated factory servicing team—covering structural welds, pneumatic lifts, and motorized mechanisms.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Customer Reviews Strip */}
        {approvedReviews.length > 0 && (
          <section
            id="reviews-section"
            aria-label="Customer reviews"
            className="mt-14 border-t border-stone-200 pt-12"
          >
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400 m-0">
                  Verified Feedback
                </p>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 mt-1 mb-0">
                  Client Impressions
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                <span>{product.rating.toFixed(1)} Average Satisfaction</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {approvedReviews.slice(0, 4).map((review) => (
                <div
                  key={review._id}
                  className="rounded-xl border border-stone-200/80 bg-[#fafaf8] p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? "fill-current" : "text-stone-300"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    {review.title && (
                      <h3 className="text-xs font-semibold text-neutral-900 m-0">
                        {review.title}
                      </h3>
                    )}
                    <p className="text-xs text-stone-600 leading-relaxed m-0 line-clamp-4">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                  <div className="text-[11px] font-medium text-neutral-800 pt-2 border-t border-stone-200/70">
                    {review.customerName}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products Recommendations */}
        {relatedProducts.length > 0 && (
          <section
            aria-label="You may also like"
            className="mt-16 border-t border-stone-200 pt-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400 m-0">
                  Explore More
                </p>
                <h2 className="font-heading font-bold text-2xl text-neutral-900 mt-1 mb-0">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/collections/${product.categorySlug}`}
                className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-black flex items-center gap-1 no-underline transition-colors"
              >
                <span>View {product.categoryName}</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="group block no-underline"
                >
                  <div className="aspect-square bg-[#f7f6f2] rounded-xl overflow-hidden border border-stone-200/70 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.primaryImage}
                      alt={rel.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {rel.badge && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-neutral-900/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        {rel.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <h4 className="text-xs sm:text-sm font-medium text-neutral-900 group-hover:text-black truncate m-0">
                      {rel.name}
                    </h4>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        {formatTk(rel.price)}
                      </span>
                      {rel.compareAtPrice && rel.compareAtPrice > rel.price && (
                        <span className="text-[11px] text-stone-400 line-through">
                          {formatTk(rel.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Quick Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 shadow-[0_-8px_24px_-8px_rgba(15,23,42,0.12)] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-stone-500 truncate">{product.name}</div>
          <div className="text-sm font-bold text-neutral-900">
            {formatTk(product.sellingPrice)}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="h-10 px-5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Add to Cart</span>
        </button>
      </div>

      {/* Light-Dismiss Product Image Viewer Dialog */}
      <ProductLightboxDialog
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={product.images}
        activeIndex={selectedImageIndex}
        onChangeIndex={setSelectedImageIndex}
        productName={product.name}
      />
    </div>
  );
};

export default ProductDetailsView;
