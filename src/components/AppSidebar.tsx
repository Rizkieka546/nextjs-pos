"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Otomatis tutup sidebar mobile saat pindah halaman
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Data Navigasi khusus Admin
  const adminLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Produk" },
    { href: "/admin/categories", icon: Tags, label: "Kategori" },
    { href: "/admin/users", icon: Users, label: "Pengguna" },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      {/* MOBILE TRIGGER (Hanya muncul di HP) */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-[#0B0F1A] border-gray-800 text-white shadow-xl"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR CORE */}
      <aside
        className={cn(
          // h-screen & overflow-hidden: Mengunci agar tidak bisa di-scroll
          "fixed inset-y-0 left-0 z-[70] flex h-screen flex-col overflow-hidden border-r border-gray-800 bg-[#0B0F1A] transition-all duration-300 lg:relative",
          collapsed ? "w-[75px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* HEADER SECTION */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 px-4">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap uppercase">
                  Store<span className="text-blue-500">POS</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => (isMobileOpen ? setIsMobileOpen(false) : setCollapsed(!collapsed))}
            className={cn(
              "text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
              collapsed && "mx-auto"
            )}
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
            )}
          </Button>
        </div>

        {/* NAVIGATION SECTION */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-hidden">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
                )}
              >
                <link.icon className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-white" : "group-hover:text-blue-400"
                )} />
                
                {/* Text & Tooltip Logic */}
                <span className={cn(
                  "transition-all duration-200 whitespace-nowrap",
                  collapsed 
                    ? "lg:opacity-0 lg:absolute lg:left-14 lg:bg-[#151b2b] lg:px-3 lg:py-1.5 lg:rounded-md lg:shadow-xl lg:border lg:border-gray-700 lg:z-50 group-hover:lg:opacity-100 group-hover:lg:translate-x-2" 
                    : "opacity-100"
                )}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER SECTION */}
        <div className="shrink-0 border-t border-gray-800 bg-[#0D121F]/50 p-3">
          <AnimatePresence>
            {!collapsed && user && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-3 rounded-xl bg-gray-800/30 p-2 border border-gray-700/30 shadow-inner"
              >
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {user.name?.substring(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-100 leading-tight">
                    {user.name}
                  </p>
                  <p className="truncate text-[10px] text-gray-500 uppercase tracking-tighter">
                    Admin
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full gap-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="font-medium text-sm">Keluar</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;