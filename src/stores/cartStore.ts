import { create } from "zustand";
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
  timestamp: Date;
  cashierId: string;
}

interface CartState {
  items: CartItem[];
  transactions: Transaction[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  checkout: (
    paymentMethod: "cash" | "card",
    amountPaid: number,
    cashierId: string
  ) => Transaction;
}

/* -------------------------------------------------------------------------- */
/*                        Mock Transaction Generator                           */
/* -------------------------------------------------------------------------- */

/**
 * Membuat data transaksi palsu untuk demo / dashboard
 * Aman, tidak mengganggu checkout asli
 */
const generateMockTransactions = (): Transaction[] => {
  const today = new Date();
  const transactions: Transaction[] = [];

  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const total = Math.floor(Math.random() * 500_000) + 100_000; // 100k – 600k

    transactions.push({
      id: `seed-${i}`,
      items: [],
      total,
      paymentMethod: Math.random() > 0.5 ? "cash" : "card",
      amountPaid: total,
      change: 0,
      timestamp: date,
      cashierId: "demo",
    });
  }

  return transactions;
};

/* -------------------------------------------------------------------------- */
/*                                   Store                                    */
/* -------------------------------------------------------------------------- */

const IS_DEV = process.env.NODE_ENV === "development";

export const useCartStore = create<CartState>((set, get) => ({
  /* ------------------------------ State ---------------------------------- */
  items: [],
  transactions: IS_DEV ? generateMockTransactions() : [],

  /* --------------------------- Cart Actions ------------------------------ */

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
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

  /* ------------------------------ Helpers -------------------------------- */

  getTotal: () => {
    const { items } = get();
    return items.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    );
  },

  /* ------------------------------ Checkout ------------------------------- */

  checkout: (paymentMethod, amountPaid, cashierId) => {
    const { items, getTotal, clearCart } = get();
    const total = getTotal();

    const transaction: Transaction = {
      id: Date.now().toString(),
      items: [...items],
      total,
      paymentMethod,
      amountPaid,
      change: amountPaid - total,
      timestamp: new Date(),
      cashierId,
    };

    set((state) => ({
      transactions: [...state.transactions, transaction],
    }));

    clearCart();
    return transaction;
  },
}));
