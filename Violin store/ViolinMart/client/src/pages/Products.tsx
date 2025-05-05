
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ProductCard from "../components/ProductCard";
import { Skeleton } from "../components/ui/skeleton";
import type { Product } from "@shared/schema";
import React from "react";

export default function Products() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const searchQuery = searchParams.get("search");
  
  const { data: products, isLoading } = useQuery<Product[]>({ 
    queryKey: [searchQuery ? "/api/products/search" : "/api/products", searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/products/search?q=${encodeURIComponent(searchQuery)}`
        : "/api/products";
      const res = await fetch(url);
      return res.json();
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {searchQuery ? `Search Results: ${searchQuery}` : "All Products"}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products?.length === 0 ? (
        <p className="text-center text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
