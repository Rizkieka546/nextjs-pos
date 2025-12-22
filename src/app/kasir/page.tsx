"use client";

import { useState } from "react";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { toast } from "sonner";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  ShoppingCart,
  Check,
  Package,
} from "lucide-react";

const Cashier = () => {
  const { products, categories, decreaseStock } =
    useProductStore();
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    checkout,
  } = useCartStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] =
    useState(false);
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card"
  >("cash");
  const [showSuccess, setShowSuccess] =
    useState(false);
  const [lastTransaction, setLastTransaction] =
    useState<any>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const total = getTotal();

  const handlePayment = () => {
    if (items.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }
    setIsPaymentOpen(true);
    setAmountPaid(total.toString());
  };

  const processPayment = () => {
    const paid = parseFloat(amountPaid);
    if (isNaN(paid) || paid < total) {
      toast.error("Jumlah pembayaran tidak mencukupi");
      return;
    }

    items.forEach((item) => {
      decreaseStock(
        item.product.id,
        item.quantity,
      );
    });

    const transaction = checkout(
      paymentMethod,
      paid,
      user?.id || "",
    );

    setLastTransaction(transaction);
    setIsPaymentOpen(false);
    setShowSuccess(true);
    toast.success("Transaksi berhasil!");
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setLastTransaction(null);
    setAmountPaid("");
  };

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)
      ?.name || "-";



  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-gray-100">
      <section className="flex flex-1 flex-col overflow-hidden p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">
            Kasir
          </h1>
          <p className="text-gray-400">
            Pilih produk untuk transaksi
          </p>
        </header>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="bg-gray-800 border-gray-700 pl-10 text-gray-100 placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={
                selectedCategory === null
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setSelectedCategory(null)
              }
            >
              Semua
            </Button>

            {categories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={
                  selectedCategory === cat.id
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setSelectedCategory(cat.id)
                }
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-4 pb-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer border-gray-700 bg-gray-800 hover:border-blue-500 transition"
                onClick={() => {
                  if (product.stock > 0) {
                    addToCart(product);
                    toast.success(
                      `${product.name} ditambahkan`,
                    );
                  } else {
                    toast.error("Stok habis");
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="mb-3 flex aspect-square items-center justify-center rounded-lg bg-gray-900">
                    <Package className="h-10 w-10 text-gray-500" />
                  </div>

                  <h3 className="truncate font-medium">
                    {product.name}
                  </h3>
                  <p className="mb-2 text-xs text-gray-400">
                    {getCategoryName(
                      product.categoryId,
                    )}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-500">
                      Rp{" "}
                      {product.price.toLocaleString(
                        "id-ID",
                      )}
                    </span>
                    <span
                      className={`text-xs ${
                        product.stock < 10
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      Stok: {product.stock}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </section>

      <aside className="flex w-96 flex-col border-l border-gray-800 bg-gray-900">
        <div className="border-b border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                Keranjang
              </h2>
              <p className="text-sm text-gray-400">
                {items.length} item
              </p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <ScrollArea className="flex-1 p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="mb-4 h-16 w-16 opacity-20" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <Card
                  key={item.product.id}
                  className="border-gray-700 bg-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex justify-between">
                      <div>
                        <h4 className="font-medium">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Rp{" "}
                          {item.product.price.toLocaleString(
                            "id-ID",
                          )}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-500/15"
                        onClick={() =>
                          removeFromCart(
                            item.product.id,
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              : removeFromCart(
                                  item.product.id,
                                )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            item.quantity <
                            item.product.stock
                              ? updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              : toast.error(
                                  "Stok tidak mencukupi",
                                )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <span className="font-bold">
                        Rp{" "}
                        {(
                          item.product.price *
                          item.quantity
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Cart Footer */}
        <div className="space-y-4 border-t border-gray-800 p-6">
          <div className="flex justify-between text-lg">
            <span>Total</span>
            <span className="font-bold text-blue-500">
              Rp{" "}
              {total.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={items.length === 0}
              onClick={() => {
                clearCart();
                toast.info(
                  "Keranjang dikosongkan",
                );
              }}
            >
              Bersihkan
            </Button>
            <Button
              className="flex-1"
              disabled={items.length === 0}
              onClick={handlePayment}
            >
              Bayar
            </Button>
          </div>
        </div>
      </aside>

      {/* ======================= PAYMENT ======================= */}
      <Dialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Pembayaran
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-center">
              <p className="mb-2 text-gray-400">
                Total Pembayaran
              </p>
              <p className="text-4xl font-bold text-blue-500">
                Rp{" "}
                {total.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">
                Metode Pembayaran
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="h-20 flex-col gap-2"
                  variant={
                    paymentMethod === "cash"
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setPaymentMethod("cash")
                  }
                >
                  <Banknote className="h-6 w-6" />
                  Tunai
                </Button>
                <Button
                  className="h-20 flex-col gap-2"
                  variant={
                    paymentMethod === "card"
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                >
                  <CreditCard className="h-6 w-6" />
                  Kartu
                </Button>
              </div>
            </div>

            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Jumlah Dibayar
                </label>
                <Input
                  type="number"
                  value={amountPaid}
                  onChange={(e) =>
                    setAmountPaid(e.target.value)
                  }
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
                {parseFloat(amountPaid) >=
                  total && (
                  <p className="text-sm text-emerald-500">
                    Kembalian: Rp{" "}
                    {(
                      parseFloat(amountPaid) -
                      total
                    ).toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={processPayment}
            >
              Proses Pembayaran
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================= SUCCESS ======================= */}
      <Dialog
        open={showSuccess}
        onOpenChange={closeSuccess}
      >
        <DialogContent className="text-center">
          <div className="space-y-6 py-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <Check className="h-10 w-10 text-emerald-500" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Transaksi Berhasil!
              </h2>
              <p className="text-gray-400">
                Pembayaran telah diproses
              </p>
            </div>

            {lastTransaction && (
              <div className="space-y-2 rounded-lg bg-gray-900 p-4 text-left">
                <Row label="No. Transaksi">
                  #{lastTransaction.id.slice(-6)}
                </Row>
                <Row label="Total">
                  Rp{" "}
                  {lastTransaction.total.toLocaleString(
                    "id-ID",
                  )}
                </Row>
                <Row label="Dibayar">
                  Rp{" "}
                  {lastTransaction.amountPaid.toLocaleString(
                    "id-ID",
                  )}
                </Row>
                <Row
                  label="Kembalian"
                  highlight
                >
                  Rp{" "}
                  {lastTransaction.change.toLocaleString(
                    "id-ID",
                  )}
                </Row>
              </div>
            )}

            <Button
              className="w-full"
              onClick={closeSuccess}
            >
              Transaksi Baru
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};


const Row = ({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">
      {label}
    </span>
    <span
      className={
        highlight
          ? "font-bold text-emerald-500"
          : "font-medium"
      }
    >
      {children}
    </span>
  </div>
);

export default Cashier;
