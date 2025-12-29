import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const SuccessDialog = ({ open, transaction, onClose }: any) => {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-center space-y-6 py-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-10 w-10 text-emerald-500" />
        </div>

        <h2 className="text-2xl font-bold">Transaksi Berhasil</h2>

        <p className="text-gray-400">
          Total: Rp {transaction.total.toLocaleString("id-ID")}
        </p>

        <Button onClick={onClose}>Transaksi Baru</Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
