"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ProductGrid from "./ProductGrid";

const ProductSection = ({
  products,
  categories,
  addToCart,
  stickyOnly,
  onlyGrid,
}: any) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filteredProducts = products.filter((p: any) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || p.categoryId === category;
    return matchSearch && matchCategory;
  });

  if (stickyOnly) {
    return (
      <div className="space-y-4 sticky top-0 bg-gray-900 z-10 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={!category ? "default" : "outline"}
            onClick={() => setCategory(null)}
          >
            Semua
          </Button>

          {categories.map((c: any) => (
            <Button
              key={c.id}
              size="sm"
              variant={category === c.id ? "default" : "outline"}
              onClick={() => setCategory(c.id)}
            >
              {c.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (onlyGrid) {
    return (
      <ProductGrid
        products={filteredProducts}
        addToCart={addToCart}
      />
    );
  }

  return null;
};

export default ProductSection;
