"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ALL_PRODUCTS, Product } from "../../data/gridData";
import { useQuickView } from "../../context/QuickViewContext";
import { useCart } from "../../context/CartContext";
import { Search, X, Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import { useGetProductsQuery, IProductItem } from "@/redux/service/productApi";
import { useGetCategoriesQuery } from "@/redux/service/categoryApi";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { openQuickView } = useQuickView();
  const { addToCart } = useCart();

  // Debounce user search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Live Backend API Query
  const { data: backendData, isFetching } = useGetProductsQuery({
    searchTerm: debouncedQuery || undefined,
    limit: 12,
  });

  const { data: categoriesData } = useGetCategoriesQuery();

  const categoriesList = useMemo(() => {
    const base = ["All"];
    if (categoriesData?.data) {
      categoriesData.data.forEach((c) => {
        if (!base.includes(c.name)) base.push(c.name);
      });
    }
    return base.length > 1 ? base : ["All", "Chair", "Table", "Sofa", "Storage"];
  }, [categoriesData]);

  // Combined product list (live backend primary, with fallback to ALL_PRODUCTS)
  const results: Product[] = useMemo(() => {
    if (backendData?.data && backendData.data.length > 0) {
      let list = backendData.data.map((p: IProductItem) => {
        const catName =
          typeof p.category === "object"
            ? p.category?.name
            : categoriesData?.data?.find((c) => c._id === p.category)?.name || "Furniture";

        const priceNum = p.discountPrice ?? p.price ?? 0;
        return {
          id: p._id,
          title: p.name,
          category: catName,
          priceText: `Tk ${priceNum.toLocaleString()}`,
          priceNumber: priceNum,
          rating: p.rating || 5,
          reviewsCount: p.numReviews || 12,
          images: p.images && p.images.length > 0
            ? p.images
            : ["https://images.unsplash.com/photo-1580481077195-c3f995a8b792?auto=format&fit=crop&w=800&q=80"],
          description: p.description || "",
          dimensions: p.dimensions
            ? `${p.dimensions.width || 0}W × ${p.dimensions.depth || 0}D × ${p.dimensions.height || 0}H cm`
            : "Standard",
          warranty: "5-Year Manufacturer Warranty",
          delivery: "Free Delivery in Dhaka",
          inStock: p.stock > 0 && p.isAvailable !== false,
          link: `/products/${p.slug || p._id}`,
          finishes: ["Matte Black", "Solid Walnut", "Brushed Aluminum"],
          colors: [
            { name: "Charcoal", hex: "#2b2b2b" },
            { name: "Warm Clay", hex: "#c9653b" },
            { name: "Cream", hex: "#e8e3d9" },
          ],
        } as Product;
      });

      if (selectedCategory !== "All") {
        list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
      }
      return list;
    }

    // Fallback to static mock products if backend has no results
    let fallback = ALL_PRODUCTS;
    if (selectedCategory !== "All") {
      fallback = fallback.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      fallback = fallback.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return fallback.slice(0, 10);
  }, [backendData, categoriesData, debouncedQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 md:p-10">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden mt-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Search Input Bar */}
          <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center gap-3">
            <Search className="w-6 h-6 text-neutral-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chairs, elevating desks, sofas, storage..."
              className="w-full text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
            />
            {isFetching && <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />}
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 text-neutral-400 hover:text-black"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Categories Filter */}
          <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-xs font-medium scrollbar-none">
            <span className="text-neutral-500 mr-1 shrink-0">Category:</span>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-black text-white font-semibold"
                    : "bg-white border border-neutral-200 text-neutral-700 hover:border-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <p className="text-base font-medium">No products found for "{query}"</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Try searching for "Aeva", "Leap", "Elevating Desk", or "Sofa"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3.5 p-3 rounded-xl border border-neutral-100 hover:border-neutral-300 hover:shadow-sm transition-all group bg-white"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="block shrink-0"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-lg bg-neutral-50 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between">
                          <Link
                            href={`/products/${product.id}`}
                            onClick={onClose}
                            className="text-sm font-semibold text-neutral-900 hover:text-primary line-clamp-1 cursor-pointer"
                          >
                            {product.title}
                          </Link>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">{product.category}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-neutral-900 font-sans">
                          {product.priceText}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              addToCart(product);
                              onClose();
                            }}
                            className="p-1.5 bg-neutral-900 text-white rounded-md hover:bg-black transition-colors"
                            title="Add to cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/products/${product.id}`}
                            onClick={onClose}
                            className="p-1.5 border border-neutral-200 text-neutral-700 rounded-md hover:border-black transition-colors"
                            title="View product details"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-neutral-50 border-t border-neutral-100 text-center text-[11px] text-neutral-500">
            Real-time catalog search powered by live GRID database
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
