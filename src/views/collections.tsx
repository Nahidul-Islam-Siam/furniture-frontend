import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_PRODUCTS, CHAIR_PRODUCTS, TABLE_PRODUCTS, Product } from '../data/gridData';
import { useQuickView } from '../context/QuickViewContext';
import { useCart } from '../context/CartContext';
import { Star, Eye, ShoppingBag, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Collections() {
  const { category } = useParams<{ category?: string }>();
  const [selectedSort, setSelectedSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const { openQuickView } = useQuickView();
  const { addToCart } = useCart();

  // Normalize category name
  const currentCategoryName = useMemo(() => {
    if (!category) return 'All Products';
    if (category.toLowerCase() === 'chair') return 'Chairs';
    if (category.toLowerCase() === 'table') return 'Tables & Desks';
    if (category.toLowerCase() === 'sofa') return 'Sofas';
    if (category.toLowerCase() === 'storage') return 'Storage & Credenzas';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }, [category]);

  const filteredProducts = useMemo(() => {
    let prods: Product[] = ALL_PRODUCTS;

    if (category) {
      const catLower = category.toLowerCase();
      if (catLower === 'chair') {
        prods = CHAIR_PRODUCTS;
      } else if (catLower === 'table') {
        prods = TABLE_PRODUCTS;
      } else if (catLower === 'sofa' || catLower === 'grid-sofa-collection') {
        prods = ALL_PRODUCTS.filter((p) => p.category === 'Sofa');
      } else if (catLower === 'storage') {
        prods = ALL_PRODUCTS.filter((p) => p.category === 'Storage');
      }
    }

    if (inStockOnly) {
      prods = prods.filter((p) => p.inStock);
    }

    // Sort
    const sorted = [...prods];
    if (selectedSort === 'price-asc') {
      sorted.sort((a, b) => a.priceNumber - b.priceNumber);
    } else if (selectedSort === 'price-desc') {
      sorted.sort((a, b) => b.priceNumber - a.priceNumber);
    } else if (selectedSort === 'name') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [category, inStockOnly, selectedSort]);

  return (
    <div className="w-full bg-white min-h-screen py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-sans">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/collections" className="hover:text-black transition-colors">
            Collections
          </Link>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-neutral-900 font-semibold">{currentCategoryName}</span>
            </>
          )}
        </div>

        {/* Collection Header */}
        <div className="border-b border-neutral-100 pb-8 mb-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            {currentCategoryName}
          </h1>
          <p className="text-sm text-neutral-500 mt-2 font-sans max-w-2xl">
            {category?.toLowerCase() === 'chair'
              ? 'Ergonomic task and executive chairs engineered with spine support, LiveBack technology, and breathable materials.'
              : category?.toLowerCase() === 'table'
              ? 'Motorized sit-to-stand elevating desks, executive workstations, and solid wood surfaces with assembly in Dhaka.'
              : 'Explore contract-grade work furniture direct from GRID, built for productivity and modern aesthetics.'}
          </p>

          {/* Category Quick Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <Link
              to="/collections"
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                !category
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
              }`}
            >
              All Products ({ALL_PRODUCTS.length})
            </Link>
            <Link
              to="/collections/chair"
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                category?.toLowerCase() === 'chair'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
              }`}
            >
              Chairs ({CHAIR_PRODUCTS.length})
            </Link>
            <Link
              to="/collections/table"
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                category?.toLowerCase() === 'table'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
              }`}
            >
              Tables & Desks ({TABLE_PRODUCTS.length})
            </Link>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-neutral-600" />
            <span className="text-xs font-semibold text-neutral-800">
              Showing {filteredProducts.length} items
            </span>
            <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-neutral-300 text-black focus:ring-black"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium">Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800 text-xs focus:outline-none focus:border-black"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-lg font-medium">No products match your criteria.</p>
            <button
              onClick={() => setInStockOnly(false)}
              className="mt-4 px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            {filteredProducts.map((product) => {
              const isHovered = hoveredProductId === product.id;
              const hasAltImage = product.images.length > 1;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between"
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  {/* Card Image */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 cursor-pointer">
                    <img
                      src={
                        isHovered && hasAltImage
                          ? product.images[1]
                          : product.images[0]
                      }
                      alt={product.title}
                      className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
                      onClick={() => openQuickView(product)}
                    />

                    {product.tag && (
                      <span
                        className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 ${
                          product.tag.toLowerCase().includes('sold')
                            ? 'bg-neutral-800 text-white'
                            : 'bg-[#C53030] text-white shadow-sm'
                        }`}
                      >
                        {product.tag}
                      </span>
                    )}

                    {/* Quick Shop Overlay */}
                    <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickView(product);
                        }}
                        className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-sm text-neutral-900 text-xs font-semibold rounded-full shadow-lg hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Quick Shop
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          toast.success(`Added ${product.title} to cart`);
                        }}
                        className="p-2 bg-neutral-900 text-white rounded-full shadow-lg hover:bg-black transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-3.5 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-center text-amber-500 gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>

                      <h3
                        onClick={() => openQuickView(product)}
                        className="font-sans font-medium text-xs sm:text-sm text-neutral-800 hover:text-black line-clamp-2 cursor-pointer transition-colors"
                      >
                        {product.title}
                      </h3>
                    </div>

                    <div className="mt-2 flex flex-col items-center">
                      {product.originalPrice && (
                        <span className="text-[11px] text-neutral-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                      <span className="font-heading font-semibold text-xs sm:text-sm text-neutral-900">
                        {product.priceText.includes('from')
                          ? product.priceText
                          : `Tk ${product.priceNumber.toLocaleString()}.00`}
                      </span>
                    </div>

                    {/* Mobile Button */}
                    <div className="mt-2.5 sm:hidden">
                      <button
                        onClick={() => {
                          addToCart(product);
                          toast.success(`Added ${product.title} to cart`);
                        }}
                        className="w-full py-1.5 bg-neutral-100 hover:bg-black hover:text-white text-neutral-800 text-[11px] font-medium rounded-full transition-colors"
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
