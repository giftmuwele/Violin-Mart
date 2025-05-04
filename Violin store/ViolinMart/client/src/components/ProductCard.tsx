import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "../lib/queryClient";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import AudioPreview from "./AudioPreview";
import type { Product } from "@shared/schema";
import React from "react";
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const addToCart = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive"
      });
    }
  });

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart.mutateAsync();
    setIsAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          {product.previewAudioUrl && (
            <AudioPreview audioUrl={product.previewAudioUrl} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-square relative mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover rounded-md"
          />
        </div>
        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
        <p className="text-lg font-semibold">${product.price}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={isAdding || product.inStock === 0}
        >
          {product.inStock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}