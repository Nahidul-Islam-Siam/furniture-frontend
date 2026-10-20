import { useState } from 'react';
import { useQuickView } from '../../context/QuickViewContext';
import { useCart } from '../../context/CartContext';
import { X, Star, CheckCircle, Truck, ShieldCheck, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export const QuickViewModal: React.FC = () => {
  const { selectedProduct, closeQuickView } = useQuickView();
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    toast.success(`Added ${quantity} × ${selectedProduct.title} to cart`);
    closeQuickView();
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    closeQuickView();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeQuickView} />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Product Images */}
            <div className="p-6 bg-neutral-50 flex flex-col justify-between border-r border-neutral-100">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-neutral-200 flex items-center justify-center">
                <img
                  src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {selectedProduct.tag && (
                  <span className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {selectedProduct.tag}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                        selectedImageIndex === idx ? 'border-black shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Purchase */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {selectedProduct.category} Collection
                  </span>
                  <div className="flex items-center text-amber-500 text-xs gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-neutral-800">5.0</span>
                    <span className="text-neutral-400">(Verified Buyer Reviews)</span>
                  </div>
                </div>

                <h2 className="font-heading font-bold text-2xl text-neutral-900 leading-tight">
                  {selectedProduct.title}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl font-extrabold text-neutral-900 font-sans">
                    {selectedProduct.priceText}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      {selectedProduct.originalPrice}
                    </span>
                  )}
                </div>

                {/* In stock badge */}
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md w-fit">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>In stock, ready to ship in Dhaka with assembly</span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed pt-2">
                  {selectedProduct.description}
                </p>

                {/* Features */}
                {selectedProduct.features && (
                  <div className="space-y-1.5 pt-2">
                    <div className="text-xs font-semibold uppercase text-neutral-700 tracking-wider">
                      Key Highlights:
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-600">
                      {selectedProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quantity & CTA */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
                  <div className="flex items-center border border-neutral-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-neutral-100 text-neutral-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-neutral-100 text-neutral-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 border-2 border-black bg-white hover:bg-neutral-50 text-black font-semibold text-sm rounded-full flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 px-6 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-full transition-all shadow-md active:scale-[0.99]"
                  >
                    Buy it Now
                  </button>
                </div>

                {/* Assurance Badges */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-neutral-700" />
                    <span>Free Home Delivery Dhaka</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-neutral-700" />
                    <span>3 to 5 Years Warranty</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
