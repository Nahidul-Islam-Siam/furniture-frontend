import { useState, useMemo } from 'react';
import { ALL_PRODUCTS } from '../../data/gridData';
import { useQuickView } from '../../context/QuickViewContext';
import { useCart } from '../../context/CartContext';
import { Search, X, ArrowUpRight, ShoppingBag } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { openQuickView } = useQuickView();
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (!query.trim()) return list.slice(0, 8); // show popular default 8

    const q = query.toLowerCase();
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, selectedCategory]);

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
              placeholder="Search chairs, elevating desks, storage, accessories..."
              className="w-full text-base sm:text-lg text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-neutral-400 hover:text-black"
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
          <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-xs font-medium">
            <span className="text-neutral-500 mr-1">Filter:</span>
            {['All', 'Chair', 'Table'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  selectedCategory === cat
                    ? 'bg-black text-white font-semibold'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <p className="text-base font-medium">No products found for "{query}"</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Try searching for "Leap", "Elevating", "Taskmaster", or "ErgoFit"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3.5 p-3 rounded-xl border border-neutral-100 hover:border-neutral-300 hover:shadow-sm transition-all group bg-white"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-lg bg-neutral-50 cursor-pointer"
                      onClick={() => {
                        onClose();
                        openQuickView(product);
                      }}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4
                            onClick={() => {
                              onClose();
                              openQuickView(product);
                            }}
                            className="text-sm font-semibold text-neutral-900 group-hover:text-black line-clamp-1 cursor-pointer"
                          >
                            {product.title}
                          </h4>
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
                          <button
                            onClick={() => {
                              onClose();
                              openQuickView(product);
                            }}
                            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-md transition-colors"
                            title="View details"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
