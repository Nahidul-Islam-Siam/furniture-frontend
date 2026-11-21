"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { ALL_PRODUCTS, FOOTER_PROMOTIONS, Product } from "@/data/gridData";
import {
  Star,
  Globe,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Share2,
  Maximize2,
  MessageCircle,
  Check,
  X,
  ShoppingBag,
  Copy,
  Truck,
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
  shortDesc?: string;
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
  isFreeDelivery?: boolean;
  deliveryInsideDhaka?: number;
  deliverySuburbs?: number;
  deliveryOutsideDhaka?: number;
  rating: number;
  numReviews?: number;
  features: string[];
  material?: string;
  brand?: string;
  warranty?: string;
  video?: string;
  colors: string[];
  sizes?: string[];
  specifications?: Record<string, any>;
  dimensions?: IProductItem["dimensions"];
  weight?: number;
}

const getColorHex = (name: string): string => {
  const lower = name.toLowerCase().trim();
  if (lower.includes("black") || lower.includes("dark") || lower.includes("কালো")) return "#171717";
  if (lower.includes("walnut") || lower.includes("brown") || lower.includes("বাদামী")) return "#5c3a21";
  if (lower.includes("oak") || lower.includes("wood")) return "#c8ad7f";
  if (lower.includes("oat") || lower.includes("beige") || lower.includes("অফ হোয়াইট")) return "#d4b996";
  if (lower.includes("grey") || lower.includes("gray") || lower.includes("graphite")) return "#374151";
  if (lower.includes("white") || lower.includes("সাদা")) return "#f9fafb";
  if (lower.includes("navy") || lower.includes("blue") || lower.includes("নীল")) return "#1e3a8a";
  if (lower.includes("green") || lower.includes("emerald") || lower.includes("সবুজ")) return "#064e3b";
  if (lower.includes("gold") || lower.includes("brass") || lower.includes("সোনালী")) return "#d97706";
  return "#475569";
};

const FALLBACK_IMAGE =
  "https://99grid.com/cdn/shop/files/cover-99grid-compressed_1400x.jpg?v=1767697385";
