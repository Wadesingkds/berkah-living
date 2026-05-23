"use client";

import { useState } from "react";
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

  return (
    <div className="min-h-full bg-background pb-20">
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-bold">{storeSettings.store_name || 'Berkah Living'}</h1>
            <p className="text-xs opacity-80">{storeSettings.store_description || 'Ayam Organik & Daging Segar'}</p>
          </div>
          <Badge className={isStoreOpen ? "bg-green-400 text-green-900" : "bg-red-400 text-red-900"}>
            {isStoreOpen ? 'Buka' : 'Tutup'}
          </Badge>
        </div>
        <p className="text-xs opacity-70">Jam: {storeSettings.opening_hours || '06:00'} - {storeSettings.closing_hours || '18:00'} | {storeSettings.store_address || 'Kudus, Jateng'}</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                activeCategory === c
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => {
            const qty = getQty(p.id);
            return (
              <Card key={p.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-lg font-bold text-primary mb-2">
                    Rp {p.price.toLocaleString("id-ID")}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {p.stock > 0 ? (
                        <span className="text-green-600">Stok: {p.stock}</span>
                      ) : (
                        <span className="text-red-600">Habis</span>
                      )}
                    </div>
                    {qty === 0 ? (
                      <Button
                        size="sm"
                        onClick={() => addItem(p.id, p.name, p.price, 1)}
                        disabled={p.stock === 0}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQty(p.id, qty - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium">{qty}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQty(p.id, qty + 1)}
                          disabled={p.stock <= qty}
                        >
                          <Plus className="w-4 h-4" />
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

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <Link href="/cart">
            <Button className="w-full" size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Lihat Keranjang ({totalItems} item)
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}