import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeDeliveryThreshold,
    freeDeliveryProgress,
    clearCart,
  } = useCart();

  const [orderNote, setOrderNote] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      toast.success('Order placed successfully! Order ID: #GRID-' + Math.floor(100000 + Math.random() * 900000));
      clearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            <h2 className="font-heading font-semibold text-lg text-neutral-900">
              Your Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setOrderSuccess(false);
            }}
            className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100">
          <div className="flex justify-between items-center text-xs font-medium text-neutral-700 mb-1.5">
            {subtotal >= freeDeliveryThreshold ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Congratulations! You qualified for Free Home Delivery
              </span>
            ) : (
              <span>
                Add{' '}
                <span className="font-bold text-neutral-900">
                  Tk {(freeDeliveryThreshold - subtotal).toLocaleString()}
                </span>{' '}
                more for Free Home Delivery inside Dhaka
              </span>
            )}
            <span className="text-neutral-500">{freeDeliveryProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                subtotal >= freeDeliveryThreshold ? 'bg-emerald-600' : 'bg-neutral-900'
              }`}
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
          {orderSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-neutral-900">Thank You!</h3>
              <p className="text-neutral-600 text-sm">
                Your order has been placed. Our executive will call you within 24 hours to confirm delivery & assembly inside Dhaka.
              </p>
              <button
                onClick={() => {
                  setOrderSuccess(false);
                  setIsCartOpen(false);
                }}
                className="mt-4 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-800">Your cart is empty</h3>
              <p className="text-neutral-500 text-sm max-w-xs">
                Explore our curated collection of ergonomic chairs and motorized standing desks.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-md bg-neutral-50 border border-neutral-100"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {item.product.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-neutral-200 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-sm font-semibold text-neutral-900 font-sans">
                        Tk {(item.product.priceNumber * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && !orderSuccess && (
          <div className="p-5 border-t border-neutral-100 bg-neutral-50 space-y-4">
            {/* Special Instructions Note */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                Order Note / Special Assembly Instructions:
              </label>
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Floor number, lift availability, or preferred delivery timing..."
                className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                rows={2}
              />
            </div>

            {/* Subtotal */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-sm text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-heading font-bold text-lg text-neutral-900">
                  Tk {subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Taxes, assembly inside Dhaka included. Delivery calculated at checkout.
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-medium text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-75"
            >
              {isCheckingOut ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>Check Out • Tk {subtotal.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Payment security info */}
            <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-neutral-400">
              <span>bKash</span>
              <span>•</span>
              <span>Nagad</span>
              <span>•</span>
              <span>Visa / Mastercard</span>
              <span>•</span>
              <span>Cash on Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
