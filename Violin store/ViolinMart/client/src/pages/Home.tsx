import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Music, Music4, GalleryHorizontal } from "lucide-react";
import React from "react";
export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="py-20 px-4 text-center bg-gradient-to-b from-primary/10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">
            Start Your Musical Journey with Dolce Vita
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover our premium selection of violins, bows, and accessories
          </p>
          <Link href="/products">
            <Button className="gap-2 text-lg py-3 px-6">
              <Music className="h-5 w-5" />
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Featured Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Violins", icon: Music4 },
              { title: "Bows", icon: GalleryHorizontal },
              { title: "Accessories", icon: Music }
            ].map((category) => (
              <Link key={category.title} href={`/products?category=${category.title.toLowerCase()}`}>
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <category.icon className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-medium">{category.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}