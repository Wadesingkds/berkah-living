"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, AlertTriangle, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const categories = ["Semua", "Ayam", "Daging", "Sayur", "Bumbu"];

const mockProducts = [
  { id: "1", name: "Ayam Kampung Utuh", price: 85000, stock: 12, min_stock: 10, category: "Ayam", image_url: null },
  { id: "2", name: "Ayam Petelur Potong", price: 45000, stock: 3, min_stock: 5, category: "Ayam", image_url: null },
  { id: "3", name: "Daging Sapi Giling", price: 120000, stock: 8, min_stock: 5, category: "Daging", image_url: null },
  { id: "4", name: "Daging Kambing", price: 150000, stock: 0, min_stock: 3, category: "Daging", image_url: null },
  { id: "5", name: "Bayam Segar", price: 5000, stock: 20, min_stock: 10, category: "Sayur", image_url: null },
];

export default function StockPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof mockProducts[0] | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);

  const filtered = mockProducts.filter((p) => {
    if (activeCategory !== "Semua" && p.category !== activeCategory) return false;
    return p.name.toLowerCase().includes(search.toLowerCase());
  });

  const criticalCount = mockProducts.filter((p) => p.stock <= p.min_stock && p.stock > 0).length;
  const outOfStock = mockProducts.filter((p) => p.stock === 0).length;

  return (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">SKU Aktif</p>
            <p className="text-lg font-bold">{mockProducts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Stok Kritis</p>
            <p className="text-lg font-bold text-amber-500">{criticalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Habis</p>
            <p className="text-lg font-bold text-red-500">{outOfStock}</p>
          </CardContent>
        </Card>
      </div>

      {criticalCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">{criticalCount} produk stok menipis, perlu restock</p>
        </div>
      )}

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

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

      <div className="space-y-2">
        {filtered.map((p) => (
          <Card key={p.id} className="cursor-pointer" onClick={() => { setSelected(p); setAdjustQty(0); }}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Package size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    {p.stock === 0 && <Badge className="bg-red-100 text-red-700 text-[10px]">Habis</Badge>}
                    {p.stock > 0 && p.stock <= p.min_stock && <Badge className="bg-amber-100 text-amber-700 text-[10px]">Tipis</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-bold">Rp {p.price.toLocaleString("id-ID")}</p>
                    <p className={`text-xs font-medium ${p.stock <= p.min_stock ? "text-red-500" : "text-green-600"}`}>
                      Stok: {p.stock}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Harga</span>
                <span className="font-medium">Rp {selected.price.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stok sekarang</span>
                <span className={`font-medium ${selected.stock <= selected.min_stock ? "text-red-500" : ""}`}>{selected.stock}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stok minimum</span>
                <span className="font-medium">{selected.min_stock}</span>
              </div>

              <div className="flex items-center justify-center gap-4 py-2">
                <Button size="icon" variant="outline" onClick={() => setAdjustQty((q) => q - 1)}><Minus size={14} /></Button>
                <span className="text-lg font-bold w-8 text-center">{adjustQty > 0 ? `+${adjustQty}` : adjustQty}</span>
                <Button size="icon" variant="outline" onClick={() => setAdjustQty((q) => q + 1)}><Plus size={14} /></Button>
              </div>

              <Button className="w-full" disabled={adjustQty === 0}>Simpan Perubahan</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
