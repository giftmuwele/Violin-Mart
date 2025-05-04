import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Music2 } from "lucide-react";
import { Button } from "../components/ui/button";
import SearchBar from "./SearchBar";
import type { CartItem } from "@shared/schema";
import React from "react";
export default function Navbar() {
  const { data: cartItems } = useQuery<CartItem[]>({ 
    queryKey: ["/api/cart"]
  });

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="border-b border-primary/20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center gap-2">
                <Music2 className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">Dolce Vita</span>
              </a>
            </Link>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button className="hover:bg-primary/20">Products</Button>
            </Link>
            <Link href="/cart">
              <Button className="relative hover:bg-primary/20 border border-primary">
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}