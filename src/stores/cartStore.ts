"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./productStore";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: "cash" | "card";
  amountPaid: number;
  change: number;
  timestamp: string; // ISO string (AMAN untuk persist)
  cashierId: string;
}

interface CartState {
  items: CartItem[];
  transactions: Transaction[];

  /* Cart actions */
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  /* Helpers */
  getTotal: () => number;

  /* Checkout */
  checkout: (
    paymentMethod: "cash" | "card",
    amountPaid: number,
    cashierId: string
  ) => Transaction;
}

const seedTransactions = (): Transaction[] => {
  const baseDate = new Date();

  return Array.from({ length: 5 }).map((_, i) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - i);

    const total = 100_000 + i * 50_000;

    return {
      id: `seed-${i}`,
      items: [],
      total,
      paymentMethod: i % 2 === 0 ? "cash" : "card",
      amountPaid: total,
      change: 0,
      timestamp: date.toISOString(),
      cashierId: "demo",
    };
  });
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      transactions: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.product.id !== productId
          ),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (sum, item) =>
            sum + item.product.price * item.quantity,
          0
        ),

      checkout: (paymentMethod, amountPaid, cashierId) => {
        const total = get().getTotal();

        const transaction: Transaction = {
          id: Date.now().toString(),
          items: get().items,
          total,
          paymentMethod,
          amountPaid,
          change: amountPaid - total,
          timestamp: new Date().toISOString(),
          cashierId,
        };

        set((state) => ({
          transactions: [...state.transactions, transaction],
          items: [],
        }));

        return transaction;
      },
    }),
    {
      name: "cart-storage",

      onRehydrateStorage: () => (state) => {
        if (state && state.transactions.length === 0) {
          state.transactions = seedTransactions();
        }
      },
    }
  )
);
