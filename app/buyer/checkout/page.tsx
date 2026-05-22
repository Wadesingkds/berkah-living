"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cart";
import { ArrowLeft, QrCode, Banknote, Truck, MapPin, Store } from "lucide-react";
import Link from "next/link";

type PaymentMethod = "QRIS" | "TRANSFER" | "COD";
type DeliveryMethod = "PICKUP" | "DELIVERY";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [payment, setPayment] = useState<PaymentMethod>("QRIS");
  const [delivery, setDelivery] = useState<DeliveryMethod>("DELIVERY");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-4 text-center">
        <p className="text-lg font-medium mb-1">Keranjang kosong</p>
        <Link href="/buyer/catalog">
          <Button className="mt-4">Lihat Katalog</Button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-4 text-center pb-24">
        {payment === "QRIS" && qrCode ? (
          <>
            <div className="mb-4">
              <img src={qrCode} alt="QRIS QR Code" className="w-64 h-64 rounded-lg" />
            </div>
            <p className="text-lg font-bold mb-1">Scan QRIS untuk bayar</p>
            <p className="text-sm text-muted-foreground mb-4">Rp {getTotal().toLocaleString("id-ID")}</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <QrCode size={32} className="text-green-600" />
            </div>
            <p className="text-lg font-bold mb-1">Order berhasil dibuat!</p>
            <p className="text-sm text-muted-foreground mb-4">
              {payment === "TRANSFER" ? "Transfer ke rekening BNI 884343871" : "Bayar saat barang sampai"}
            </p>
          </>
        )}
        <Link href="/buyer/catalog">
          <Button>Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!name || !phone) {
      alert('Nama dan nomor WhatsApp harus diisi');
      return;
    }

    setLoading(true);
    try {
      // Create order in Supabase
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: `ORD-${Date.now()}`,
          customer_id: null, // TODO: get from auth
          total: getTotal(),
          status: 'PENDING',
          payment_type: payment,
          source: 'CATALOG',
          notes: notes,
        }),
      });

      const order = await orderResponse.json();

      if (payment === 'QRIS') {
        // Create QRIS payment
        const qrisResponse = await fetch('/api/payment/qris', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            amount: getTotal(),
            customerName: name,
            customerPhone: phone,
          }),
        });

        const qrisData = await qrisResponse.json();
        if (qrisData.success) {
          setQrCode(qrisData.qrCodeUrl);
          setTransactionId(qrisData.transactionId);
        }
      }

      clearCart();
      setSubmitted(true);
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-background pb-24">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/buyer/cart">
            <ArrowLeft size={20} className="text-muted-foreground" />
          </Link>
          <h1 className="text-lg font-bold">Checkout</h1>
        </div>

        <Card>
          <CardContent className="p-3 space-y-2">
            {items.map(({ productId, name, price, qty }) => (
              <div key={productId} className="flex justify-between text-sm">
                <span>{name} x{qty}</span>
                <span className="font-medium">Rp {(qty * price).toLocaleString("id-ID")}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>Rp {getTotal().toLocaleString("id-ID")}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Data Pembeli</Label>
          <Input placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Nomor WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Pengiriman</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDelivery("PICKUP")}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm ${
                delivery === "PICKUP" ? "border-primary bg-primary/5 text-primary" : "border-border"
              }`}
            >
              <Store size={20} />
              <span>Ambil Sendiri</span>
            </button>
            <button
              onClick={() => setDelivery("DELIVERY")}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm ${
                delivery === "DELIVERY" ? "border-primary bg-primary/5 text-primary" : "border-border"
              }`}
            >
              <Truck size={20} />
              <span>Diantar</span>
            </button>
          </div>
          {delivery === "DELIVERY" && (
            <Textarea placeholder="Alamat lengkap" value={address} onChange={(e) => setAddress(e.target.value)} />
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Metode Pembayaran</Label>
          <div className="space-y-2">
            <button
              onClick={() => setPayment("QRIS")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm ${
                payment === "QRIS" ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <QrCode size={20} className={payment === "QRIS" ? "text-primary" : "text-muted-foreground"} />
              <span className="flex-1 text-left">QRIS (Scan & Pay)</span>
              {payment === "QRIS" && <div className="w-4 h-4 rounded-full bg-primary" />}
            </button>
            <button
              onClick={() => setPayment("TRANSFER")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm ${
                payment === "TRANSFER" ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <Banknote size={20} className={payment === "TRANSFER" ? "text-primary" : "text-muted-foreground"} />
              <span className="flex-1 text-left">Transfer Bank</span>
              {payment === "TRANSFER" && <div className="w-4 h-4 rounded-full bg-primary" />}
            </button>
            <button
              onClick={() => setPayment("COD")}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm ${
                payment === "COD" ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <MapPin size={20} className={payment === "COD" ? "text-primary" : "text-muted-foreground"} />
              <span className="flex-1 text-left">COD (Bayar di Tempat)</span>
              {payment === "COD" && <div className="w-4 h-4 rounded-full bg-primary" />}
            </button>
          </div>
        </div>

        <Textarea placeholder="Catatan (opsional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button className="w-full" onClick={handleSubmit} disabled={!name || !phone || (delivery === "DELIVERY" && !address)}>
          Buat Order
        </Button>
      </div>
    </div>
  );
}
