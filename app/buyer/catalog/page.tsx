"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import { ShoppingCart, Package, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";

const categories = ["Semua", "Ayam", "Daging", "Sayur", "Bumbu"];

const mockProducts: Product[] = [
  { id: "1", name: "Ayam Kampung Utuh", price: 85000, stock: 12, minStock: 10, categoryId: "cat1", imageUrl: null, isActive: true, createdAt: new Date().toISOString() },
  { id: "2", name: "Ayam Petelur Potong", price: 45000, stock: 3, minStock: 5, categoryId: "cat1", imageUrl: null, isActive: true, createdAt: new Date().toISOString() },
  { id: "3", name: "Daging Sapi Giling", price: 120000, stock: 8, minStock: 5, categoryId: "cat2", imageUrl: null, isActive: true, createdAt: new Date().toISOString() },
  { id: "4", name: "Daging Kambing", price: 150000, stock: 0, minStock: 3, categoryId: "cat2", imageUrl: null, isActive: true, createdAt: new Date().toISOString() },
  { id: "5", name: "Bayam Segar", price: 5000, stock: 20, minStock: 10, categoryId: "cat3", imageUrl: null, isActive: true, createdAt: new Date().toISOString() },
  { id: "6", name: "Bawang Merah", price: 35000, stock: 15, minStock: 5, categoryId: "cat4", imageUrl: null, isActive: true, createdAt: new Date().toISOString() },
];

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const { items, addItem, updateQty } = useCartStore();
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const filtered = mockProducts.filter((p) => {
    if (activeCategory !== "Semua") return true; // TODO: filter by category_id
    return true;
  });

  const getQty = (id: string) => items.find((i) => i.productId === id)?.qty || 0;

  return (
    <div className="min-h-full bg-background pb-20">
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-bold">Berkah Living</h1>
            <p className="text-xs opacity-80">Ayam Organik & Daging Segar</p>
          </div>
          <Badge className="bg-green-400 text-green-900">Buka</Badge>
        </div>
        <p className="text-xs opacity-70">Jam: 06:00 - 18:00 | Kudus, Jateng</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                activeCategory === c ? "bg-primary text-white" : "bg-white text-muted-foreground border"
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
              <Card key={p.id} className={`overflow-hidden ${p.stock === 0 ? "opacity-60" : ""}`}>
                <div className="h-32 bg-muted flex items-center justify-center">
                  <Package size={32} className="text-muted-foreground" />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium line-clamp-2">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Rp {p.price.toLocaleString("id-ID")}</p>
                    {p.stock === 0 ? (
                      <Badge className="bg-red-100 text-red-700 text-[10px]">Habis</Badge>
                    ) : qty > 0 ? (
                      <div className="flex items-center gap-1">
                        <Button size="icon" className="h-7 w-7" onClick={() => updateQty(p.id, qty - 1)}><Minus size={12} /></Button>
                        <span className="text-sm font-medium w-5 text-center">{qty}</span>
                        <Button size="icon" className="h-7 w-7" onClick={() => updateQty(p.id, qty + 1)}><Plus size={12} /></Button>
                      </div>
                    ) : (
                      <Button size="sm" className="h-7 px-2" onClick={() => addItem({ productId: p.id, name: p.name, price: p.price, qty: 1, imageUrl: p.imageUrl })}>+</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {totalItems > 0 && (
        <Link href="/buyer/cart">
          <div className="fixed bottom-4 left-4 right-4 bg-primary text-white rounded-xl p-3 flex items-center justify-between shadow-lg z-50">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              <span className="text-sm font-medium">{totalItems} item</span>
            </div>
            <span className="text-sm font-bold">Lihat Keranjang →</span>
          </div>
        </Link>
      )}
    </div>
  );
}
