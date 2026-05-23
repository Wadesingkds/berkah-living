"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Package, Users, MoreHorizontal } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Beranda", icon: Home },
  { href: "/admin/orders", label: "Order", icon: ClipboardList },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/stock", label: "Stok", icon: Package },
  { href: "/admin/contacts", label: "Kontak", icon: Users },
  { href: "/admin/settings", label: "Lainnya", icon: MoreHorizontal },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-full pb-20">
      <main className="flex-1">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 text-xs ${
                  active ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
