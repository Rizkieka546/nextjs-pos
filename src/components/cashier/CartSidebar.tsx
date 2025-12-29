"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import CartItemRow from "./CartItemRow";

const CartSidebar = ({ cart, onPay }: any) => {
  const { items, clearCart, getTotal } = cart;
  const total = getTotal();

  return (
    <aside className="flex h-screen w-96 flex-col border-l border-gray-800 bg-[#0B0F1A]">
      {/* Header Tetap */}
      <div className="shrink-0 border-b border-gray-800 p-6 flex justify-between items-center">
        <div className="flex gap-3">
           <ShoppingCart className="h-5 w-5 text-blue-500" />
           <h2 className="font-bold">Keranjang</h2>
        </div>
        <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded-md">
          {items.length} Items
        </span>
      </div>

      {/* Area Scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
            <ShoppingCart className="h-12 w-12 opacity-20" />
            <p className="text-sm">Mulai pilih produk</p>
          </div>
        ) : (
          items.map((item: any) => <CartItemRow key={item.product.id} item={item} cart={cart} />)
        )}
      </div>

      {/* Footer sticky */}
      <div className="shrink-0 border-t border-gray-800 p-6 bg-[#0D121F]">
        <div className="flex justify-between items-end mb-4">
          <span className="text-gray-400 text-sm">Subtotal</span>
          <span className="text-2xl font-bold text-blue-500">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={clearCart} disabled={items.length === 0}>
             Bersihkan
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onPay} disabled={items.length === 0}>
             Bayar Sekarang
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default CartSidebar;
