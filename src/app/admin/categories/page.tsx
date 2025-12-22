"use client";

import { useState } from "react";
import { useProductStore, Category } from "@/stores/productStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";

/* -------------------------------------------------------------------------- */

const Categories = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useProductStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    color: "#6366f1",
  });

  /* ------------------------------------------------------------------------ */

  const resetForm = () => {
    setFormData({ name: "", color: "#6366f1" });
    setEditingCategory(null);
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        color: category.color,
      });
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
      toast.success("Kategori berhasil diperbarui");
    } else {
      addCategory(formData);
      toast.success("Kategori berhasil ditambahkan");
    }

    setIsOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const hasProducts = products.some((p) => p.categoryId === id);
    if (hasProducts) {
      toast.error("Tidak dapat menghapus kategori yang memiliki produk");
      return;
    }
    deleteCategory(id);
    toast.success("Kategori berhasil dihapus");
  };

  const getProductCount = (categoryId: string) =>
    products.filter((p) => p.categoryId === categoryId).length;

  /* ------------------------------------------------------------------------ */

  return (
    <div className="p-6 space-y-6 text-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kategori</h1>
          <p className="text-gray-400">
            Kelola kategori produk Anda
          </p>
        </div>

        {/* Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-gray-900 border border-gray-800">
            <DialogHeader>
              <DialogTitle>
                {editingCategory
                  ? "Edit Kategori"
                  : "Tambah Kategori Baru"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Kategori</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Warna</Label>
                <div className="flex gap-3">
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color: e.target.value,
                      })
                    }
                    className="h-10 w-16 cursor-pointer p-1"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit">
                  {editingCategory ? "Simpan" : "Tambah"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="bg-gray-900 border border-gray-800"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${category.color}20`,
                    }}
                  >
                    <Tags
                      className="h-6 w-6"
                      style={{ color: category.color }}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {getProductCount(category.id)} produk
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDelete(category.id)
                    }
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Categories;
