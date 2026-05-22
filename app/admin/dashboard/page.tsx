"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ShoppingCart, DollarSign, AlertTriangle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const chartData = [
  { day: "Sen", omzet: 1200000 },
  { day: "Sel", omzet: 1500000 },
  { day: "Rab", omzet: 980000 },
  { day: "Kam", omzet: 2100000 },
  { day: "Jum", omzet: 1750000 },
  { day: "Sab", omzet: 2300000 },
  { day: "Min", omzet: 1900000 },
];

const stats = [
  { label: "Order Hari Ini", value: "12", icon: ShoppingCart, color: "text-primary" },
  { label: "Omzet Hari Ini", value: "Rp 1.9jt", icon: DollarSign, color: "text-green-600" },
  { label: "Pending Transfer", value: "3", icon: Clock, color: "text-amber-500" },
  { label: "Stok Kritis", value: "5 SKU", icon: AlertTriangle, color: "text-red-500" },
];

export default function DashboardPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Halo, Berkah</h1>
          <p className="text-sm text-muted-foreground">Jumat, 22 Mei 2026</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700">Toko Buka</Badge>
      </div>

      <Card className="bg-gradient-to-r from-primary to-orange-500 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm opacity-90">Insight Hari Ini</p>
              <p className="text-sm leading-relaxed">
                Omzet naik 23% dari rata-rata minggu lalu. Produk terlaris: Ayam Kampung Utuh. Customer baru 3 orang, repeat 9.
              </p>
            </div>
            <TrendingUp size={20} className="opacity-80 shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={s.color} />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <p className="text-lg font-bold">{s.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tren Omzet 7 Hari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => [`Rp ${Number(v).toLocaleString("id-ID")}`, "Omzet"]}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="omzet" fill="#E8442A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Aktivitas Chat (1 jam terakhir)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {["Budi - tanya stok ayam", "Ani - konfirmasi alamat", "Citra - tanya harga"].map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>{a}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
