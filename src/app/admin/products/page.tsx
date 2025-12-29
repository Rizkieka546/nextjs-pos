"use client";

import { useState, useRef, useMemo } from "react";
import { useProductStore, Product } from "@/stores/productStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Package, 
  Search, 
  Image as ImageIcon, 
  Upload, 
  AlertCircle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProductsPage = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProductStore();
  
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "",
  });

  // Filter Data
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 700) { // Limit ~700KB agar tidak membebani localStorage
        toast.error("Ukuran gambar terlalu besar (Maks 700KB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", stock: "", categoryId: "", image: "" });
    setEditingProduct(null);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        categoryId: product.categoryId,
        image: product.image || "",
      });
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast.error("Silahkan pilih kategori");
      return;
    }

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: formData.categoryId,
      image: formData.image,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success("Produk diperbarui");
    } else {
      addProduct(productData);
      toast.success("Produk ditambahkan");
    }

    setIsOpen(false);
    resetForm();
  };

  const getCategoryInfo = (id: string) => {
    return categories.find((c) => c.id === id) || { name: "Tanpa Kategori", color: "#6b7280" };
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#0B0F1A] min-h-screen text-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Daftar Produk</h1>
          <p className="text-gray-400">Manajemen inventaris stok dan harga barang.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Detail Produk" : "Tambah Produk Baru"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Image Upload Area */}
              <div className="space-y-2">
                <Label className="text-gray-400">Foto Produk</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative h-32 w-full border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-gray-800/50 transition-all overflow-hidden"
                >
                  {formData.image ? (
                    <>
                      <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Button type="button" variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={removeImage}>
                            <X className="h-4 w-4" />
                         </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-1">
                      <ImageIcon className="w-8 h-8 text-gray-600 mx-auto" />
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Pilih Gambar</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input id="name" value={formData.name} className="bg-gray-800 border-gray-700 focus:ring-blue-500" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input id="price" type="number" value={formData.price} className="bg-gray-800 border-gray-700" onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok</Label>
                  <Input id="stock" type="number" value={formData.stock} className="bg-gray-800 border-gray-700" onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Pilih kategori produk" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">Batal</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[100px]">
                  {editingProduct ? "Simpan Perubahan" : "Buat Produk"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Table Area */}
      <Card className="bg-gray-900 border-gray-800 overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-gray-800 bg-gray-900/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari nama produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-800/30">
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="w-[300px] text-gray-400">Info Produk</TableHead>
                  <TableHead className="text-gray-400">Kategori</TableHead>
                  <TableHead className="text-right text-gray-400">Harga</TableHead>
                  <TableHead className="text-right text-gray-400">Stok</TableHead>
                  <TableHead className="text-right text-gray-400 px-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const cat = getCategoryInfo(product.categoryId);
                    const isLowStock = product.stock < 10;

                    return (
                      <TableRow key={product.id} className="border-gray-800 hover:bg-gray-800/20 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                              {product.image ? (
                                <img src={product.image} className="h-full w-full object-cover" alt="" />
                              ) : (
                                <Package className="h-6 w-6 text-gray-600" />
                              )}
                            </div>
                            <span className="font-bold text-gray-200 uppercase tracking-tight text-sm">
                              {product.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                             <span className="text-xs font-medium text-gray-300">{cat.name}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-right font-mono text-emerald-400 font-bold">
                          Rp {product.price.toLocaleString("id-ID")}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className={cn(
                              "text-sm font-bold",
                              isLowStock ? "text-orange-500" : "text-gray-300"
                            )}>
                              {product.stock}
                            </span>
                            {isLowStock && (
                              <span className="text-[10px] flex items-center gap-1 text-orange-500/80 font-medium">
                                <AlertCircle className="h-2 w-2" /> Stok Rendah
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right px-6">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500" onClick={() => handleOpenDialog(product)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => deleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-60 text-center text-gray-500 italic">
                      Produk tidak ditemukan...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;