"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Search, Plus, Phone, MapPin, Truck, CheckCircle, XCircle } from "lucide-react";

const tabs = ["Semua", "Perlu Approval", "Sudah Dibayar", "Selesai"];

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  DELIVERED: "bg-blue-100 text-blue-700",
  DONE: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const paymentLabels: Record<string, string> = { QRIS: "QRIS", TRANSFER: "Transfer", COD: "COD" };

type OrderStatus = 'PENDING' | 'PAID' | 'DELIVERED' | 'DONE' | 'CANCELLED';
type PaymentType = 'QRIS' | 'TRANSFER' | 'COD';

interface MockOrder {
  id: string;
  order_number: string;
  customer: { name: string; phone: string };
  total: number;
  status: OrderStatus;
  payment_type: PaymentType;
  items: { product: { name: string }; qty: number }[];
  notes: string | null;
  created_at: string;
}

const mockOrders: MockOrder[] = [
  { id: "550e8400-e29b-41d4-a716-446655440001", order_number: "ORD-20260522-0001", customer: { name: "Budi Santoso", phone: "08123456789" }, total: 450000, status: "PENDING", payment_type: "QRIS", items: [{ product: { name: "Ayam Kampung Utuh" }, qty: 2 }, { product: { name: "Daging Sapi Giling" }, qty: 1 }], notes: "Antar pagi ya", created_at: "2026-05-22 08:30" },
  { id: "550e8400-e29b-41d4-a716-446655440002", order_number: "ORD-20260522-0002", customer: { name: "Ani Wulandari", phone: "08234567890" }, total: 280000, status: "PAID", payment_type: "TRANSFER", items: [{ product: { name: "Ayam Kampung Utuh" }, qty: 1 }], notes: null, created_at: "2026-05-22 09:15" },
  { id: "550e8400-e29b-41d4-a716-446655440003", order_number: "ORD-20260522-0003", customer: { name: "Citra Lestari", phone: "08345678901" }, total: 620000, status: "DELIVERED", payment_type: "COD", items: [{ product: { name: "Daging Sapi Giling" }, qty: 2 }, { product: { name: "Ayam Kampung Utuh" }, qty: 1 }], notes: "Rumah warna hijau", created_at: "2026-05-22 10:00" },
  { id: "550e8400-e29b-41d4-a716-446655440004", order_number: "ORD-20260522-0004", customer: { name: "Dedi Pratama", phone: "08456789012" }, total: 150000, status: "DONE", payment_type: "QRIS", items: [{ product: { name: "Ayam Kampung Utuh" }, qty: 1 }], notes: null, created_at: "2026-05-22 07:00" },
];

interface Driver {
  id: string;
  name: string;
  phone: string;
  type: 'INTERNAL' | 'GRAB' | 'GOJEK';
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MockOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<MockOrder[]>(mockOrders);
  const [fetching, setFetching] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const [ordersRes, driversRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/drivers'),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.length > 0) {
            setOrders(ordersData);
          }
        }

        if (driversRes.ok) {
          const driversData = await driversRes.json();
          setDrivers(driversData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelected({ ...selected, status: 'PAID' as const });
        alert('Order approved');
      } else {
        alert('Failed to approve order');
      }
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      if (res.ok) {
        setSelected(null);
        alert('Order cancelled');
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!selected || !selectedDriverId) return;
    setLoading(true);
    try {
      const driver = drivers.find(d => d.id === selectedDriverId);
      
      const res = await fetch(`/api/orders/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DELIVERED', driver_id: selectedDriverId }),
      });
      
      if (res.ok) {
        // Send WA notification to internal driver
        if (driver?.type === 'INTERNAL') {
          await fetch('/api/wa/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: driver.phone,
              message: `🚚 *Order Baru Assigned*\n\nOrder: ${selected.order_number}\nCustomer: ${selected.customer?.name}\nPhone: ${selected.customer?.phone}\nTotal: Rp ${selected.total.toLocaleString('id-ID')}\nNotes: ${selected.notes || '-'}\n\nSilakan pickup dan deliver ke customer.`
            })
          });
        }
        
        setSelected({ ...selected, status: 'DELIVERED' as const });
        setSelectedDriverId("");
        alert(driver?.type === 'INTERNAL' 
          ? 'Driver assigned & notified via WhatsApp' 
          : `Driver assigned. Order manual via ${driver?.name} app`);
      } else {
        alert('Failed to assign driver');
      }
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    if (activeTab === "Perlu Approval") return o.status === "PENDING";
    if (activeTab === "Sudah Dibayar") return o.status === "PAID";
    if (activeTab === "Selesai") return o.status === "DONE";
    return true;
  }).filter((o) => {
    const customerName = o.customer?.name || '';
    return customerName.toLowerCase().includes(search.toLowerCase()) || o.order_number.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari order..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="icon" className="shrink-0"><Plus size={18} /></Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === t ? "bg-primary text-white" : "bg-white text-muted-foreground border"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((order) => (
          <Card key={order.id} className="cursor-pointer" onClick={() => setSelected(order)}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {order.customer?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{order.customer?.name || 'Unknown Customer'}</p>
                    <p className="text-xs text-muted-foreground">{order.order_number}</p>
                  </div>
                </div>
                <Badge className={statusColors[order.status]}>{order.status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                {order.items?.map((i) => `${i.product.name} x${i.qty}`).join(", ") || 'No items'}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Rp {order.total.toLocaleString("id-ID")}</p>
                <Badge variant="outline" className="text-xs">{paymentLabels[order.payment_type]}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">{selected?.order_number}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {selected.customer?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium">{selected.customer?.name || 'Unknown Customer'}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone size={12} /> {selected.customer?.phone || 'No phone'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {selected.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.product.name} x{item.qty}</span>
                    <span className="font-medium">Rp {(item.qty * selected.total / selected.items.length).toLocaleString("id-ID")}</span>
                  </div>
                )) || <p className="text-sm text-muted-foreground">No items</p>}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp {selected.total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {selected.notes && (
                <div className="flex items-start gap-1 text-sm text-muted-foreground">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <span>{selected.notes}</span>
                </div>
              )}

              {selected.status === "PAID" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pilih Driver</label>
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="">Pilih driver...</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.type === 'INTERNAL' ? '👤' : driver.type === 'GRAB' ? '🚗' : '🏍️'} {driver.name} {driver.type !== 'INTERNAL' && `(${driver.type})`}
                      </option>
                    ))}
                  </select>
                  {selectedDriverId && drivers.find(d => d.id === selectedDriverId)?.type !== 'INTERNAL' && (
                    <p className="text-xs text-amber-600">⚠️ Order manual via app {drivers.find(d => d.id === selectedDriverId)?.name}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selected.status === "PENDING" && (
                  <Button 
                    className="flex-1" 
                    size="sm" 
                    onClick={handleApprove}
                    disabled={loading}
                  >
                    <CheckCircle size={14} className="mr-1" /> {loading ? 'Processing...' : 'Approve'}
                  </Button>
                )}
                {selected.status === "PAID" && (
                  <Button 
                    className="flex-1" 
                    size="sm" 
                    variant="secondary"
                    onClick={handleAssignDriver}
                    disabled={loading || !selectedDriverId}
                  >
                    <Truck size={14} className="mr-1" /> {loading ? 'Processing...' : 'Assign Driver'}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <XCircle size={14} className="mr-1" /> {loading ? 'Processing...' : 'Batalkan'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
