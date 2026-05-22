"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Search, Phone, MessageCircle, Crown } from "lucide-react";

const tabs = ["Customer", "Driver", "Supplier"];

const mockCustomers = [
  { id: "1", name: "Budi Santoso", phone: "08123456789", is_vip: true, total_orders: 15, total_spend: 2500000, last_order_at: "2026-05-22" },
  { id: "2", name: "Ani Wulandari", phone: "08234567890", is_vip: false, total_orders: 3, total_spend: 450000, last_order_at: "2026-05-20" },
  { id: "3", name: "Citra Lestari", phone: "08345678901", is_vip: true, total_orders: 12, total_spend: 1800000, last_order_at: "2026-05-18" },
  { id: "4", name: "Dedi Pratama", phone: "08456789012", is_vip: false, total_orders: 1, total_spend: 150000, last_order_at: "2026-05-10" },
];

const mockDrivers = [
  { id: "1", name: "Pak Tono", phone: "08567890123" },
  { id: "2", name: "Pak Sardi", phone: "08678901234" },
];

const mockSuppliers = [
  { id: "1", name: "Pak Slamet (Peternak)", phone: "08789012345" },
  { id: "2", name: "Bu Siti (Sayuran)", phone: "08890123456" },
];

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState("Customer");
  const [search, setSearch] = useState("");

  const data = activeTab === "Customer" ? mockCustomers : activeTab === "Driver" ? mockDrivers : mockSuppliers;
  const filtered = data.filter((d: { name: string; phone: string }) => d.name.toLowerCase().includes(search.toLowerCase()) || d.phone.includes(search));

  return (
    <div className="p-4 space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari nama atau nomor..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
            {t} ({(t === "Customer" ? mockCustomers : t === "Driver" ? mockDrivers : mockSuppliers).length})
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((d: { id: string; name: string; phone: string; is_vip?: boolean; total_orders?: number; total_spend?: number }) => (
          <Card key={d.id}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  activeTab === "Customer" ? "bg-primary/10 text-primary" : activeTab === "Driver" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                }`}>
                  {d.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{d.name}</p>
                    {d.is_vip && <Crown size={12} className="text-amber-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{d.phone}</p>
                  {activeTab === "Customer" && d.total_orders && d.total_spend && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{d.total_orders} order</span>
                      <span>Rp {(d.total_spend / 1000000).toFixed(1)}jt</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <a href={`https://wa.me/${d.phone}`} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                    <MessageCircle size={14} />
                  </a>
                  <a href={`tel:${d.phone}`} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                    <Phone size={14} />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
