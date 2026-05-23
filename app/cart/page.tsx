"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQty, removeItem, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <Trash2 size={32} className="text-muted-foreground" />
        </div>
        <p className="text-lg font-medium mb-1">Keranjang kosong</p>
        <p className="text-sm text-muted-foreground mb-4">Yuk tambah produk dulu</p>
        <Link href="/catalog">
          <Button>Lihat Katalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background pb-24">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/catalog">
            <ArrowLeft size={20} className="text-muted-foreground" />
          </Link>
          <h1 className="text-lg font-bold">Keranjang</h1>
        </div>

        <div className="space-y-2">
          {items.map(({ productId, name, price, qty }) => (
            <Card key={productId}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xs text-muted-foreground">IMG</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-muted-foreground">Rp {price.toLocaleString("id-ID")}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button size="icon" className="h-7 w-7" onClick={() => updateQty(productId, qty - 1)}><Minus size={12} /></Button>
                      <span className="text-sm font-medium w-5 text-center">{qty}</span>
                      <Button size="icon" className="h-7 w-7" onClick={() => updateQty(productId, qty + 1)}><Plus size={12} /></Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Rp {(qty * price).toLocaleString("id-ID")}</p>
                    <button onClick={() => removeItem(productId)} className="text-red-500 text-xs mt-1">Hapus</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <button onClick={clearCart} className="text-sm text-red-500 mt-3">Kosongkan keranjang</button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-bold">Rp {getTotal().toLocaleString("id-ID")}</span>
        </div>
        <Link href="/checkout">
          <Button className="w-full">Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