const LIFESTYLE_QUALITY_IMAGE =
  "https://99grid.com/cdn/shop/files/unnamed_600x.jpg?v=1652694957";

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
    '<h3 class="text-sm font-bold text-neutral-900 mt-4 mb-1.5">$1</h3>'
  );
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-base font-bold text-neutral-900 mt-5 mb-2 pb-1 border-b border-stone-200">$1</h2>'
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
  html = html.replace(/\n{2,}/g, '</p><p class="my-2.5">');
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

    // Supports both compare-at higher price and lower sale-price overrides
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
      isFreeDelivery: Boolean(dbProduct.isFreeDelivery),
      deliveryInsideDhaka: dbProduct.deliveryInsideDhaka,
      deliverySuburbs: dbProduct.deliverySuburbs,
      deliveryOutsideDhaka: dbProduct.deliveryOutsideDhaka,
      rating: dbProduct.rating || staticProduct?.rating || 5,
      numReviews: dbProduct.numReviews,
      features: staticProduct?.features || [],
      material: dbProduct.material,
      brand: dbProduct.brand,
      warranty: dbProduct.warranty,
      video: dbProduct.video,
      shortDesc: dbProduct.shortDesc,
      colors: dbProduct.colors || [],
      sizes: dbProduct.sizes || [],
      specifications: dbProduct.specifications,
      dimensions: dbProduct.dimensions,
      weight: dbProduct.weight,
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
      isFreeDelivery: Boolean(staticProduct.isFreeDelivery),
      deliveryInsideDhaka: staticProduct.deliveryInsideDhaka,
      deliverySuburbs: staticProduct.deliverySuburbs,
      deliveryOutsideDhaka: staticProduct.deliveryOutsideDhaka,
      rating: staticProduct.rating || 5,
      features: staticProduct.features || [],
      colors: [],
      sizes: [],
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

  // Safari light-dismiss fallback when `closedby` is unsupported
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
      aria-label={`${productName} full image viewer`}
      onClose={onClose}
      className="m-auto max-w-4xl w-[92vw] rounded-2xl bg-white p-0 shadow-2xl border border-stone-200 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div ref={contentRef} className="relative bg-white p-4 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 truncate pr-4">
            {productName} — Angle {activeIndex + 1} of {images.length}
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
            alt={`${productName} view ${activeIndex + 1}`}
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
  const router = useRouter();
  const { addToCart, buyNow, setIsCartOpen } = useCart();

  // Primary lookup via slug, with Mongo ObjectId fallback
  const { data: slugData, isLoading: isSlugLoading } =
    useGetProductBySlugQuery(slug);

  const isMongoId = /^[0-9a-fA-F]{24}$/.test(slug);
  const { data: idData, isLoading: isIdLoading } = useGetProductByIdQuery(
    slug,
    { skip: !isMongoId || Boolean(slugData?.data) }
  );

  // Catalog fallback guarantees seeded storefront links resolve immediately
  const staticProduct = useMemo(() => findStaticProductBySlug(slug), [slug]);
  const dbProduct: IProductItem | undefined = slugData?.data || idData?.data;

  const product = useMemo(
    () => normalizeProductData(slug, dbProduct, staticProduct, urlCategory),
    [slug, dbProduct, staticProduct, urlCategory]
  );

  const isLoading =
    !product && (isSlugLoading || (isMongoId && isIdLoading));

  const { data: relatedData } = useGetProductsQuery({ limit: 8 });
  const { data: reviewsData } = useGetPublicReviewsQuery({ limit: 4 });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset UI selections when switching product routes
  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setSelectedColor("");
    setSelectedSize("");
    setIsLightboxOpen(false);
  }, [slug]);

  // Parse colors (Format: "Name:Hex:ImageIndex" or "Name:Hex" or "Name")
  const parsedColors = useMemo(() => {
    if (!product?.colors || product.colors.length === 0) return [];
    return product.colors.map((colorStr, idx) => {
      if (colorStr.includes(":")) {
        const parts = colorStr.split(":");
        const name = parts[0]?.trim() || colorStr;
        const hex = parts[1]?.trim() || getColorHex(name);
        const imgIdx =
          parts[2] !== undefined && !isNaN(parseInt(parts[2], 10))
            ? parseInt(parts[2], 10)
            : idx < (product.images?.length || 0)
            ? idx
            : undefined;
        return { raw: colorStr, name, hex, imageIndex: imgIdx };
      }
      if (colorStr.startsWith("#")) {
        return {
          raw: colorStr,
          name: colorStr,
          hex: colorStr,
          imageIndex: idx < (product.images?.length || 0) ? idx : undefined,
        };
      }
      return {
        raw: colorStr,
        name: colorStr,
        hex: getColorHex(colorStr),
        imageIndex: idx < (product.images?.length || 0) ? idx : undefined,
      };
    });
  }, [product?.colors, product?.images]);

  const activeColorObj = parsedColors.length > 0
    ? (parsedColors.find((c) => c.name === selectedColor) || parsedColors[0])
    : null;
  const activeColor = activeColorObj?.name || "";

  const activeSize = product?.sizes && product.sizes.length > 0
    ? selectedSize || product.sizes[0]
    : "";

  const handleSelectColor = (c: { name: string; hex: string; imageIndex?: number }) => {
    setSelectedColor(c.name);
    if (
      c.imageIndex !== undefined &&
      c.imageIndex >= 0 &&
      c.imageIndex < (product?.images?.length || 0)
    ) {
      setSelectedImageIndex(c.imageIndex);
    }
  };

  const cartProduct: Product | null = useMemo(() => {
    if (!product) return null;
    const variantParts = [activeColor, activeSize].filter(Boolean);
    const variantSuffix = variantParts.length ? ` (${variantParts.join(" / ")})` : "";
    const variantTitle = `${product.name}${variantSuffix}`;
    const variantId = variantParts.length ? `${product.id}-${variantParts.join("-")}` : product.id;

    return {
      id: variantId,
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
      isFreeDelivery: product.isFreeDelivery,
      deliveryInsideDhaka: product.deliveryInsideDhaka,
      deliverySuburbs: product.deliverySuburbs,
      deliveryOutsideDhaka: product.deliveryOutsideDhaka,
      tag: product.badgeText,
    };
  }, [product, activeColor, activeSize]);

  // Collect 5 related items merging backend products and static category peers
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
      if (collected.length >= 5) break;
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

    const categoryPeers = ALL_PRODUCTS.filter(
      (p) =>
        p.category.toLowerCase() === product.categorySlug ||
        product.categoryName.toLowerCase().includes(p.category.toLowerCase())
    );
    const orderedStatic = [
      ...categoryPeers,
      ...ALL_PRODUCTS.filter((p) => !categoryPeers.includes(p)),
    ];

    for (const item of orderedStatic) {
      if (collected.length >= 5) break;
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

    return collected.slice(0, 5);
  }, [product, relatedData]);

  const handleAddToCart = () => {
    if (!cartProduct) return;
    addToCart(cartProduct, quantity);
    toast.success(`Added ${quantity} × ${cartProduct.title} to cart`);
  };

  const handleBuyNow = () => {
    if (!cartProduct) return;
    buyNow(cartProduct, quantity);
    router.push("/checkout");
  };

  const handleCopyLink = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard");
    }
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
        return;
      }
    }
    await handleCopyLink();
  };

  const cycleMainImage = (direction: 1 | -1) => {
    if (!product || product.images.length <= 1) return;
    setSelectedImageIndex(
      (prev) => (prev + direction + product.images.length) % product.images.length
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 animate-pulse">
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square w-full bg-stone-100" />
            <div className="flex gap-3 justify-center">
              <div className="w-16 h-16 bg-stone-100" />
              <div className="w-16 h-16 bg-stone-100" />
            </div>
          </div>
          <div className="lg:col-span-6 space-y-5 pt-2">
            <div className="h-8 w-3/4 bg-stone-200" />
            <div className="h-6 w-44 bg-stone-100" />
            <div className="h-12 w-full bg-stone-100" />
            <div className="h-12 w-full bg-stone-200" />
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
          The requested furniture piece may have been updated or moved to another
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
  const secondaryStoryImage = product.images[1];
  const approvedReviews = (reviewsData?.data || []).filter(
    (rev) => !rev.status || rev.status === "approved"
  );
  const whatsappUrl = `https://wa.me/8801755348053?text=${encodeURIComponent(
    `Hello Unique Engineering & Furniture, I would like details or a custom quote for: ${product.name}`
  )}`;

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-16 font-sans text-neutral-900">
      {/* Minimal Breadcrumb Header */}
      <div className="border-b border-stone-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-stone-500 flex-wrap"
          >
            <Link href="/" className="hover:text-black no-underline transition-colors">
              Home
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

          {product.sku && (
            <span className="hidden sm:inline text-[11px] font-mono text-stone-400">
              SKU: {product.sku}
            </span>
          )}
        </div>
      </div>

      {/* Band 1: Asymmetric 2-Column Hero Gallery & Editorial Spec Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Sticky Column: Primary Product Image & Thumbnail Carousel */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="relative aspect-square w-full overflow-hidden bg-[#fafaf8] border border-stone-100 group">
              {/* Primary Hero LCP Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={`${product.name} - angle ${selectedImageIndex + 1}`}
                fetchPriority="high"
                className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Subtle Corner Savings Pill */}
              {product.badgeText && (
                <span
                  className={`absolute top-4 left-4 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 text-white ${
                    product.badgeText.toLowerCase().includes("sold")
                      ? "bg-neutral-900"
                      : "bg-[#C53030]"
                  }`}
                >
                  {product.badgeText}
                </span>
              )}

              {/* Bottom-right Subtle Zoom Icon Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="Inspect full-screen image"
                title="Zoom image"
                className="absolute bottom-3.5 right-3.5 h-9 px-3 bg-white/95 border border-stone-200 text-xs font-medium text-neutral-800 hover:bg-neutral-900 hover:text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Zoom</span>
              </button>
            </div>

            {/* Thumbnail Strip with Prev/Next Arrows (matching reference) */}
            {product.images.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => cycleMainImage(-1)}
                  aria-label="Previous gallery angle"
                  className="h-9 w-9 flex items-center justify-center text-stone-500 hover:text-black bg-transparent border-0 cursor-pointer transition-colors shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>

                <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`Select angle ${idx + 1}`}
                      aria-pressed={selectedImageIndex === idx}
                      className={`w-16 h-16 sm:w-[72px] sm:h-[72px] bg-[#fafaf8] border p-1 shrink-0 cursor-pointer transition-all ${
                        selectedImageIndex === idx
                          ? "border-neutral-900 ring-1 ring-neutral-900"
                          : "border-stone-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${product.name} angle ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => cycleMainImage(1)}
                  aria-label="Next gallery angle"
                  className="h-9 w-9 flex items-center justify-center text-stone-500 hover:text-black bg-transparent border-0 cursor-pointer transition-colors shrink-0"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Clean Buy Controls + Architectural Feature Narrative */}
          <div className="lg:col-span-6 space-y-6">
            {/* Title & Price Header */}
            <div className="space-y-2.5 border-b border-stone-100 pb-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <Link
                  href={`/collections/${product.categorySlug}`}
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500 hover:text-black no-underline transition-colors"
                >
                  {product.categoryName} Collection
                </Link>

                <div className="inline-flex items-center gap-1.5 text-xs">
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
                </div>
              </div>

              <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[32px] text-neutral-900 tracking-tight leading-tight m-0">
                {product.name}
              </h1>

              {/* Price Line (Strikethrough original + Bold current, matching mockup) */}
              <div className="flex items-baseline gap-3 pt-1 flex-wrap">
                {product.compareAtPrice &&
                  product.compareAtPrice > product.sellingPrice && (
                    <span className="text-base sm:text-lg text-stone-400 line-through">
                      {formatTk(product.compareAtPrice)}
                    </span>
                  )}
                <span className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  {formatTk(product.sellingPrice)}
                </span>
                {product.discountPercent > 0 && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C53030] bg-red-50 px-2 py-0.5">
                    Save {product.discountPercent}%
                  </span>
                )}
                {product.isFreeDelivery && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" /> Free Delivery
                  </span>
                )}
              </div>

              {/* Short Summary Highlight (matching e-commerce standard) */}
              {product.shortDesc && (
                <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed bg-[#faf9f6] p-3 rounded-xl border border-stone-200/70 m-0">
                  {product.shortDesc}
                </p>
              )}
            </div>

            {/* Visual Round Color Swatches (matching e-commerce standard) */}
            {parsedColors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900 uppercase tracking-[0.1em] text-[11px]">
                    Color / Finish: <strong className="text-stone-900 normal-case font-bold">{activeColor}</strong>
                  </span>
                  <span className="text-[10px] text-stone-400">{parsedColors.length} finish options</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {parsedColors.map((c) => {
                    const isSelected = activeColor === c.name;
                    const isLight =
                      c.hex.toLowerCase() === "#ffffff" ||
                      c.hex.toLowerCase() === "#f9fafb" ||
                      c.hex.toLowerCase() === "#f5f2eb";

                    return (
                      <button
                        key={c.raw}
                        type="button"
                        onClick={() => handleSelectColor(c)}
                        title={`${c.name}${c.imageIndex !== undefined ? ` (Click to view Photo #${c.imageIndex + 1})` : ""}`}
                        aria-label={`Select color ${c.name}`}
                        className={`group relative size-9 sm:size-10 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs ${
                          isSelected
                            ? "ring-2 ring-neutral-900 ring-offset-2 scale-105"
                            : "opacity-85 hover:opacity-100 hover:scale-105 ring-1 ring-stone-300"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`size-3.5 stroke-[3] ${
                              isLight ? "text-neutral-900" : "text-white"
                            }`}
                          />
                        )}
                        {/* Desktop Hover Tooltip */}
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-stone-900 text-white text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 hidden sm:block">
                          {c.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Furniture Size Selector Chips (matching e-commerce standard) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900 uppercase tracking-[0.1em] text-[11px]">
                    Size / Dimension: <strong className="text-stone-900 normal-case font-bold">{activeSize}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = activeSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold transition text-xs flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-neutral-900 text-white shadow-xs"
                            : "bg-white border border-stone-300 text-stone-700 hover:border-neutral-900 hover:bg-stone-50"
                        }`}
                      >
                        {isSelected && <Check className="size-3 text-amber-400" />}
                        <span>{size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Availability & Delivery Highlights (2 crisp status lines matching mockup) */}
            <div className="space-y-2 text-xs sm:text-[13px] text-neutral-800">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-neutral-700 shrink-0" aria-hidden="true" />
                <span>Home delivery all over Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-neutral-700 shrink-0" aria-hidden="true" />
                <span>
                  {product.isFreeDelivery ? (
                    <strong className="text-emerald-600 font-semibold">FREE Delivery</strong>
                  ) : (
                    <>
                      Delivery: Inside Dhaka <strong>৳{product.deliveryInsideDhaka ?? 150}</strong> • Outside Dhaka <strong>৳{product.deliveryOutsideDhaka ?? 350}</strong>
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    product.inStock ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <span>
                  {product.inStock
                    ? product.stockCount !== null && product.stockCount > 0
                      ? `In stock, ready to ship (${product.stockCount} available)`
                      : "In stock, ready to ship"
                    : "Made to order / Pre-order — built in our factory"}
                </span>
              </div>
            </div>

            {/* Quantity & Stacked Monochrome Purchase Buttons (matching mockup) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs text-stone-600 pb-0.5">
                <span className="uppercase tracking-[0.12em] font-semibold text-stone-500">
                  Quantity
                </span>
                <div
                  role="group"
                  aria-label="Quantity selector"
                  className="inline-flex items-center border border-stone-300 bg-white h-9"
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="h-full w-9 flex items-center justify-center text-neutral-700 hover:bg-stone-100 cursor-pointer transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="w-9 text-center font-semibold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="h-full w-9 flex items-center justify-center text-neutral-700 hover:bg-stone-100 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full h-12 border border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-50 text-sm font-semibold tracking-wide cursor-pointer transition-colors"
              >
                Add to cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-12 bg-[#1a1a1a] hover:bg-black text-white text-sm font-semibold tracking-wide cursor-pointer transition-colors"
              >
                Buy it now
              </button>
            </div>

            {/* Editorial Narrative & Technical Story Stack inside Right Column */}
            <div className="pt-4 space-y-7 text-[13.5px] sm:text-sm text-stone-600 leading-relaxed">
              {/* Overview & Concept */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-neutral-900 m-0">
                  Architectural Ergonomic Concept
                </h2>
                {product.description && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderRichDescription(product.description),
                    }}
                  />
                )}
              </div>

              {/* Embedded Secondary Angle Photo inside Right Column Story (if available) */}
              {secondaryStoryImage && (
                <div className="overflow-hidden border border-stone-100 bg-[#fafaf8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={secondaryStoryImage}
                    alt={`${product.name} engineering profile`}
                    loading="lazy"
                    className="w-full h-auto max-h-[380px] object-contain mx-auto p-3"
                  />
                </div>
              )}

              {/* Engineering & Feature Breakdown */}
              {product.features.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-neutral-900 m-0">
                    Innovative Engineering Highlights
                  </h2>
                  <ul className="m-0 p-0 list-none space-y-2">
                    {product.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-neutral-800">
                        <Check
                          className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specification Summary Matrix */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <h2 className="text-sm font-bold text-neutral-900 m-0">
                  Specifications &amp; Material Notes
                </h2>
                <dl className="m-0 grid grid-cols-1 gap-2 text-xs sm:text-[13px]">
                  {product.brand && (
                    <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                      <dt className="font-semibold text-neutral-800">Brand</dt>
                      <dd className="m-0 text-stone-600 text-right">{product.brand}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                    <dt className="font-semibold text-neutral-800">Collection</dt>
                    <dd className="m-0 text-stone-600 text-right">{product.categoryName}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                    <dt className="font-semibold text-neutral-800">Material &amp; Frame</dt>
                    <dd className="m-0 text-stone-600 text-right">
                      {product.material || "Contract-Grade Steel & High-Density Finish"}
                    </dd>
                  </div>
                  {product.dimensions && (
                    <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                      <dt className="font-semibold text-neutral-800">Dimensions</dt>
                      <dd className="m-0 text-stone-600 text-right">
                        {product.dimensions.width || "-"}&quot; W ×{" "}
                        {product.dimensions.depth || "-"}&quot; D ×{" "}
                        {product.dimensions.height || "-"}&quot; H
                      </dd>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                      <dt className="font-semibold text-neutral-800">Weight</dt>
                      <dd className="m-0 text-stone-600 text-right">{product.weight} kg</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                    <dt className="font-semibold text-neutral-800">Assembly</dt>
                    <dd className="m-0 text-stone-600 text-right">
                      Free installation inside Dhaka Metro
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100">
                    <dt className="font-semibold text-neutral-800">Warranty</dt>
                    <dd className="m-0 text-stone-600 text-right">
                      {product.warranty || "Up to 5-Year UEF Structural Frame Support"}
                    </dd>
                  </div>

                  {/* Dynamic Technical Specifications from Admin Form */}
                  {product.specifications &&
                    Object.entries(
                      typeof product.specifications === "string"
                        ? JSON.parse(product.specifications)
                        : product.specifications
                    ).map(([k, v], idx) => (
                      <div
                        key={idx}
                        className="flex justify-between gap-4 py-1.5 border-b border-stone-100"
                      >
                        <dt className="font-semibold text-neutral-800">{k}</dt>
                        <dd className="m-0 text-stone-600 text-right">{String(v)}</dd>
                      </div>
                    ))}
                </dl>
              </div>

              {/* Native Collapsible Shipping & Factory Support Accordions (matching mockup) */}
              <div className="border-t border-b border-stone-200 divide-y divide-stone-200">
                <details className="group py-3.5">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-900">
                    <span>SHIPPING INFORMATION</span>
                    <ChevronDown
                      className="w-4 h-4 text-stone-500 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="pt-3 text-xs sm:text-[13px] text-stone-600 space-y-2 leading-relaxed">
                    <p className="m-0">
                      <strong className="text-neutral-900">Dhaka Metro:</strong> Delivered by Unique Engineering &amp; Furniture specialists within 2–4 business days with free in-room setup.
                    </p>
                    <p className="m-0">
                      <strong className="text-neutral-900">Nationwide 64 Districts:</strong> Dispatched with protective wooden crating in 4–7 business days.
                    </p>
                  </div>
                </details>

                <details className="group py-3.5">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-900">
                    <span>CUSTOM SIZE &amp; CORPORATE ORDERS</span>
                    <ChevronDown
                      className="w-4 h-4 text-stone-500 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="pt-3 text-xs sm:text-[13px] text-stone-600 space-y-2 leading-relaxed">
                    <p className="m-0">
                      Need custom steel dimensions, cable routing, or bulk studio quantities? Reach our factory fabrication desk directly at{" "}
                      <strong className="text-neutral-900">+880 1755-348053</strong>.
                    </p>
                  </div>
                </details>
              </div>

              {/* Minimal Share & WhatsApp Utility Strip */}
              <div className="flex items-center gap-5 flex-wrap pt-1 text-xs font-medium text-neutral-700">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 hover:text-black bg-transparent border-0 p-0 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 hover:text-black bg-transparent border-0 p-0 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy link</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 no-underline transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Band 2: Full-Bleed Overlapping Card Banner ("ERGONOMIC DESIGN - For the 21st century") */}
      <section className="relative w-full min-h-[360px] sm:min-h-[440px] flex items-center overflow-hidden bg-stone-100 border-y border-stone-200/70">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-banner.jpg"
          alt="21st century modern ergonomic workspace"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white p-7 sm:p-10 max-w-md shadow-xl border border-stone-100 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400 block">
              ERGONOMIC DESIGN
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight m-0">
              For the 21st century
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed m-0">
              We are proud to present our factory-crafted workspace systems. Clean proportions and enduring structural quality engineered to elevate your home office or studio.
            </p>
          </div>
        </div>
      </section>

      {/* Band 3: Alternating 2-Column Editorial Story ("Why Our product is best?") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16 sm:space-y-24">
        {/* Row 1: Text Left, Photo Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400 block">
              WHY
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight m-0">
              Our product is best?
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed m-0">
              Unique Engineering &amp; Furniture ensures verified material quality across every ergonomic mechanism and CNC laser-cut steel frame. We never compromise on weld integrity, load stability, or comfort—so you receive studio-grade durability built for years of daily focus.
            </p>
          </div>

          <div className="lg:col-span-7 overflow-hidden bg-stone-100 border border-stone-200/70 aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LIFESTYLE_QUALITY_IMAGE}
              alt="Engineered furniture inside modern office space"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Row 2: Photo Left, Numbered Reasons Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 overflow-hidden bg-stone-100 border border-stone-200/70 aspect-[4/3] order-2 lg:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOOTER_PROMOTIONS[0].image}
              alt="Factory quality control and modern seating setup"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
            <ol className="m-0 p-0 list-none space-y-4 text-sm text-stone-600 leading-relaxed">
              <li className="flex gap-3">
                <span className="font-bold text-neutral-900 shrink-0">1.</span>
                <span>
                  Every piece undergoes a multi-point pre-delivery quality check by our product specialists before it leaves our Dhaka facility.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-neutral-900 shrink-0">2.</span>
                <span>
                  We pair balanced ergonomic support with clean minimalist styling tailored for executive workstations, home studies, and gaming rigs.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-neutral-900 shrink-0">3.</span>
                <span>
                  Built from heavy-gauge powder-coated steel, breathable contract textiles, and precision mechanisms backed by direct factory service support.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Customer Impressions Strip (Database Reviews when approved entries exist) */}
      {approvedReviews.length > 0 && (
        <section
          id="reviews-section"
          aria-label="Client impressions"
          className="border-t border-stone-200/80 py-14 bg-[#fafaf8]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400 m-0">
                  Verified Feedback
                </p>
                <h2 className="font-heading font-bold text-2xl text-neutral-900 mt-1 mb-0">
                  Client Impressions
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                <span>{product.rating.toFixed(1)} Average Rating</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {approvedReviews.slice(0, 4).map((review) => (
                <div
                  key={review._id}
                  className="bg-white border border-stone-200/80 p-5 flex flex-col justify-between space-y-3"
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
                  <div className="text-[11px] font-medium text-neutral-800 pt-2 border-t border-stone-100">
                    {review.customerName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Band 4: Centered 5-Column "You may also like" Row (matching mockup) */}
      {relatedProducts.length > 0 && (
        <section
          aria-label="You may also like"
          className="border-t border-stone-200/80 py-16 sm:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 text-center mb-10">
              You may also like
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="group block no-underline text-center"
                >
                  <div className="aspect-square bg-[#fafaf8] border border-stone-100 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.primaryImage}
                      alt={rel.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 space-y-1">
                    <h4 className="text-xs font-medium text-neutral-900 group-hover:text-black line-clamp-1 m-0">
                      {rel.name}
                    </h4>
                    <div className="flex items-baseline justify-center gap-2 flex-wrap text-xs">
                      {rel.compareAtPrice && rel.compareAtPrice > rel.price && (
                        <span className="text-stone-400 line-through">
                          {formatTk(rel.compareAtPrice)}
                        </span>
                      )}
                      <span className="font-semibold text-neutral-900">
                        from {formatTk(rel.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Band 5: 3-Column Brand Showcase Strip (matching bottom section of mockup) */}
      <section className="border-t border-stone-200/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {FOOTER_PROMOTIONS.map((promo) => (
            <div key={promo.title} className="space-y-4">
              <div className="aspect-[16/10] w-full overflow-hidden bg-stone-100 border border-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={promo.image}
                  alt={promo.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-neutral-900 m-0 leading-snug">
                {promo.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed m-0">
                {promo.text}
              </p>
            </div>
          ))}
        </div>
      </section>

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
          className="h-10 px-5 bg-[#1a1a1a] hover:bg-black text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Add to cart</span>
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
