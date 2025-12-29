"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ProductGrid = ({ products, addToCart }: any) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-10">
      {products.length > 0 ? (
        products.map((p: any) => {
          const isOutOfStock = p.stock <= 0;
          
          return (
            <Card
              key={p.id}
              className={cn(
                "group relative overflow-hidden border-gray-800 bg-gray-800/30 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 active:scale-95",
                isOutOfStock && "opacity-50 grayscale cursor-not-allowed"
              )}
              onClick={() => {
                if (!isOutOfStock) {
                  addToCart(p);
                  toast.success(`${p.name} masuk keranjang`, {
                    duration: 1000,
                    position: "bottom-center"
                  });
                } else {
                  toast.error("Stok produk ini habis");
                }
              }}
            >
              <CardContent className="p-3">
                {/* Image Display Area */}
                <div className="relative mb-3 flex aspect-square items-center justify-center rounded-xl bg-gray-900 overflow-hidden group-hover:bg-gray-900/50 transition-colors border border-gray-800">
                  {p.image ? (
                    /* Menampilkan Gambar Produk */
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    /* Fallback jika tidak ada gambar */
                    <Package className="h-10 w-10 text-gray-700 group-hover:text-blue-500 transition-transform group-hover:scale-110 duration-300" />
                  )}
                  
                  {/* Overlay Hover: Tombol Plus */}
                  {!isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                       <div className="bg-blue-600 p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <Plus className="h-5 w-5 text-white" />
                       </div>
                    </div>
                  )}

                  {/* Tag Stok Menipis */}
                  {!isOutOfStock && p.stock <= 5 && (
                    <div className="absolute top-2 left-2 bg-orange-600/90 backdrop-blur-md text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tighter text-white z-10 shadow-sm">
                      Limit: {p.stock}
                    </div>
                  )}
                  
                  {/* Overlay Stok Habis */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white border border-white/20 px-2 py-1 rounded bg-black/20">Habis</span>
                    </div>
                  )}
                </div>

                {/* Info Produk */}
                <div className="space-y-1">
                  <h3 className="truncate text-xs font-bold text-gray-200 uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-emerald-400">
                      Rp {p.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        /* State Kosong */
        <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-3xl">
          <Package className="h-12 w-12 mb-2 opacity-10" />
          <p className="text-sm italic opacity-50">Produk tidak ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;