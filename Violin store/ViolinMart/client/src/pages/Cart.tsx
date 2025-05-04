
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import CartItem from "../components/CartItem";
import type { CartItem as CartItemType, Product } from "shared/schema";
import React from "react";

export default function Cart() {
  const { data: cartItems, isLoading: isLoadingCart } = useQuery<CartItemType[]>({
    queryKey: ["/api/cart"]
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  if (isLoadingCart || isLoadingProducts) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!cartItems?.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    const product = products?.find(p => p.id === item.productId);
    return sum + (product ? parseFloat(product.price) * item.quantity : 0);
  }, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const product = products?.find(p => p.id === item.productId);
          if (!product) return null;
          return <CartItem key={item.id} item={item} product={product} />;
        })}
      </div>

      <Separator className="my-8" />

      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-medium">Total</span>
        <span className="text-2xl font-bold">${total.toFixed(2)}</span>
      </div>

      <div className="flex gap-4">
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
        <Link href="/checkout">
          <Button>Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
