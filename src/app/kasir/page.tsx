"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { ShoppingCart, X } from "lucide-react"; // Import icon tambahan
import { Button } from "@/components/ui/button";

import CashierHeader from "@/components/cashier/CashierHeader";
import CartSidebar from "@/components/cashier/CartSidebar";
import PaymentDialog from "@/components/cashier/PaymentDialog";
import SuccessDialog from "@/components/cashier/SuccessDialog";
import ProductFilter from "@/components/cashier/ProductFilter";
import ProductGrid from "@/components/cashier/ProductGrid";
import { cn } from "@/lib/utils";

export default function KasirPage() {
  const router = useRouter();
  const productStore = useProductStore();
  const cartStore = useCartStore();
  const authStore = useAuthStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  
  // State untuk mengontrol drawer keranjang di Mobile
  const [showMobileCart, setShowMobileCart] = useState(false);

  const handleLogout = () => {
    authStore.logout();
    router.replace("/login");
  };

  const filteredProducts = useMemo(() => {
    return productStore.products.filter((p: any) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !category || p.categoryId === category;
      return matchSearch && matchCategory;
    });
  }, [productStore.products, search, category]);

  return (
    <div className="flex h-screen w-full bg-[#0B0F1A] text-gray-100 overflow-hidden relative">
      {/* AREA KIRI: PRODUK */}
      <section className="flex flex-1 flex-col min-w-0 w-full">
        <div className="shrink-0 px-4 md:px-8 pt-6">
          <CashierHeader onLogout={handleLogout} />
          <ProductFilter
            search={search}
            onSearch={setSearch}
            category={category}
            onCategory={setCategory}
            categories={productStore.categories}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-24 md:pb-8">
          <ProductGrid
            products={filteredProducts}
            addToCart={cartStore.addToCart}
          />
        </div>
      </section>

      {/* FLOATING ACTION BUTTON (Hanya muncul di Mobile) */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-blue-600 shadow-2xl shadow-blue-500/40"
          onClick={() => setShowMobileCart(true)}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartStore.items.length > 0 && (
              <span className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold border-2 border-[#0B0F1A]">
                {cartStore.items.length}
              </span>
            )}
          </div>
        </Button>
      </div>

      {/* AREA KANAN: KERANJANG (Responsive Sidebar) */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:relative lg:inset-auto lg:flex transition-transform duration-300 ease-in-out",
          showMobileCart ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Overlay untuk menutup mobile cart saat klik luar */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setShowMobileCart(false)}
        />
        
        <div className="relative ml-auto h-full w-[90%] max-w-[400px] lg:w-[400px]">
          {/* Tombol Close Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-[60] text-white lg:hidden"
            onClick={() => setShowMobileCart(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          <CartSidebar
            cart={cartStore}
            onPay={() => {
              setPaymentOpen(true);
              setShowMobileCart(false);
            }}
          />
        </div>
      </div>

      {/* DIALOGS */}
      <PaymentDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        cart={cartStore}
        productStore={productStore}
        userId={authStore.user?.id}
        onSuccess={(trx: any) => {
          setLastTransaction(trx);
          setPaymentOpen(false);
          setSuccessOpen(true);
        }}
      />

      <SuccessDialog
        open={successOpen}
        transaction={lastTransaction}
        onClose={() => {
          setSuccessOpen(false);
          setLastTransaction(null);
        }}
      />
    </div>
  );
}