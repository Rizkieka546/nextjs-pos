"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  ShoppingCart,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuthStore();

  const adminLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Produk" },
    { href: "/admin/categories", icon: Tags, label: "Kategori" },
    { href: "/admin/users", icon: Users, label: "Pengguna" },
  ];

  const cashierLinks = [
    { href: "/kasir", icon: ShoppingCart, label: "Transaksi" },
  ];

  const links = user?.role === "admin" ? adminLinks : cashierLinks;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-100">
                POS
              </h1>
              <p className="text-xs capitalize text-gray-400">
                {user?.role}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
        >
          {collapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100",
              )}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-3">
        {!collapsed && user && (
          <div className="mb-3 px-3 py-2">
            <p className="truncate text-sm font-medium text-gray-100">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-400">
              {user.email}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-gray-400 hover:bg-purple-500/15 hover:text-purple-500",
            collapsed && "justify-center px-0",
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
