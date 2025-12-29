"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import AppSidebar from "@/components/AppSidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0B0F1A]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-900/50">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}