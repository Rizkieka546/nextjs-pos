"use client";

import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  TrendingUp,
  Package,
  ShoppingCart as CartIcon,
  DollarSign,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const { products, categories } = useProductStore();
  const { transactions } = useCartStore();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + t.total,
    0,
  );

  const stats = [
    {
      title: "Total Produk",
      value: totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Kategori",
      value: totalCategories,
      icon: BarChart3,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Transaksi",
      value: totalTransactions,
      icon: CartIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  const lowStockProducts = products.filter(
    (p) => p.stock < 10,
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Selamat datang di sistem POS
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}
                >
                  <stat.icon
                    className={`h-6 w-6 ${stat.color}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Produk Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                Semua produk memiliki stok cukup
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
                  >
                    <span className="font-medium">
                      {product.name}
                    </span>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        product.stock === 0
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {product.stock} tersisa
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CartIcon className="h-5 w-5 text-blue-600" />
              Transaksi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                Belum ada transaksi
              </p>
            ) : (
              <div className="space-y-3">
                {transactions
                  .slice(-5)
                  .reverse()
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
                    >
                      <div>
                        <p className="font-medium">
                          #{transaction.id.slice(-6)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            transaction.timestamp,
                          ).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <span className="font-bold text-emerald-600">
                        Rp{" "}
                        {transaction.total.toLocaleString(
                          "id-ID",
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
