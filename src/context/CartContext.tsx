import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product } from '../data/gridData';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selected?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  selectedCart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  buyNow: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleItemSelection: (productId: string) => void;
  selectAllItems: (selected: boolean) => void;
  clearCart: () => void;
  clearSelectedItems: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  selectedItemsCount: number;
  subtotal: number;
  freeDeliveryThreshold: number;
  freeDeliveryProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('grid_cart');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      // Ensure all loaded items have selected: true by default
      return parsed.map((item) => ({
        ...item,
        selected: item.selected !== false,
      }));
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('grid_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selected: true }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          selected: true,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const buyNow = (product: Product, quantity = 1) => {
    setCart((prev) => {
      // Unselect all existing items
      const unselected = prev.map((item) => ({ ...item, selected: false }));
      const existingIndex = unselected.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        unselected[existingIndex] = {
          ...unselected[existingIndex],
          quantity,
          selected: true,
        };
        return unselected;
      }

      return [
        ...unselected,
        {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          selected: true,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleItemSelection = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, selected: item.selected === false ? true : false }
          : item
      )
    );
  };

  const selectAllItems = (selected: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const clearCart = () => {
    setCart([]);
  };

  const clearSelectedItems = () => {
    setCart((prev) => prev.filter((item) => item.selected === false));
  };

  // Only selected items participate in checkout and subtotal
  const selectedCart = useMemo(() => {
    return cart.filter((item) => item.selected !== false);
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedItemsCount = selectedCart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = selectedCart.reduce(
    (sum, item) => sum + item.product.priceNumber * item.quantity,
    0
  );

  const freeDeliveryThreshold = 10000;
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        cart,
        selectedCart,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        selectAllItems,
        clearCart,
        clearSelectedItems,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        selectedItemsCount,
        subtotal,
        freeDeliveryThreshold,
        freeDeliveryProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
