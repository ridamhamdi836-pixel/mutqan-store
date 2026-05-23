"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; bundleId: string }
  | { type: "CLEAR" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "OPEN_CHECKOUT" }
  | { type: "CLOSE_CHECKOUT" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const sameProduct = state.items.find((i) => i.productSlug === action.item.productSlug && i.itemType === action.item.itemType);
      if (sameProduct) {
        // Replace existing bundle for this product (don't duplicate)
        return { ...state, items: state.items.map((i) =>
          i.productSlug === action.item.productSlug && i.itemType === action.item.itemType
            ? { ...action.item }
            : i
        )};
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.bundleId !== action.bundleId) };
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "OPEN_CHECKOUT":
      return { ...state, isCheckoutOpen: true };
    case "CLOSE_CHECKOUT":
      return { ...state, isCheckoutOpen: false };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (bundleId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  totalSar: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isCheckoutOpen: false,
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mutqan_cart");
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        parsed.forEach((item) => dispatch({ type: "ADD_ITEM", item }));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("mutqan_cart", JSON.stringify(state.items));
    }
  }, [state.items, hydrated]);

  const totalSar = state.items.reduce((sum, i) => sum + i.priceSar * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      ...state,
      addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
      removeItem: (bundleId) => dispatch({ type: "REMOVE_ITEM", bundleId }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      openCart: () => dispatch({ type: "OPEN_CART" }),
      closeCart: () => dispatch({ type: "CLOSE_CART" }),
      openCheckout: () => dispatch({ type: "OPEN_CHECKOUT" }),
      closeCheckout: () => dispatch({ type: "CLOSE_CHECKOUT" }),
      totalSar,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
