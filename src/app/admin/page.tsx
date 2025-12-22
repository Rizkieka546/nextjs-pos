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

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* -------------------------------------------------------------------------- */

const Dashboard = () => {
  const { products, categories } = useProductStore();
  const { transactions } = useCartStore();

  /* ------------------------------ KPI Values ------------------------------ */

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + t.total,
    0
  );

  /* -------------------------- Revenue Chart Data -------------------------- */

  const revenueByDate = transactions.reduce<Record<string, number>>(
    (acc, trx) => {
      const date = new Date(trx.timestamp).toLocaleDateString("id-ID");
      acc[date] = (acc[date] || 0) + trx.total;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(revenueByDate).map(
    ([date, total]) => ({
      date,
      total,
    })
  );

  /* ----------------------------- Low Stock -------------------------------- */

  const lowStockProducts = products.filter((p) => p.stock < 10);

  /* ------------------------------- KPI List -------------------------------- */

  const stats = [
    {
      title: "Total Produk",
      value: totalProducts,
      icon: Package,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/15",
    },
    {
      title: "Kategori",
      value: totalCategories,
      icon: BarChart3,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/15",
    },
    {
      title: "Transaksi",
      value: totalTransactions,
      icon: CartIcon,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-500/15",
    },
    {
      title: "Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      icon: DollarSign,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/15",
    },
  ];

  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6 p-6 text-gray-100">
      {/* ========================== HEADER ========================== */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">
          Ringkasan aktivitas dan performa penjualan
        </p>
      </div>

      {/* ========================== STATS ========================== */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-gray-700 bg-gray-800"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
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
                    className={`h-6 w-6 ${stat.iconColor}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ========================== CHART ========================== */}
      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Pendapatan Harian
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[300px]">
          {chartData.length === 0 ? (
            <p className="flex h-full items-center justify-center text-gray-400">
              Belum ada data transaksi
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                  formatter={(value) => {
                    if (typeof value === "number") {
                      return `Rp ${value.toLocaleString("id-ID")}`;
                    }
                    return value ?? "";
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ========================== PANELS ========================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low Stock */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Produk Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="py-8 text-center text-gray-400">
                Semua produk memiliki stok cukup
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg bg-gray-900 p-3"
                  >
                    <span className="font-medium">
                      {product.name}
                    </span>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-medium ${product.stock === 0
                          ? "bg-red-500/15 text-red-500"
                          : "bg-yellow-500/15 text-yellow-500"
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

        {/* Recent Transactions */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CartIcon className="h-5 w-5 text-blue-500" />
              Transaksi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="py-8 text-center text-gray-400">
                Belum ada transaksi
              </p>
            ) : (
              <div className="space-y-3">
                {transactions
                  .slice(-5)
                  .reverse()
                  .map((trx) => (
                    <div
                      key={trx.id}
                      className="flex items-center justify-between rounded-lg bg-gray-900 p-3"
                    >
                      <div>
                        <p className="font-medium">
                          #{trx.id.slice(-6)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(
                            trx.timestamp
                          ).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <span className="font-bold text-emerald-500">
                        Rp{" "}
                        {trx.total.toLocaleString("id-ID")}
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
