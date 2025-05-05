import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import type { CartItem as CartItemType, Product } from "../../../shared/schema";
import React from "react";
interface CartItemProps {
  item: CartItemType;
  product: Product;
}

export default function CartItem({ item, product }: CartItemProps) {
  const { toast } = useToast();

  const updateQuantity = useMutation({
    mutationFn: async (quantity: number) => {
      await apiRequest("PATCH", `/api/cart/${item.id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive"
      });
    }
  });

  const removeItem = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: `${product.name} has been removed from your cart.`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-20 h-20 relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">${product.price}</p>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          max={product.inStock}
          value={item.quantity}
          onChange={(e) => updateQuantity.mutate(parseInt(e.target.value))}
          className="w-20"
        />
        
        <Button
          className="ghost"
          onClick={() => removeItem.mutate()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
