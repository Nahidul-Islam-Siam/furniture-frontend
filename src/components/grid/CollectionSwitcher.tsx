import { useState } from 'react';
import { CHAIR_PRODUCTS, TABLE_PRODUCTS, Product } from '../../data/gridData';
import { useQuickView } from '../../context/QuickViewContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { toast } from 'sonner';

export const CollectionSwitcher: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Chair' | 'Table'>('Chair');
  const { openQuickView } = useQuickView();
  const { addToCart } = useCart();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  const products: Product[] = activeTab === 'Chair' ? CHAIR_PRODUCTS : TABLE_PRODUCTS;

  return (
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Tabs */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-2">
            Featured
          </p>

          <div className="flex items-center justify-center gap-8 sm:gap-12">
            <button
              onClick={() => setActiveTab('Chair')}
              className={`font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight pb-2 transition-all relative ${
                activeTab === 'Chair'
                  ? 'text-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Chair
              {activeTab === 'Chair' && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-neutral-900 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('Table')}
              className={`font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight pb-2 transition-all relative ${
                activeTab === 'Table'
                  ? 'text-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Table
              {activeTab === 'Table' && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-neutral-900 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* 5-Column Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
          {products.map((product) => {
            const isHovered = hoveredProductId === product.id;
            const hasAltImage = product.images.length > 1;

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between"
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                {/* Product Image Card */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 cursor-pointer">
                  {/* Primary & Hover Image */}
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

                  {/* Badge */}
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

                  {/* Quick Shop Floating Overlay on Desktop */}
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
                      title="Quick Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Product Metadata */}
                <div className="mt-3.5 text-center flex-1 flex flex-col justify-between">
                  <div>
                    {/* Stars */}
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

                  {/* Pricing */}
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

                  {/* Mobile Quick Add Button */}
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
      </div>
    </section>
  );
};
