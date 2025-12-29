import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const CashierHeader = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <header className="mb-6 flex justify-between">
      <div>
        <h1 className="text-3xl font-bold">Kasir</h1>
        <p className="text-gray-400">Pilih produk untuk transaksi</p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="gap-2 text-red-400 hover:bg-red-500/15"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </header>
  );
};

export default CashierHeader;
