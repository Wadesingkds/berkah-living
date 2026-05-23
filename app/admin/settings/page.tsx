"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, FileText, Bot, Bell, ShoppingCart, Settings, Users, LogOut } from "lucide-react";

const menuItems = [
  { label: "Laporan Bisnis", icon: FileText, href: "#" },
  { label: "AI Chat (Owner Agent)", icon: Bot, href: "#" },
  { label: "Insights Harian", icon: Bell, href: "#" },
  { label: "Retention & Followup", icon: Bell, href: "#" },
  { label: "Daftar Belanja Supplier", icon: ShoppingCart, href: "#" },
  { label: "Pre-order", icon: ShoppingCart, href: "#" },
  { label: "Pengaturan Toko", icon: Settings, href: "/admin/settings/store-simple" },
  { label: "Admin & Akses", icon: Users, href: "#" },
];

export default function SettingsPage() {
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-bold">Lainnya</h1>
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href !== "#";
          
          const cardContent = (
            <Card key={item.label} className={`${isActive ? "cursor-pointer hover:bg-muted/50" : "opacity-50 cursor-not-allowed"}`}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </CardContent>
            </Card>
          );

          return isActive ? (
            <Link key={item.label} href={item.href}>
              {cardContent}
            </Link>
          ) : (
            cardContent
          );
        })}
      </div>
      <button className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-medium text-sm">
        <LogOut size={16} /> Keluar
      </button>
    </div>
  );
}
