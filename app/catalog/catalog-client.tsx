"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import { ShoppingCart, Package, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";

interface StoreSettings {
  id: string;
  store_name: string;
  store_description: string;
  store_address: string;
  opening_hours: string;
  closing_hours: string;
  is_open: boolean;
}

interface CatalogClientProps {
  storeSettings: StoreSettings;
  products: Product[];
}

const categories = ["Semua", "Ayam", "Daging", "Sayur", "Bumbu"];

export function CatalogClient({ storeSettings, products }: CatalogClientProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const { items, addItem, updateQty } = useCartStore();
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  // Calculate if store is open based on current time and opening hours
  const calculateIsStoreOpen = () => {
    if (!storeSettings.opening_hours || !storeSettings.closing_hours) {
      return storeSettings.is_open;
    }

    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    // Parse opening and closing times
    const [openHour, openMinute] = storeSettings.opening_hours.split(':').map(Number);
    const [closeHour, closeMinute] = storeSettings.closing_hours.split(':').map(Number);
    
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Check if current time is within opening hours
    const isWithinHours = currentTimeInMinutes >= openTime && currentTimeInMinutes <= closeTime;
    
    // Store is open if: manual override is_open AND within opening hours
    return storeSettings.is_open && isWithinHours;
  };

  const isStoreOpen = calculateIsStoreOpen();

  const filtered = products.filter(() => {
    if (activeCategory !== "Semua") return true; // TODO: filter by category_id
    return true;
  });

  const getQty = (id: string) => items.find((i) => i.productId === id)?.qty || 0;

  // Featured product (first one with stock)
  const featured = filtered.find(p => p.stock > 0);

  return (
    <div className="min-h-full bg-background pb-24">
      {/* Hero Header with Brand Warmth */}
      <div className="bg-gradient-to-br from-primary via-primary to-secondary text-white p-6 pb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Image 
                src="/logo-wordmark.png" 
                alt="LocalHub" 
                width={200} 
                height={60}
                className="h-auto"
              />
            </div>
            <p className="text-sm opacity-90">{storeSettings.store_description || 'Ayam Organik & Daging Segar'}</p>
          </div>
          <Badge className={`${isStoreOpen ? "bg-accent text-white" : "bg-red-500 text-white"} font-semibold px-3 py-1`}>
            {isStoreOpen ? '✓ Buka' : '✕ Tutup'}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs opacity-85">
          <span>📍 {storeSettings.store_address || 'Kudus, Jateng'}</span>
        </div>
        <div className="flex items-center gap-1 text-xs opacity-85 mt-1">
          <span>🕐 {storeSettings.opening_hours || '06:00'} - {storeSettings.closing_hours || '18:00'}</span>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Featured Product Highlight */}
        {featured && (
          <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg p-4 border border-secondary/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center overflow-hidden">
                  {featured.imageUrl ? (
                    <img src={featured.imageUrl} alt={featured.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-secondary" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wide">Pilihan Hari Ini</p>
                <h3 className="font-bold text-sm text-foreground mt-0.5 line-clamp-2">{featured.name}</h3>
                <p className="text-lg font-bold text-primary mt-1">Rp {featured.price.toLocaleString("id-ID")}</p>
                <p className="text-xs text-accent font-medium mt-1">Stok: {featured.stock}</p>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter with Better Styling */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Kategori</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === c
                    ? "bg-primary text-white shadow-md scale-105"
                    : "bg-muted text-foreground hover:bg-secondary/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid with Varied Layouts */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Produk Tersedia</p>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p, idx) => {
              const qty = getQty(p.id);
              const isOutOfStock = p.stock === 0;
              // Vary card styling for visual interest
              const isHighlight = idx % 5 === 0;
              
              return (
                <Card 
                  key={p.id} 
                  className={`overflow-hidden transition-all hover:shadow-lg ${
                    isHighlight ? "ring-2 ring-secondary/30" : ""
                  } ${isOutOfStock ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-3">
                    {/* Product Image with Badge */}
                    <div className="relative mb-2">
                      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                      {isHighlight && (
                        <div className="absolute top-2 right-2 bg-secondary text-foreground text-xs font-bold px-2 py-1 rounded-full">
                          ⭐
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                          <span className="text-white font-bold text-sm">Habis</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-foreground">
                      {p.name}
                    </h3>
                    <p className="text-base font-bold text-primary mb-2">
                      Rp {p.price.toLocaleString("id-ID")}
                    </p>

                    {/* Stock Status */}
                    <div className="mb-2">
                      {p.stock > 0 ? (
                        <span className="text-xs font-medium text-accent">✓ Stok: {p.stock}</span>
                      ) : (
                        <span className="text-xs font-medium text-red-600">Stok habis</span>
                      )}
                    </div>

                    {/* Add to Cart Controls */}
                    <div className="flex items-center justify-between gap-2">
                      {qty === 0 ? (
                        <Button
                          size="sm"
                          onClick={() => addItem({ productId: p.id, name: p.name, price: p.price, qty: 1 })}
                          disabled={isOutOfStock}
                          className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Tambah
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1 flex-1 bg-muted rounded-md p-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQty(p.id, qty - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="flex-1 text-center font-bold text-sm">{qty}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQty(p.id, qty + 1)}
                            disabled={p.stock <= qty}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary/20 p-4 shadow-2xl">
          <Link href="/cart">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-base shadow-lg" size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Lihat Keranjang ({totalItems} item)
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}