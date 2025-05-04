import React from "react";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "../components/ui/button";
import AudioPreview from "../components/AudioPreview";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  previewAudioUrl?: string;
}

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (params?.id) {
      // Fetch product details
      fetch(`/api/products/${params.id}`)
        .then(res => res.json())
        .then(setProduct);
    }
  }, [params?.id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl} alt={product.name} className="rounded-lg" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-600">{product.description}</p>
          <p className="text-2xl font-bold">${product.price}</p>
          {product.previewAudioUrl && (
            <AudioPreview url={product.previewAudioUrl} />
          )}
          <Button>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
