"use client";

import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  TrendingUp,
  Package,
  ShoppingCart as CartIcon,
  DollarSign,
  BarChart3,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { products, categories } = useProductStore();
  const { transactions } = useCartStore();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);

  const revenueByDate = transactions.reduce<Record<string, number>>((acc, trx) => {
    const dateKey = new Date(trx.timestamp).toISOString().split("T")[0];
    acc[dateKey] = (acc[dateKey] || 0) + trx.total;
    return acc;
  }, {});

  const chartData = Object.entries(revenueByDate)
    .map(([date, total]) => ({
      dateRaw: date,
      dateLabel: new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      total,
    }))
    .sort((a, b) => a.dateRaw.localeCompare(b.dateRaw))
    .slice(-7);

  const lowStockProducts = products.filter((p) => p.stock < 10);

  const stats = [
    {
      title: "Total Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Transaksi",
      value: totalTransactions,
      icon: CartIcon,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Produk",
      value: totalProducts,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Kategori",
      value: totalCategories,
      icon: BarChart3,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="min-h-full space-y-8 p-8 text-gray-100 bg-gray-900/50">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-gray-400">Ringkasan aktivitas toko dan performa penjualan.</p>
      </div>

      {/* Statistik Utama */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-gray-800 bg-gray-800/50 transition-all hover:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight">{stat.value}</h3>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart & Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Grafik Pendapatan */}
        <Card className="col-span-1 border-gray-800 bg-gray-800/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Pendapatan (7 Hari Terakhir)
            </CardTitle>
            <CardDescription className="text-gray-500">Urutan kronologis dari kiri (lama) ke kanan (baru)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                  <XAxis
                    dataKey="dateLabel"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    tickFormatter={(value) => `Rp ${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                    }}
                    formatter={(value: any) => {
                      const amount = typeof value === "number" ? value : 0;
                      return [`Rp ${amount.toLocaleString("id-ID")}`, "Pendapatan"];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500 italic">
                Belum ada data transaksi untuk ditampilkan
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produk Stok Rendah */}
        <Card className="border-gray-800 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-900/50 border border-gray-800">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Sisa: {product.stock}</p>
                    </div>
                    <div className={cn(
                      "h-2 w-12 rounded-full",
                      product.stock <= 2 ? "bg-red-500" : "bg-orange-500"
                    )} />
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm">Semua stok aman.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaksi Terbaru */}
      <Card className="border-gray-800 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-hidden rounded-xl border border-gray-800">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.slice(-5).reverse().map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-800/30 transition-colors text-gray-300">
                    <td className="px-4 py-3 font-mono text-blue-400">#{trx.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3 text-xs">
                      {new Date(trx.timestamp).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">
                      Rp {trx.total.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;