"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface StoreSettings {
  store_name: string;
  store_description: string;
  store_phone: string;
  store_email: string;
  store_address: string;
  whatsapp_number: string;
  is_open: boolean;
  opening_hours: string;
  closing_hours: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
}

export default function StoreSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "",
    store_description: "",
    store_phone: "",
    store_email: "",
    store_address: "",
    whatsapp_number: "",
    is_open: true,
    opening_hours: "08:00",
    closing_hours: "20:00",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings/store");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Pengaturan toko berhasil disimpan");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      alert("Gagal menyimpan pengaturan toko");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-lg font-bold">Pengaturan Toko</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informasi Toko</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_name">Nama Toko</Label>
            <Input
              id="store_name"
              value={settings.store_name}
              onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
              placeholder="Berkah Living"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_description">Deskripsi Toko</Label>
            <Textarea
              id="store_description"
              value={settings.store_description}
              onChange={(e) => setSettings({ ...settings, store_description: e.target.value })}
              placeholder="Deskripsi singkat tentang toko Anda"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_phone">Nomor Telepon</Label>
            <Input
              id="store_phone"
              value={settings.store_phone}
              onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
              placeholder="08123456789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_email">Email</Label>
            <Input
              id="store_email"
              type="email"
              value={settings.store_email}
              onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
              placeholder="toko@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store_address">Alamat Toko</Label>
            <Textarea
              id="store_address"
              value={settings.store_address}
              onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
              placeholder="Alamat lengkap toko"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">Nomor WhatsApp</Label>
            <Input
              id="whatsapp_number"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="6282220205694"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Jam Operasional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              id="is_open"
              type="checkbox"
              checked={settings.is_open}
              onChange={(e) => setSettings({ ...settings, is_open: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="is_open">Toko Buka</Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="opening_hours">Jam Buka</Label>
              <Input
                id="opening_hours"
                type="time"
                value={settings.opening_hours}
                onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closing_hours">Jam Tutup</Label>
              <Input
                id="closing_hours"
                type="time"
                value={settings.closing_hours}
                onChange={(e) => setSettings({ ...settings, closing_hours: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informasi Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank_name">Nama Bank</Label>
            <Input
              id="bank_name"
              value={settings.bank_name}
              onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
              placeholder="BNI"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_account_number">Nomor Rekening</Label>
            <Input
              id="bank_account_number"
              value={settings.bank_account_number}
              onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
              placeholder="884343871"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_account_name">Nama Pemilik Rekening</Label>
            <Input
              id="bank_account_name"
              value={settings.bank_account_name}
              onChange={(e) => setSettings({ ...settings, bank_account_name: e.target.value })}
              placeholder="Didik Prasetiadi"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Simpan Pengaturan
          </>
        )}
      </Button>
    </div>
  );
}
