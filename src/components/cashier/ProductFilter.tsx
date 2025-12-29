"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductFilter = ({
  search,
  onSearch,
  category,
  onCategory,
  categories,
}: any) => {
  return (
    <div className="space-y-4 sticky top-0 bg-[#0B0F1A] z-20 pb-4">
      {/* Input Pencarian */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Cari produk berdasarkan nama..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 h-11 bg-gray-800/50 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl transition-all"
        />
      </div>

      {/* Filter Kategori (Scrollable Horisontal di Mobile) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
          <Layers className="h-3 w-3" />
          <span>Kategori</span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth whitespace-nowrap">
          <Button
            size="sm"
            variant={!category ? "default" : "outline"}
            className={cn(
              "rounded-full px-5 h-9 transition-all",
              !category 
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" 
                : "border-gray-700 hover:bg-gray-800 text-gray-400"
            )}
            onClick={() => onCategory(null)}
          >
            Semua Produk
          </Button>

          {categories.map((c: any) => (
            <Button
              key={c.id}
              size="sm"
              variant={category === c.id ? "default" : "outline"}
              className={cn(
                "rounded-full px-5 h-9 transition-all",
                category === c.id 
                  ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" 
                  : "border-gray-700 hover:bg-gray-800 text-gray-400"
              )}
              onClick={() => onCategory(c.id)}
            >
              {c.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;