"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  image: string; // Ubah menjadi wajib untuk konsistensi UI
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  decreaseStock: (id: string, quantity: number) => void;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Makanan', color: '#6366f1' },
  { id: '2', name: 'Minuman', color: '#22c55e' },
  { id: '3', name: 'Snack', color: '#f59e0b' },
  { id: '4', name: 'Lainnya', color: '#ec4899' },
];


const initialProducts: Product[] = [
  { id: '1', name: 'Nasi Goreng', price: 25000, stock: 50, categoryId: '1', image: '/products/nasgor.png' },
  { id: '2', name: 'Mie Goreng', price: 22000, stock: 45, categoryId: '1', image: '/products/miegoreng.png' },
  { id: '3', name: 'Ayam Bakar', price: 35000, stock: 30, categoryId: '1', image: '/products/ayambakar.png' },
  { id: '4', name: 'Es Teh Manis', price: 5000, stock: 100, categoryId: '2', image: '/products/esteh.png' },
  { id: '5', name: 'Kopi Hitam', price: 8000, stock: 80, categoryId: '2', image: '/products/kopi.png' },
  { id: '6', name: 'Jus Jeruk', price: 12000, stock: 40, categoryId: '2', image: '/products/jusjeruk.png' },
  { id: '7', name: 'Keripik', price: 10000, stock: 60, categoryId: '3', image: '/products/keripik.png' },
  { id: '8', name: 'Cokelat Bar', price: 15000, stock: 35, categoryId: '3', image: '/products/coklat.png' },
];

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: initialProducts,
      categories: initialCategories,
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, { ...product, id: Date.now().toString() }],
        })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: Date.now().toString() }],
        })),
      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...category } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      decreaseStock: (id, quantity) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock - quantity) } : p
          ),
        })),
    }),
    {
      name: 'product-storage',
    }
  )
);