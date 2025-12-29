import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CartItemRow = ({ item, cart }: any) => {
  const { updateQuantity, removeFromCart } = cart;

  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium">{item.product.name}</h4>
            <p className="text-sm text-gray-400">
              Rp {item.product.price.toLocaleString("id-ID")}
            </p>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="text-red-500"
            onClick={() => removeFromCart(item.product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                item.quantity > 1
                  ? updateQuantity(item.product.id, item.quantity - 1)
                  : removeFromCart(item.product.id)
              }
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-8 text-center">{item.quantity}</span>

            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                item.quantity < item.product.stock
                  ? updateQuantity(item.product.id, item.quantity + 1)
                  : toast.error("Stok tidak mencukupi")
              }
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <span className="font-bold">
            Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItemRow;
