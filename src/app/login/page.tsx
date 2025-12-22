"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { ShoppingBag, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password);

      if (success) {
        toast.success("Login berhasil!");
        router.push("/");
      } else {
        toast.error("Email atau password salah");
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-900 p-4">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <Card className="w-full max-w-md border border-gray-700 bg-gray-800/80 backdrop-blur shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 shadow-md shadow-blue-500/20">
            <ShoppingBag className="h-8 w-8 text-blue-500" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-gray-100">
              POS System
            </CardTitle>
            <CardDescription className="text-gray-400">
              Masuk ke akun Anda untuk melanjutkan
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-300"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-500 focus-visible:ring-blue-500 pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="border-gray-700 bg-gray-900 text-gray-100 placeholder:text-gray-500 focus-visible:ring-blue-500 pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading
                ? "Memproses..."
                : "Masuk"}
            </Button>
          </form>

          {/* Demo akun */}
          <div className="mt-6 rounded-lg border border-gray-700 bg-gray-900/60 p-4">
            <p className="mb-2 text-sm text-gray-400">
              Demo Akun:
            </p>
            <div className="space-y-1 text-xs text-gray-300">
              <p>
                <span className="font-medium text-blue-500">
                  Admin:
                </span>{" "}
                admin@pos.com / admin123
              </p>
              <p>
                <span className="font-medium text-emerald-500">
                  Kasir:
                </span>{" "}
                kasir@pos.com / kasir123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
