"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Banknote, CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PaymentDialog = ({
  open,
  onClose,
  cart,
  productStore,
  userId,
  onSuccess,
}: any) => {
  const [method, setMethod] = useState<"cash" | "card">("cash");
  const [paid, setPaid] = useState("");

  const total = cart.getTotal();

  const processPayment = () => {
    const amount = Number(paid);

    if (method === "cash" && amount < total) {
      toast.error("Pembayaran tidak mencukupi");
      return;
    }

    cart.items.forEach((item: any) => {
      productStore.decreaseStock(item.product.id, item.quantity);
    });

    const trx = cart.checkout(method, amount, userId);
    onSuccess(trx);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-3xl font-bold text-blue-500">
            Rp {total.toLocaleString("id-ID")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={method === "cash" ? "default" : "outline"}
              onClick={() => setMethod("cash")}
            >
              <Banknote className="mr-2 h-4 w-4" /> Tunai
            </Button>
            <Button
              variant={method === "card" ? "default" : "outline"}
              onClick={() => setMethod("card")}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Kartu
            </Button>
          </div>

          {method === "cash" && (
            <Input
              type="number"
              placeholder="Jumlah dibayar"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
            />
          )}

          <Button size="lg" onClick={processPayment}>
            Proses Pembayaran
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
